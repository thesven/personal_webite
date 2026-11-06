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
    slug: "litemcp",
    title: "LiteMCP",
    tagline: "Cloudflare Worker Compatible Model Context Protocol (MCP) Framework",
    category: "AI & Distributed Systems",
    version: "v0.3.0",
    stars: "14",
    gitDelta: "+480 -22",
    featured: true,
    description: "Lightweight, edge-native implementation of Anthropic's Model Context Protocol (MCP) engineered specifically for serverless deployment on Cloudflare Workers. Features standards-compliant JSON-RPC 2.0 execution, real-time Server-Sent Events (SSE) streaming, CORS support, and zero-cold-start latency.",
    stack: ["TypeScript", "Cloudflare Workers", "Model Context Protocol", "JSON-RPC 2.0", "SSE"],
    treePaths: [
      "src/server.ts",
      "src/transports/sse.ts",
      "src/protocol/jsonrpc.ts",
      "src/handlers/tools.ts",
    ],
    githubUrl: "https://github.com/thesven/LiteMCP",
  },
  {
    slug: "gguf-n-go",
    title: "GGUF-n-Go",
    tagline: "Automated Quantization Pipeline for Hugging Face Models to GGUF",
    category: "Machine Learning & Edge AI",
    version: "v1.2.0",
    stars: "7",
    gitDelta: "+320 -15",
    featured: true,
    description: "Your go-to automated tool for easily creating quantized versions of Hugging Face models in the GGUF format. Seamlessly handles modern architectures, tokenizer migrations (v3 tokenizers, consolidated safetensors), and exports optimized Q4_K_M, Q8_0, and FP16 weights ready for local llama.cpp and Ollama runtimes.",
    stack: ["Python", "Hugging Face", "llama.cpp", "GGUF", "PyTorch"],
    treePaths: [
      "gguf_n_go/converter.py",
      "gguf_n_go/quantizer.py",
      "gguf_n_go/tokenizers.py",
      "cli.py",
    ],
    githubUrl: "https://github.com/thesven/GGUF-n-Go",
  },
  {
    slug: "aether-fine-tuning",
    title: "AetherCode & Fine-Tuning Labs",
    tagline: "Instruction-Tuned Code Models & Preference Alignment Datasets",
    category: "Generative AI & LLM Alignment",
    version: "v0.0.2",
    stars: "46",
    gitDelta: "+1.2k -40",
    featured: true,
    description: "Open-source fine-tuned code LLMs and preference datasets published on Hugging Face. Includes Aether-Qwen2-0.5B-SFT (GGUF, GPTQ 4-bit, AWQ), Phi-nut-Butter-Codebagel, and the Reflective-MAGLLAMA dataset series (surpassing 10,000+ community downloads) trained with PEFT and SFTTrainer on dedicated Nvidia GPUs.",
    stack: ["Python", "PEFT", "LoRA", "Hugging Face TRL", "SFTTrainer", "Nvidia GPU"],
    treePaths: [
      "training/sft_trainer.py",
      "configs/lora_config.yaml",
      "data/reflective_magllama.jsonl",
      "evaluation/code_eval.py",
    ],
    githubUrl: "https://huggingface.co/thesven",
  },
  {
    slug: "iracing-data-sdk",
    title: "iracing-data-sdk",
    tagline: "Comprehensive TypeScript SDK for the iRacing Telemetry & Data API",
    category: "Developer Tooling & Telemetry",
    version: "v1.0.0",
    stars: "2",
    gitDelta: "+680 -12",
    featured: true,
    description: "A production-grade, strongly typed TypeScript library for interacting with the iRacing Data API. Provides end-to-end typed schemas for all documented telemetry endpoints, automated chunked download handling, credential caching, and robust rate-limiting.",
    stack: ["TypeScript", "Node.js", "REST API", "Telemetry", "NPM Package"],
    treePaths: [
      "src/client.ts",
      "src/endpoints/telemetry.ts",
      "src/auth/session.ts",
      "src/types/iracing.ts",
    ],
    githubUrl: "https://github.com/thesven/iracing_sdk_ts",
  },
  {
    slug: "ts-gif-parser",
    title: "ts-gif-parser (@mikesven/gif-parser)",
    tagline: "Binary Stream Parser & CIELAB Perceptual Color Table Extractor",
    category: "Systems & Binary Formats",
    version: "v0.0.1",
    stars: "6",
    gitDelta: "+510 -18",
    description: "High-performance TypeScript utility for parsing raw binary information from .gif files. Extracts logical screen descriptors, binary headers, frame blocks, and derives exact RGB, Hex, and CIELAB perceptual color spaces directly from the global/local color tables.",
    stack: ["TypeScript", "Binary Streams", "CIELAB Color Space", "Nx Monorepo"],
    treePaths: [
      "src/lib/gif-parser.ts",
      "src/lib/color-table.ts",
      "src/lib/descriptors.ts",
      "src/types/color.ts",
    ],
    githubUrl: "https://github.com/thesven/ts-gif-parser",
  },
  {
    slug: "spypoint-mcp",
    title: "spypoint_mcp",
    tagline: "Model Context Protocol Server for Cellular Trail Cameras",
    category: "IoT & Applied AI",
    version: "v0.2.1",
    stars: "1",
    gitDelta: "+190 -8",
    description: "Specialized MCP server enabling LLM agents to monitor, query, and analyze photo capture streams from remote SpyPoint cellular trail cameras, bridging AI vision models with wildlife monitoring in the field.",
    stack: ["Python", "MCP Protocol", "IoT APIs", "Computer Vision"],
    treePaths: [
      "spypoint_mcp/server.py",
      "spypoint_mcp/api_client.py",
      "spypoint_mcp/tools.py",
    ],
    githubUrl: "https://github.com/thesven/spypoint_mcp",
  },
  {
    slug: "personal-photography",
    title: "Michael Svendsen Photography",
    tagline: "Wildlife & Astrophotography Platform for Visual Storytelling",
    category: "Creative Coding & Edge Media",
    version: "v2.1.0",
    stars: "Photography",
    gitDelta: "+340 -10",
    description: "Dedicated photography portfolio capturing the natural beauty and night skies of Ontario, Canada. Powered by SST Ion on Cloudflare Pages with edge caching, fluid gallery navigation, and Lightroom fine-art workflows.",
    stack: ["Next.js", "Cloudflare Pages", "SST Ion", "Tailwind CSS"],
    treePaths: [
      "sst.config.ts",
      "app/gallery/page.tsx",
      "components/HeroSlider.tsx",
    ],
    githubUrl: "https://photography.mikesvendsen.net",
  },
];
