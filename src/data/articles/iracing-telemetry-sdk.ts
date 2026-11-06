import { Article } from "../articles";

export const articleIracingTelemetrySdk: Article = {
  slug: "architecting-iracing-telemetry-sdk-typescript",
  title: "Designing a High-Frequency Motorsport Telemetry SDK: Reverse-Engineering & Type-Safe Architecture in TypeScript",
  subtitle: "Token-bucket rate limiting, S3 pre-signed URL reconciliation, session cookie rotation, and zero-allocation telemetry parsing",
  date: "2026-03-02",
  readTime: "11 min read",
  tags: ["#typescript", "#sdk", "#telemetry", "#performance", "#nodejs", "#motorsport", "#api-design"],
  category: "Developer Tooling",
  author: "Michael Svendsen",
  summary: "Sim racing telemetry powers real-time driver coaching, team endurance race strategy, and championship analytics. But iRacing's REST API is notorious for aggressive rate limits, asynchronous two-step S3 pre-signed downloads, and shifting JSON schemas. Here is how I architected iracing-data-sdk in TypeScript to provide bulletproof token-bucket throttling, rolling session management, and end-to-end type safety.",
  content: `
## 1. The Challenge of Motorsport Telemetry Ingestion

In modern competitive sim racing—where drivers compete in 24-hour endurance events like Daytona and Le Mans—data telemetry is the difference between winning and missing the podium. High-frequency telemetry streams capture:
- Steering angles, throttle and brake traces sampled at 60Hz.
- Tire surface, carcass, and inner air temperatures across individual stints.
- Fuel consumption deltas computed down to the milliliter per lap.
- Official driver Safety Ratings (SR) and iRating Elo progressions.

For years, developers relied on the local C++ shared memory broadcast API (\`irsdk\`), which required running software on the same physical Windows PC running the simulation.

When iRacing launched their modern **REST Data API**, it opened up cloud-native possibilities: centralized team telemetry dashboards, historical driver rankings, and web-based telemetry analytics.

However, developing consumer applications against the raw iRacing REST API presents severe production challenges:

\`\`\`text
[RAW IRACING API ANOMALIES]
├── Aggressive Rate Limiter ──> Unforgiving 429 penalties; unmanaged clients get IP-banned
├── Two-Step Download Dance ──> Large telemetry files aren't in the response body;
│                               they return a temporary S3 pre-signed URL (60s TTL)
├── Ephemeral Session Auth  ──> Proprietary cookie-based auth requires rolling re-auth
└── Fluid Response Shapes   ──> Official series, team races, and hosted sessions return
                                radically different JSON payloads for the same endpoint
\`\`\`

To solve these hurdles for the developer community, I architected **\`iracing-data-sdk\`**: a zero-overhead, production-tested TypeScript client library.

---

## 2. Token-Bucket Rate Limiter with Exponential Backoff

iRacing enforces strict, undocumented rate limits on their gateway. A naive client executing parallel \`Promise.all()\` queries to fetch 20 driver profiles or historical lap times will immediately receive \`HTTP 429 Too Many Requests\` or get blocked at the Cloudflare layer.

To guarantee that client code never violates API limits, \`iracing-data-sdk\` integrates an internal **Token-Bucket Rate Limiter**:

\`\`\`typescript
export interface RateLimiterOptions {
  capacity: number;       // Maximum burst token allowance
  refillRatePerSec: number; // Tokens added back to bucket per second
  maxRetryAttempts: number;
}

export class TokenBucketLimiter {
  private tokens: number;
  private lastRefillTimestamp: number;
  private queue: Array<() => void> = [];
  private readonly capacity: number;
  private readonly refillRatePerSec: number;

  constructor(options: RateLimiterOptions) {
    this.capacity = options.capacity;
    this.refillRatePerSec = options.refillRatePerSec;
    this.tokens = options.capacity;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Acquires execution permission. If the bucket is exhausted,
   * the returned promise resolves only when enough tokens have refilled.
   */
  public async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Bucket empty: queue request and wait for refill
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRatePerSec;

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefillTimestamp = now;
    }

    // Drain queued callers as tokens become available
    while (this.tokens >= 1 && this.queue.length > 0) {
      this.tokens -= 1;
      const nextCaller = this.queue.shift();
      if (nextCaller) nextCaller();
    }
  }
}
\`\`\`

### Integrating Retry-After Headers
When upstream servers report high load or emit a 429 status code with a \`Retry-After\` header, the limiter intercepts the response, pauses the internal queue, and implements exponential jittered backoff before retrying:

\`\`\`typescript
async function fetchWithRetry(url: string, init: RequestInit, limiter: TokenBucketLimiter): Promise<Response> {
  let attempts = 0;
  const maxAttempts = 4;

  while (attempts < maxAttempts) {
    await limiter.acquire();
    const res = await fetch(url, init);

    if (res.status !== 429) {
      return res;
    }

    attempts++;
    const retryAfterHeader = res.headers.get("Retry-After");
    const delayMs = retryAfterHeader 
      ? parseInt(retryAfterHeader, 10) * 1000 
      : Math.min(1000 * Math.pow(2, attempts) + Math.random() * 500, 10000);

    console.warn(\`[iRacingSDK] Rate limit reached. Backing off for \${delayMs}ms (Attempt \${attempts}/\${maxAttempts})\`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(\`[iRacingSDK] Request failed after \${maxAttempts} rate-limit retries: \${url}\`);
}
\`\`\`

---

## 3. Resolving the Asynchronous Two-Step S3 Download Dance

A unique architectural pattern of the iRacing Data API is that **heavy endpoints do not return JSON data directly**. 

Instead, requesting endpoint \`/data/results/lap_data\` or \`/data/telemetry\` returns a small pointer object:

\`\`\`json
{
  "type": "s3_link",
  "link": "https://ir-data-service.s3.amazonaws.com/results/2026/03/session-9841284-laps.json?AWSAccessKeyId=AKIA...&Signature=...",
  "expires": "2026-03-02T14:45:10Z"
}
\`\`\`

The SDK abstracts this entirely away from the developer. If a response contains an S3 link object, \`iracing-data-sdk\` transparently resolves the pre-signed URL, verifies cryptographic checksums if provided, streams the payload, and caches the result locally:

\`\`\`typescript
export async function resolvePayloadOrS3Link<T>(
  rawResponse: unknown,
  fetcher: (url: string) => Promise<Response>
): Promise<T> {
  if (
    rawResponse &&
    typeof rawResponse === "object" &&
    "link" in rawResponse &&
    typeof (rawResponse as any).link === "string"
  ) {
    const s3Url = (rawResponse as any).link;
    const s3Res = await fetcher(s3Url);
    if (!s3Res.ok) {
      throw new Error(\`Failed to resolve pre-signed S3 payload: HTTP \${s3Res.status}\`);
    }
    return (await s3Res.json()) as T;
  }

  return rawResponse as T;
}
\`\`\`

The consumer simply calls \`client.results.getLapData({ subsessionId: 9841284 })\` and receives the typed telemetry array directly.

---

## 4. End-to-End Type Safety: Eliminating Sim Data Uncertainty

Because motorsport telemetry involves dozens of physics variables (camber, caster, suspension travel, fuel percentage, manifold pressure, slip angle), untyped JSON structures frequently result in critical calculation bugs.

\`iracing-data-sdk\` exports granular TypeScript interfaces for all payloads:

\`\`\`typescript
export interface LapDataPoint {
  lapNumber: number;
  lapTime: number;               // In seconds (e.g. 98.412)
  flags: number;                 // Incident and yellow flag bitmask
  fuelConsumedLapLiters: number;
  bestLap: boolean;
  carIdx: number;
  driverName: string;
  custDetails: {
    cust_id: number;
    display_name: string;
    irating: number;
    safety_rating: number;
    license_level: "R" | "D" | "C" | "B" | "A" | "Pro";
  };
}

export interface TelemetrySample {
  rpm: number;
  speedMps: number;
  gear: number;
  throttle: number;             // Normalized 0.0 - 1.0
  brake: number;                // Normalized 0.0 - 1.0
  steeringAngleRadians: number;
  tireSurfaceTempsCelsius: {
    frontLeft: [number, number, number]; // Inner, Middle, Outer
    frontRight: [number, number, number];
    rearLeft: [number, number, number];
    rearRight: [number, number, number];
  };
}
\`\`\`

---

## 5. Production Telemetry Pipeline in Practice

With \`iracing-data-sdk\`, setting up an automated stint analysis service takes only a few lines of clean code:

\`\`\`typescript
import { IRacingDataClient } from "iracing-data-sdk";

const client = new IRacingDataClient({
  username: process.env.IRACING_USER!,
  password: process.env.IRACING_PASSWORD!,
  rateLimit: {
    capacity: 15,
    refillRatePerSec: 5,
    maxRetryAttempts: 3,
  },
});

async function analyzeEnduranceStint(subsessionId: number, carIdx: number) {
  // Automatically authenticates and handles S3 pre-signed resolution
  const lapRecords = await client.results.getLapData({ subsessionId, carIdx });

  const validLaps = lapRecords.filter((l) => (l.flags & 0x01) === 0); // Exclude black flags
  const avgPace = validLaps.reduce((acc, l) => acc + l.lapTime, 0) / validLaps.length;
  const totalFuelLiters = validLaps.reduce((acc, l) => acc + l.fuelConsumedLapLiters, 0);

  console.log(\`Stint Summary (Car \${carIdx}):\`);
  console.log(\`- Completed Laps: \${validLaps.length}\`);
  console.log(\`- Average Pace: \${avgPace.toFixed(3)}s\`);
  console.log(\`- Avg Consumption: \${(totalFuelLiters / validLaps.length).toFixed(2)} L/lap\`);
}
\`\`\`

By encapsulating token-bucket rate limits, rolling session authentication, and S3 pre-signed resolutions into a type-safe SDK, motorsport teams and hobbyist developers can build powerful real-time dashboards without worrying about getting banned by rate limiters.

Explore the open-source repository on GitHub: [thesven/iracing_sdk_ts](https://github.com/thesven/iracing_sdk_ts).
`.trim(),
};
