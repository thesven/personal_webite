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
    category: "AI & Systems",
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
    slug: "zero-copy-deserialization-rust",
    title: "Zero-Copy Deserialization: Lessons in High-Throughput Memory Geometry",
    subtitle: "Eliminating allocation overhead in telemetry ingestion pipelines with eBPF and FlatBuffers",
    date: "2026-10-24",
    readTime: "8 min read",
    tags: ["#systems", "#rust", "#performance"],
    category: "Systems",
    author: "Michael Svendsen",
    summary: "Architecting high-frequency telemetry ingestion engines without heap allocation by aligning memory buffers directly with kernel ring buffers.",
    content: `
### 1. The Allocation Bottleneck

In high-throughput telemetry pipelines processing over 2.4M events/sec per core, memory allocation (\`malloc\` / \`jemalloc\`) is the primary driver of cache invalidation and tail latency. Traditional JSON or Protobuf deserialization incurs multiple heap allocations per envelope.

\`\`\`rust
// Anti-pattern: Allocating dynamic strings and vectors for every incoming wire frame
struct WirePayload {
    topic: String,       // Heap allocation!
    payload: Vec<u8>,    // Second heap allocation!
    timestamp_ns: u64,
}
\`\`\`

> [!NOTE]
> Tail latency (p99.99) is dictated by kernel page faults and CPU L2/L3 cache misses. Eliminating dynamic allocations restores predictable sub-microsecond response curves.

### 2. Geometry Alignment with Kernel Ring Buffers

By pairing **eBPF ring buffers** (\`BPF_MAP_TYPE_RINGBUF\`) with byte-aligned flat structs, we achieve zero-copy parsing. The user-space consumer maps the memory region directly into process space:

\`\`\`rust
use std::mem::size_of;

#[repr(C, packed(4))]
pub struct PacketHeader {
    pub magic: u32,       // 0x5356454E
    pub sequence: u64,
    pub payload_len: u32,
    pub flags: u16,
    pub _reserved: u16,
}

#[inline(always)]
pub fn parse_frame<'a>(raw: &'a [u8]) -> Result<(&'a PacketHeader, &'a [u8]), DecodeError> {
    if raw.len() < size_of::<PacketHeader>() {
        return Err(DecodeError::Truncated);
    }
    // Safe when memory is properly aligned and validated against bounds
    let header = unsafe { &*(raw.as_ptr() as *const PacketHeader) };
    if header.magic != 0x5356454E {
        return Err(DecodeError::InvalidMagic);
    }
    let payload = &raw[size_of::<PacketHeader>()..size_of::<PacketHeader>() + header.payload_len as usize];
    Ok((header, payload))
}
\`\`\`

> [!TIP]
> Always enforce memory alignment constraints (\`#[repr(C, packed(4))]\` or \`align(8)\`) to prevent bus penalties or unaligned memory access exceptions on ARM64 targets.

### 3. Benchmarks & Real-World Telemetry

We measured single-thread throughput across three serialization formats on an AMD EPYC 9654 running Linux 6.12:

| Format | Throughput (msgs/sec) | Mean Latency | p99.9 Latency | Allocations / Op |
| :--- | :--- | :--- | :--- | :--- |
| **Zero-Copy FlatBuffer** | **4,820,000** | **0.18 µs** | **0.42 µs** | **0** |
| Protobuf v3 (C++) | 1,240,000 | 0.81 µs | 3.20 µs | 2 |
| Serde JSON (Rust) | 380,000 | 2.63 µs | 14.80 µs | 7 |

By treating memory geometry as an explicit architectural tier, we reduced our telemetry ingestion cluster footprint by 75% while achieving absolute deterministic jitter.
    `.trim(),
  },
  {
    slug: "wayland-compositor-architecture",
    title: "Compositor Mechanics: Building Smooth 144Hz Desktop UX with Wayland & Hyprland",
    subtitle: "Direct scanout, damage tracking, and tearing control protocols in modern Linux window management",
    date: "2026-09-18",
    readTime: "11 min read",
    tags: ["#architecture", "#wayland", "#graphics"],
    category: "Architecture",
    author: "Michael Svendsen",
    summary: "Deep dive into Wayland IPC protocols, DRM/KMS buffer flipping, and how sub-millisecond damage tracking creates fluid tiling window manager experiences.",
    content: `
### 1. The Death of X11 and the Wayland Paradigm Shift

X11 was architected around a client-server network model where every window was a subwindow on the root screen. Wayland inverts this model: **every frame is perfect**. The compositor *is* the display server.

\`\`\`text
Client  ──(wl_surface.attach)──>  Wayland IPC  ──>  Compositor (Hyprland / wlroots)
                                                             │
                                                        DRM/KMS Plane
                                                             │
                                                        Hardware Display
\`\`\`

> [!IMPORTANT]
> In Wayland, clients render into their own shared memory or DMA-BUF buffers. The compositor never receives invalid or half-drawn state.

### 2. Damage Tracking & Atomic Pageflips

To achieve seamless 144Hz+ rendering without consuming excessive GPU TDP:
1. **Damage Region Accumulation**: The client reports only the bounding box of pixels that changed (\`wl_surface.damage_buffer\`).
2. **Direct Scanout**: When a client window is fullscreen or occupies an entire hardware plane, the compositor bypasses composition shaders and hands the DMA-BUF directly to the display hardware plane via atomic KMS.

\`\`\`c
// Direct scanout check in modern Wayland compositor
bool can_direct_scanout(struct wlr_output *output, struct wlr_surface *surface) {
    if (!surface || !wlr_surface_is_xdg_surface(surface)) return false;
    struct wlr_box surface_box = { .x = 0, .y = 0, .width = output->width, .height = output->height };
    return wlr_box_equal(&surface->current.geometry, &surface_box) && !output->has_overlay_effects;
}
\`\`\`

### 3. Conclusion

Modern Linux desktops have evolved into precision graphics machines. Pairing atomic modesetting with minimal Wayland client IPC unlocks fluid, tearing-free desktop interactions that rival custom embedded hardware.
    `.trim(),
  },
  {
    slug: "kernel-ebpf-telemetry-fabric",
    title: "eBPF Observability: Safe In-Kernel Probing for Cloud Infrastructure",
    subtitle: "Tracing network packet paths and TCP lifecycle anomalies without kernel modules or context switch traps",
    date: "2026-08-05",
    readTime: "9 min read",
    tags: ["#systems", "#ebpf", "#infrastructure"],
    category: "Infrastructure",
    author: "Michael Svendsen",
    summary: "How we deploy verified eBPF bytecode to trace network packet lifecycles, detect TCP retransmissions, and extract zero-overhead latency metrics in distributed clusters.",
    content: `
### 1. Why eBPF Changes Systems Engineering

Traditional observability tools rely on either user-space polling (\`/proc\`, \`/sys\`) or invasive kernel modules that risk kernel panics. **eBPF (Extended Berkeley Packet Filter)** provides an in-kernel virtual machine with a static verifier, ensuring attached programs:
- Cannot deadlock the kernel.
- Cannot dereference out-of-bounds pointers.
- Terminate within bounded execution steps.

### 2. Tracing TCP Retransmits in 20 Lines of C

\`\`\`c
#include <linux/kconfig.h>
#include <linux/bpf.h>
#include <linux/tcp.h>
#include <bpf/bpf_helpers.h>

struct event_t {
    __u32 saddr;
    __u32 daddr;
    __u16 sport;
    __u16 dport;
    __u64 state;
};

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 256 * 1024);
} events SEC(".maps");

SEC("tracepoint/tcp/tcp_retransmit_skb")
int trace_tcp_retransmit(struct trace_event_raw_tcp_event_skb *ctx) {
    struct event_t *event = bpf_ringbuf_reserve(&events, sizeof(*event), 0);
    if (!event) return 0;

    event->saddr = ctx->saddr;
    event->daddr = ctx->daddr;
    event->sport = ctx->sport;
    event->dport = ctx->dport;
    bpf_ringbuf_submit(event, 0);
    return 0;
}

char LICENSE[] SEC("license") = "GPL";
\`\`\`

> [!NOTE]
> Ring buffers guarantee lock-free, single-producer multi-consumer event delivery directly into user-space listeners with sub-microsecond latency.
    `.trim(),
  },
  {
    slug: "lock-free-ring-buffers-concurrency",
    title: "Lock-Free Ring Buffers: Designing Deterministic Single-Producer Multi-Consumer Queues",
    subtitle: "Cache-line padding, memory barriers, and sequential consistency in low-latency systems",
    date: "2026-06-12",
    readTime: "7 min read",
    tags: ["#architecture", "#concurrency", "#performance"],
    category: "Architecture",
    author: "Michael Svendsen",
    summary: "Practical guide to cache-line padding, false sharing prevention, and atomic memory ordering when building high-speed concurrency primitives.",
    content: `
### 1. The Cost of Locks in Microsecond Workloads

Mutexes and rwlocks rely on OS futexes when contested. A single thread context switch costs ~1.5 to 3 microseconds — catastrophic when your processing budget is 5 microseconds per message.

### 2. Cache-Line Alignment & False Sharing

Modern x86_64 CPUs utilize 64-byte cache lines. If the writer's head pointer and reader's tail pointer reside in the same 64-byte cache line, both cores continuously invalidate each other's L1 cache via the MESI cache coherency protocol.

\`\`\`rust
// Rust implementation preventing false sharing via explicit alignment
use std::sync::atomic::{AtomicUsize, Ordering};

#[repr(align(64))]
pub struct CachePadded<T>(pub T);

pub struct SpscRingBuffer<T, const CAP: usize> {
    head: CachePadded<AtomicUsize>, // Written by producer, read by consumer
    tail: CachePadded<AtomicUsize>, // Written by consumer, read by producer
    buffer: [*mut T; CAP],
}
\`\`\`

By padding pointers to 64-byte boundaries, memory bus contention drops to zero, sustaining 10M+ message transfers per second.
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
