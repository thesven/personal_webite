export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  summary: string;
  author: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "snowflake-dbt-shopify-ecommerce-analytics",
    title: "Snowflake and dbt for E-Commerce Analytics: How We Built a Shopify Data Platform",
    subtitle: "The unglamorous data layer that makes AI trustworthy: establishing a single source of truth between merchant dashboards and autonomous agents",
    date: "2026-07-15",
    readTime: "6 min read",
    tags: ["#data-engineering", "#snowflake", "#dbt", "#ai-agents", "#shopify"],
    category: "Data Platform",
    author: "Michael Svendsen",
    summary: "Everyone's racing to bolt AI agents onto products. But AI that recommends what to feature in a store is only as good as the numbers underneath it. Here is how we architected Snowflake and dbt so dashboards and AI agents consume the exact same verified numbers.",
    content: `
### 1. The Trust Problem with AI in E-Commerce

Everyone is racing to bolt AI agents onto their software. But AI that recommends what to feature in a merchant's store is only as good as the numbers underneath it.

If the analytics dashboard says one thing and the AI agent claims another, the merchant immediately stops trusting both. To prevent this dissonance at Reactiv, before building user-facing agentic tools, we engineered the platform underneath them: **Snowflake** for the analytical heavy lifting and **dbt** to transform raw merchant streams into product-ready, mathematically verified datasets.

\`\`\`text
Shopify Event Stream ──> AWS Ingestion ──> Snowflake Raw
                                                │
                                          dbt Modeling
                                                │
                                    Unified Metric Store
                                      ┌─────────┴─────────┐
                                      ▼                   ▼
                            Merchant Dashboards    AI Studio Agent
\`\`\`

### 2. The Core Decision: One Source of Truth

The fundamental architectural principle was simple: **one place where metrics get computed, one set of numbers everyone reads.**

Dashboards and AI agents consume the exact same exported data. We modeled our dbt pipelines that way back when the dashboard was the only consumer:

\`\`\`sql
-- models/marts/ecommerce/fct_product_performance.sql
{{ config(
    materialized = 'incremental',
    unique_key = 'product_id',
    cluster_by = ['merchant_id', 'recorded_date']
) }}

select
    p.merchant_id,
    p.product_id,
    p.title,
    count(distinct o.order_id) as total_orders,
    sum(o.gross_revenue_cents) as total_revenue_cents,
    round(count(distinct o.order_id)::float / nullif(count(distinct v.session_id), 0), 4) as conversion_rate
from {{ ref('stg_shopify__products') }} p
left join {{ ref('stg_shopify__orders') }} o on p.product_id = o.product_id
left join {{ ref('stg_analytics__pageviews') }} v on p.product_id = v.product_id
group by 1, 2, 3
\`\`\`

### 3. Powering the AI Studio Agent

When our AI Studio Agent and Scheduler showed up needing a merchant store's top performers to decide what carousels, hero banners, and products to feature, it didn't guess or execute ad-hoc fuzzy queries. It simply read the identical pre-aggregated numbers the merchant already saw on their live dashboard.

By coupling strict dbt schema tests, freshness monitors, and cluster-keyed queries, we reduced core pipeline runtimes by over **50%**, ensuring zero metric drift across our ecosystem.

> [!IMPORTANT]
> The unglamorous data layer is what makes the AI sitting on top of it trustworthy. Without rigorous analytical guarantees, agentic recommendations are merely educated hallucinations.
    `.trim(),
  },
  {
    slug: "spypoint-mcp-trail-camera-ai",
    title: "SPYPOINT MCP: Connecting Trail-Camera Telemetry to AI Assistants",
    subtitle: "Clustering 146 photo records into distinct wildlife visits to predict dawn photography windows with 19 tools and 112 automated tests",
    date: "2026-10-08",
    readTime: "5 min read",
    tags: ["#mcp", "#python", "#iot", "#wildlife-photography", "#ai"],
    category: "Applied AI",
    author: "Michael Svendsen",
    summary: "I wanted to ask my agent: 'Based on my trail-camera photos, when should I go photograph deer tomorrow?' So I built an MCP server for SPYPOINT with 19 tools, 112 automated tests, and burst clustering algorithms.",
    content: `
### 1. The Practical Agent Question

I wanted to ask my AI assistant a practical question:
> *"Based on my trail-camera photos, when should I go photograph deer tomorrow?"*

To solve this, I designed and built an open-source Model Context Protocol (MCP) server for SPYPOINT cellular trail cameras. It connects an LLM agent directly to camera images and sensor metadata, empowering it to inspect actual photos, compare environmental conditions, create contact sheets, and build resumable local archives.

\`\`\`text
Remote Cellular Camera ──(Cellular Uplink)──> SPYPOINT API
                                                   │
                                      spypoint_mcp (Python Server)
                                       ├─ 19 MCP Tools
                                       ├─ 112 Automated Tests
                                       └─ Photo Grouping & Contact Sheets
                                                   │
                                            AI Assistant (Claude)
\`\`\`

### 2. Raw Captures vs. Distinct Visits

For the server's first real-world field test, we pulled 146 photo records. Of those, 104 were tagged as "deer" or "buck".

However, grouping nearby captures by timestamp and burst delta suggested only **14 apparent visits**. That distinction is crucial: 104 photos does not mean 104 separate deer visits. It represents bursts of multi-shot triggers during single grazing intervals.

\`\`\`python
def cluster_camera_captures(records: list[PhotoRecord], window_minutes: int = 15) -> list[WildlifeVisit]:
    """Cluster raw burst records into discrete ecological visits."""
    records.sort(key=lambda r: r.captured_at)
    visits: list[WildlifeVisit] = []
    
    for record in records:
        if not visits or (record.captured_at - visits[-1].end_time).total_seconds() > window_minutes * 60:
            visits.append(WildlifeVisit(start_time=record.captured_at, end_time=record.captured_at, photos=[record]))
        else:
            visits[-1].end_time = record.captured_at
            visits[-1].photos.append(record)
            
    return visits
\`\`\`

### 3. Architecture & Safety Boundaries

The project includes:
- **19 Structured Tools:** Ranging from photo search, camera battery and signal health, to automated contact sheet generation.
- **112 Automated Tests:** Full test suite covering pagination, network retries, and schema contract validation.
- **Strict Read-Only Access:** The server enforces read-only access—no camera setting alterations or paid HD transmission requests are permitted.

The resulting analysis accurately isolated a promising dawn photography window, grounded strictly in empirical sensor data.

Explore the open-source code on GitHub: [thesven/spypoint_mcp](https://github.com/thesven/spypoint_mcp).
    `.trim(),
  },
  {
    slug: "architecting-litemcp-cloudflare-workers",
    title: "Architecting LiteMCP: Bringing Model Context Protocol to Cloudflare Workers",
    subtitle: "Implementing standards-compliant JSON-RPC 2.0 and Server-Sent Events on the serverless edge",
    date: "2026-11-02",
    readTime: "7 min read",
    tags: ["#ai", "#mcp", "#cloudflare", "#typescript"],
    category: "Edge AI & Systems",
    author: "Michael Svendsen",
    summary: "Engineering a lightweight, edge-native Model Context Protocol framework for Cloudflare Workers with real-time SSE streaming, zero cold-starts, and strict type safety.",
    content: `
### 1. Why Edge-Native Model Context Protocol Matters

The Model Context Protocol (MCP) by Anthropic established an open standard for LLM clients to communicate with external data sources, tools, and prompts. However, the reference implementation and community servers were largely designed for local desktop processes (via \`stdio\`) or heavyweight containerized Express runtimes.

When building distributed AI workflows that need to respond globally with sub-50ms latency, running dedicated Node.js servers introduces unnecessary compute overhead and cold starts.

\`\`\`text
Client (Claude / Cursor / Web) ──(HTTP POST / SSE)──> Cloudflare Edge Worker (LiteMCP)
                                                            │
                                              JSON-RPC 2.0 Dispatcher
                                                            │
                                         [Tools]  [Prompts]  [Resources]
\`\`\`

> [!NOTE]
> By eliminating Node.js-specific modules (\`net\`, \`child_process\`) and relying strictly on Web Standards (\`fetch\`, \`ReadableStream\`, \`TransformStream\`), MCP servers can deploy to Cloudflare's global network in under 200ms.

### 2. Streaming Transports: SSE Without Heavy Runtimes

In Cloudflare Workers, long-lived server-sent event (SSE) streams require careful memory and backpressure management. LiteMCP leverages the native \`TransformStream\` API:

\`\`\`typescript
export function createSSEStreamResponse(): { response: Response; writer: WritableStreamDefaultWriter<Uint8Array> } {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const response = new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return { response, writer };
}
\`\`\`

### 3. Standards-Compliant JSON-RPC 2.0 Pipeline

LiteMCP dispatches incoming requests against registered tool schemas, handling validation, error codes (-32601 for Method Not Found, -32602 for Invalid Params), and batch executions deterministically.

\`\`\`typescript
server.registerTool({
  name: "query_device_telemetry",
  description: "Fetches live sensor telemetry from cellular trail cameras",
  parameters: {
    deviceId: { type: "string", required: true },
    metric: { type: "string", enum: ["battery", "signal", "temperature"] },
  },
  handler: async ({ deviceId, metric }) => {
    const data = await fetchDeviceMetric(deviceId, metric);
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  },
});
\`\`\`

### 4. Conclusion & Next Frontiers

Running MCP at the edge transforms AI agent interaction: tools become globally accessible, zero-cold-start APIs capable of querying IoT cameras, telemetry databases, and custom datasets in real time.

Check out the project on GitHub: [thesven/LiteMCP](https://github.com/thesven/LiteMCP).
    `.trim(),
  },
  {
    slug: "multi-agent-orchestration-bedrock-agentcore",
    title: "Multi-Agent Orchestration on AWS Bedrock AgentCore: Building the Studio Scheduler",
    subtitle: "Designing autonomous e-commerce agents that query data, generate native app layouts, and execute 1:1 UI operations without managing servers",
    date: "2026-05-18",
    readTime: "8 min read",
    tags: ["#aws", "#bedrock", "#agentcore", "#copilotkit", "#multi-agent"],
    category: "Agentic Architecture",
    author: "Michael Svendsen",
    summary: "How the Data & AI team at Reactiv leveraged Amazon Bedrock AgentCore and CopilotKit to build an autonomous Studio Agent that turns merchant goals into live, optimized mobile storefronts.",
    content: `
### 1. Moving Beyond Bolted-On Chatbots

Most AI features in SaaS platforms are merely bolted on: a floating chat widget or a magic-wand button that generates static text that cannot be edited or previewed.

When we designed the AI Studio Agent at Reactiv, we established a non-negotiable architectural rule: **anything a user can do, the agent can do, using the exact same tools.**

\`\`\`text
Merchant Prompt: "Optimize my home screen for conversion every Monday at 9am"
                                      │
                   Amazon Bedrock AgentCore Multi-Agent
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   Analytics Inspector        Shopify Catalog        Studio Layout Builder
(Snowflake/dbt metrics)      (Products & Tags)        (Zustand UI Tools)
\`\`\`

### 2. Harnessing Amazon Bedrock AgentCore

Before AgentCore, building an agent harness meant provisioning compute clusters, managing tool registries, state serialization, memory persistence, and IAM authentication from scratch.

With AgentCore:
1. **Managed Agent Harness**: We declare the model, system instructions, and tool definitions in CDK infrastructure-as-code.
2. **Contextual Skill Routing**: The agent breaks complex merchant directives into multi-step execution plans—querying top-converting products first, inspecting catalog availability, generating promotional copy, and configuring carousel components.
3. **Multi-Agent Coordination**: Specialist sub-agents handle discrete tasks (e.g., metric validation vs. visual layout creation) through orchestrated state boundaries.

### 3. 1:1 Tool Mapping with CopilotKit & Zustand

By refactoring the frontend studio state into modular Zustand stores, every human action (such as dragging a product carousel into view) maps directly to a CopilotKit action callable by the agent:

\`\`\`typescript
export const useStudioAgentTools = () => {
  useCopilotAction({
    name: "insertProductCarousel",
    description: "Inserts a curated product carousel with ranked inventory",
    parameters: [
      { name: "title", type: "string", description: "Heading for the carousel" },
      { name: "productIds", type: "string[]", description: "Ranked Shopify product IDs" },
    ],
    handler: async ({ title, productIds }) => {
      studioStore.getState().insertSection({
        type: "carousel",
        title,
        productIds,
      });
    },
  });
};
\`\`\`

### 4. Real-World Commercial Impact

The result is instant mobile app optimization: merchants simply state what they want, and the agent synthesizes live Shopify order signals, evaluates conversion trends from Snowflake, and generates fully functional App Clips that increase repeat purchase rates across global retailers.
    `.trim(),
  },
  {
    slug: "automating-gguf-quantization-huggingface",
    title: "Automating GGUF Quantization: Bridging Hugging Face Transformers to Local Runtimes",
    subtitle: "Automating tokenizer migrations, consolidated safetensors, and multi-quant matrix exports for llama.cpp and Ollama",
    date: "2026-04-12",
    readTime: "7 min read",
    tags: ["#llm", "#gguf", "#quantization", "#huggingface", "#python"],
    category: "Machine Learning",
    author: "Michael Svendsen",
    summary: "Why manually converting models to GGUF format is error-prone, and how GGUF-n-Go automates tokenizer synchronization, safetensor shard consolidation, and multi-precision quant matrix exports.",
    content: `
### 1. The Friction in Modern Model Quantization

The open-source AI ecosystem has rapidly embraced local inference engines like \`llama.cpp\`, Ollama, and LM Studio. However, converting bleeding-edge weights from Hugging Face into deployment-ready GGUF format remains full of friction:
- Discrepancies between SentencePiece and Hugging Face BPE / Tokenizers v3.
- Sharded \`model-00001-of-00004.safetensors\` files with disparate tensor naming schemes.
- Tedious manual execution of multiple quantization commands (\`Q4_K_M\`, \`Q5_K_M\`, \`Q8_0\`, \`FP16\`).

To solve this across our fine-tuning workflows, I developed **GGUF-n-Go**.

\`\`\`text
Hugging Face Repo ──> Automatic Dependency Resolution
                            │
               Convert to FP16 / BF16 GGUF
                            │
          Multi-Quantization Matrix Generator
        ┌─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
      Q4_K_M        Q5_K_M        Q8_0          FP16
\`\`\`

### 2. Handling Tokenizer Schema Migrations

Different architectures (Llama-3, Qwen2, Gemma, Mistral) encode token vocabularies, added tokens, and chat templates differently. GGUF-n-Go inspects \`tokenizer_config.json\` and \`tokenizer.json\` to normalize special token IDs:

\`\`\`python
def extract_chat_template_and_tokens(model_dir: Path) -> dict:
    """Extract and validate chat templates and special tokens for GGUF metadata."""
    config_path = model_dir / "tokenizer_config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"Missing tokenizer config at {config_path}")
        
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
        
    return {
        "bos_token_id": config.get("bos_token_id"),
        "eos_token_id": config.get("eos_token_id"),
        "chat_template": config.get("chat_template"),
    }
\`\`\`

### 3. Pipeline Automation with Clean CLI Ergonomics

With GGUF-n-Go, a single command clones the source weights, resolves dependencies, constructs the base GGUF, compiles the requested quantizations, and writes out a clean summary table:

\`\`\`bash
python cli.py --model thesven/Aether-Qwen2-0.5B-SFT --quants Q4_K_M,Q8_0,FP16 --output ./dist
\`\`\`

This automated pipeline has allowed our fine-tuning labs to publish quantized weights on Hugging Face within minutes of training completion.

Explore the repository: [thesven/GGUF-n-Go](https://github.com/thesven/GGUF-n-Go).
    `.trim(),
  },
  {
    slug: "architecting-iracing-telemetry-sdk-typescript",
    title: "Designing a High-Frequency Telemetry SDK in TypeScript: Type-Safe Contracts for iRacing",
    subtitle: "Token bucket rate limiters, session caching, and zero-allocation streaming for motorsport telemetry ingestion",
    date: "2026-03-02",
    readTime: "7 min read",
    tags: ["#typescript", "#sdk", "#telemetry", "#performance", "#nodejs"],
    category: "Developer Tooling",
    author: "Michael Svendsen",
    summary: "Architecting iracing-data-sdk: building end-to-end type safety, automated rate-limiting, and chunked download managers for real-time motorsport telemetry.",
    content: `
### 1. The Challenge of Simulation Telemetry

The iRacing Data API provides extensive endpoints covering live sessions, lap telemetry, driver ratings, and track geometries. However, building consumer applications against raw HTTP endpoints presents unique hurdles:
- Aggressive API rate limits and token bucket constraints.
- Ephemeral S3 pre-signed URLs requiring multi-step download reconciliation.
- Unpredictable payload schemas between official series, team races, and hosted sessions.

To address this, I built **\`iracing-data-sdk\`**, a strongly typed TypeScript client designed for production telemetry ingestion.

\`\`\`text
iRacing REST API ──> Session Auth & Token Bucket Rate Limiter
                           │
                 Pre-Signed S3 Resolution
                           │
             Strongly Typed Zod / TS Schemas
                           │
            Application Consumer (Analytics / UI)
\`\`\`

### 2. Leaky Bucket Rate Limiting & Auth Lifecycle

To ensure client applications never hit HTTP 429 penalties during heavy telemetry polling, the SDK implements an internal token bucket rate limiter paired with automatic session cookie renewal:

\`\`\`typescript
export class RateLimitedClient {
  private queue: Array<() => void> = [];
  private tokens: number;
  private lastRefill: number = Date.now();

  constructor(private capacity: number = 20, private refillRatePerSec: number = 5) {
    this.tokens = capacity;
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.tokens--;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRatePerSec);
    this.lastRefill = now;
    while (this.tokens > 0 && this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}
\`\`\`

### 3. Full End-to-End Type Safety

Every response payload—from sector times and tire telemetry to license class progressions—is backed by strict TypeScript interfaces, giving developers full autocomplete and compile-time correctness.

Explore the open-source library: [thesven/iracing_sdk_ts](https://github.com/thesven/iracing_sdk_ts).
    `.trim(),
  },
  {
    slug: "parsing-binary-gif-streams-cielab-typescript",
    title: "Binary Stream Parsing & Perceptual Color Extraction: Building @mikesven/gif-parser",
    subtitle: "Decoding logical screen descriptors, global color tables, and delta-E perceptual color math in zero-dependency TypeScript",
    date: "2026-01-20",
    readTime: "6 min read",
    tags: ["#typescript", "#binary", "#graphics", "#color-science", "#npm"],
    category: "Systems & Binary",
    author: "Michael Svendsen",
    summary: "How I built @mikesven/gif-parser: a zero-dependency TypeScript library for byte-level parsing of GIF streams and extracting perceptual CIELAB color palettes.",
    content: `
### 1. Why Parse Binary Formats in TypeScript?

Most JavaScript image processing libraries rely on heavyweight native bindings (such as \`sharp\` or \`node-canvas\`), which are incompatible with serverless runtimes like Cloudflare Workers or Deno.

When building lightweight media analysis tools, parsing the byte stream directly in pure TypeScript with \`ArrayBuffer\` and \`DataView\` provides zero-dependency portability and instant startup.

I engineered **\`@mikesven/gif-parser\`** to unpack GIF87a and GIF89a specifications and derive exact color metrics directly from the raw binary stream.

\`\`\`text
Raw GIF ArrayBuffer ──> Header & Logical Screen Descriptor (13 bytes)
                               │
                    Global Color Table (GCT)
                               │
               RGB (sRGB) ──> CIE XYZ ──> CIELAB
                               │
                 Perceptual Delta-E Palette
\`\`\`

### 2. Binary Unpacking with DataView

The first 13 bytes of a GIF contain the signature and the Logical Screen Descriptor:

\`\`\`typescript
export function parseLogicalScreenDescriptor(view: DataView): ScreenDescriptor {
  const width = view.getUint16(6, true);  // Little-endian
  const height = view.getUint16(8, true);
  const packed = view.getUint8(10);

  const hasGlobalColorTable = (packed & 0b10000000) !== 0;
  const colorResolution = ((packed & 0b01110000) >> 4) + 1;
  const sortFlag = (packed & 0b00001000) !== 0;
  const gctSize = 2 << (packed & 0b00000111);

  return { width, height, hasGlobalColorTable, colorResolution, sortFlag, gctSize };
}
\`\`\`

### 3. From RGB to CIELAB Perceptual Color Space

Standard Euclidean distance in RGB color space does not match human perceptual color differences. Two colors that look vastly different can have a small RGB distance, and vice versa.

The parser transforms sRGB values through the linear D65 CIE XYZ space into $L^*a^*b^*$, enabling accurate $\\Delta E$ color difference computations:

\`\`\`typescript
export function rgbToCielab(r: number, g: number, b: number): [number, number, number] {
  // Convert sRGB to linear RGB and project to XYZ
  let [rLin, gLin, bLin] = [r, g, b].map((c) => {
    c /= 255;
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  });

  const x = (rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805) / 0.95047;
  const y = (rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722) / 1.00000;
  const z = (rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505) / 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const lStar = 116 * f(y) - 16;
  const aStar = 500 * (f(x) - f(y));
  const bStar = 200 * (f(y) - f(z));

  return [lStar, aStar, bStar];
}
\`\`\`

The package is published on npm as [\`@mikesven/gif-parser\`](https://www.npmjs.com/package/@mikesven/gif-parser) with open source on GitHub: [thesven/ts-gif-parser](https://github.com/thesven/ts-gif-parser).
    `.trim(),
  },
  {
    slug: "serverless-photography-sst-ion-cloudflare",
    title: "Deploying a High-Resolution Photography Platform with SST Ion & Cloudflare Pages",
    subtitle: "Zero-database architecture, edge caching, and fluid responsive galleries for Ontario wildlife and astrophotography",
    date: "2025-11-14",
    readTime: "5 min read",
    tags: ["#cloudflare", "#sst", "#nextjs", "#photography", "#web-perf"],
    category: "Edge Architecture",
    author: "Michael Svendsen",
    summary: "How I architected photography.mikesvendsen.net: using SST Ion, Cloudflare Pages, and edge image optimization to showcase high-resolution fine-art photography with sub-second page loads.",
    content: `
### 1. Visual Storytelling on the Modern Edge

Fine-art wildlife and astrophotography demand uncompromising image fidelity. Displaying multi-megabyte raw captures on the web without degrading viewer experience requires careful balance between perceptual resolution and delivery latency.

When redesigning **photography.mikesvendsen.net**, I replaced traditional CMS backends and heavy databases with a completely static, edge-optimized architecture powered by **SST Ion** on **Cloudflare Pages**.

\`\`\`text
Lightroom High-Res Export ──> Content Manifest & WebP Generation
                                        │
                               SST Ion Infrastructure
                                        │
                     Cloudflare Global Edge Network
                     (sub-20ms edge cache response)
                                        │
                         Responsive Fluid Gallery UI
\`\`\`

### 2. Infrastructure as Code with SST Ion

Using SST Ion, deployment and domain routing are declared in code:

\`\`\`typescript
// sst.config.ts
export default $config({
  app(input) {
    return {
      name: "personal-photography",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    new sst.cloudflare.StaticSite("PhotographySite", {
      domain: "photography.mikesvendsen.net",
      build: {
        command: "npm run build",
        output: "out",
      },
    });
  },
});
\`\`\`

### 3. Edge Performance & Perceptual Loading

The site employs:
- **Responsive WebP/AVIF srcsets:** Serving precise device resolutions without wasted bandwidth.
- **Edge Cache Headers (\`public, max-age=31536000, immutable\`):** Ensuring repeat visitors get instant cache hits globally.
- **Keyboard & Touch Navigation:** Seamless full-bleed lightbox navigation for immersion.

Visit the live gallery: [photography.mikesvendsen.net](https://photography.mikesvendsen.net).
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  ARTICLES.forEach((a) => a.tags.forEach((t) => set.add(t)));
  return Array.from(set);
}
