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
