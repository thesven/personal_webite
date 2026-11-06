export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  stars?: string;
  version: string;
  gitDelta: string;
  description: string;
  stack: string[];
  treePaths: string[];
  githubUrl: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "sys-toolkit",
    title: "sys-toolkit",
    tagline: "High-Performance Linux Kernel Telemetry & Wayland IPC Diagnostics Engine",
    category: "Systems & Infrastructure",
    version: "v1.4.2",
    stars: "1.2k",
    gitDelta: "+420 -18",
    featured: true,
    description: "Low-overhead eBPF event tracer coupled with a lock-free ring buffer and zero-copy Wayland IPC connector. Provides microsecond-level system metrics to desktop overlays and CLI monitors without impacting host throughput.",
    stack: ["Rust", "eBPF", "C", "Wayland IPC", "Linux 6.x"],
    treePaths: [
      "src/ebpf/probes.bpf.c",
      "src/ringbuf/consumer.rs",
      "src/ipc/wayland_proto.rs",
      "src/tui/render_terminal.rs",
    ],
    githubUrl: "https://github.com/thesven/sys-toolkit",
  },
  {
    slug: "hypr-dispatch",
    title: "hypr-dispatch",
    tagline: "Ultra-Lightweight Event Broker & Workspace Automator for Wayland Compositors",
    category: "Desktop & Window Management",
    version: "v0.9.1",
    stars: "840",
    gitDelta: "+124 -9",
    featured: true,
    description: "Sub-millisecond daemon listening to Hyprland UNIX socket IPC events, dispatching layout shifts, dynamic window rules, and multi-monitor workspace coordination.",
    stack: ["Rust", "Hyprland IPC", "Unix Domain Sockets", "Tokio"],
    treePaths: [
      "daemon/listener.rs",
      "dispatcher/workspace.rs",
      "rules/matcher.rs",
    ],
    githubUrl: "https://github.com/thesven/hypr-dispatch",
  },
  {
    slug: "tte-web",
    title: "tte-web",
    tagline: "Procedural Terminal Text Effects Engine for Web & Canvas Renders",
    category: "Graphics & Creative Coding",
    version: "v2.0.0",
    stars: "650",
    gitDelta: "+890 -45",
    featured: true,
    description: "Hardware-accelerated HTML5 Canvas engine implementing procedural terminal text animations, FIGlet Delta Corps Priest 1 font geometries, phosphor glow, CRT curvature, and specular glints.",
    stack: ["TypeScript", "HTML5 Canvas", "Web Audio API", "Mathematical Motion"],
    treePaths: [
      "engine/canvas_renderer.ts",
      "effects/matrix_cascade.ts",
      "effects/decrypt_entropy.ts",
      "audio/mechanical_switch.ts",
    ],
    githubUrl: "https://github.com/thesven/personal_webite",
  },
  {
    slug: "infra-core",
    title: "infra-core",
    tagline: "Declarative NixOS & Kubernetes Cluster Manifests for Personal Bare-Metal Labs",
    category: "DevOps & Infrastructure",
    version: "v3.2.0",
    stars: "310",
    gitDelta: "+210 -30",
    description: "Reproducible NixOS configurations for development workstations, home laboratory Kubernetes clusters, automated WireGuard mesh networking, and eBPF observability daemons.",
    stack: ["NixOS", "Flakes", "Kubernetes", "WireGuard", "Prometheus"],
    treePaths: [
      "hosts/workstation/configuration.nix",
      "modules/hyprland.nix",
      "k8s/cilium/values.yaml",
    ],
    githubUrl: "https://github.com/thesven/infra-core",
  },
];
