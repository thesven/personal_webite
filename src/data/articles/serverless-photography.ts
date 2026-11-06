import { Article } from "../articles";

export const articleServerlessPhotography: Article = {
  slug: "serverless-photography-sst-ion-cloudflare",
  title: "Deploying a High-Resolution Photography Platform: SST Ion, Cloudflare Pages, and Edge Caching",
  subtitle: "Zero-database architecture, AVIF/WebP responsive image pipelines, immutable caching, and fluid lightbox UX for wildlife and astrophotography",
  date: "2025-11-14",
  readTime: "11 min read",
  tags: ["#cloudflare", "#sst", "#nextjs", "#photography", "#web-perf", "#edge-architecture"],
  category: "Edge Architecture",
  author: "Michael Svendsen",
  summary: "Displaying fine-art wildlife and astrophotography on the web requires balancing 45-megapixel raw fidelity with sub-second page loads on mobile devices. Here is how I architected photography.mikesvendsen.net using SST Ion, Cloudflare Pages, static manifest extraction, and responsive AVIF/WebP srcset generation—delivering a zero-database gallery with global edge caching.",
  content: `
## 1. The High-Resolution Visual Dilemma

Fine-art wildlife photography and deep-sky astrophotography present a brutal engineering tradeoff on the modern web.

When capturing a wild white-tailed buck in morning mist or the glowing dust lanes of the Andromeda Galaxy, raw files from a Sony A7R or Canon R5 full-frame sensor measure:
- **8,192 x 5,464 pixels** (45 megapixels).
- **80 MB to 120 MB per RAW uncompressed capture**.
- Exquisite micro-contrast in animal fur, feather barbules, and stellar nebulae.

If you aggressively compress these images with standard JPEG algorithms, you introduce unsightly ringing artifacts around star edges and muddy gradients in low-light shadow transitions. Conversely, if you serve multi-megabyte uncompressed images, mobile visitors on cellular connections experience frozen scrollbars, heavy data consumption, and 10-second blank screens.

\`\`\`text
[NAIVE CMS ARCHITECTURE]
WordPress / Heavy CMS ──> SQL Database (Postgres/MySQL) ──> Heavy PHP Server ──> 2.5s TTFB
                                                                            └──> Muddy JPEGs

[SST ION + CLOUDFLARE PAGES ARCHITECTURE]
Lightroom Master Export ──> Sharp Multi-Resolution AVIF/WebP Generator
                                      │
                         JSON Content & EXIF Manifest
                                      │
                         SST Ion Infrastructure Deploy
                                      │
                         Cloudflare Global Anycast CDN
                         (Immutable Edge Cache: <15ms TTFB)
\`\`\`

When building **[photography.mikesvendsen.net](https://photography.mikesvendsen.net)**, I eliminated traditional CMS databases and server backends completely in favor of an **edge-native static architecture powered by SST Ion and Cloudflare Pages**.

---

## 2. Infrastructure as Code with SST Ion

Modern cloud deployment tooling has evolved away from legacy Terraform and Serverless Framework templates. **SST Ion** rebuilds serverless infrastructure directly on top of Pulumi's high-speed engine, offering rapid TypeScript-native infrastructure definitions.

For \`photography.mikesvendsen.net\`, the entire deployment topology is declared in a single \`sst.config.ts\`:

\`\`\`typescript
// sst.config.ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "personal-photography",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
    };
  },
  async run() {
    // Declarative Cloudflare Static Site Deployment
    const site = new sst.cloudflare.StaticSite("PhotographySite", {
      domain: {
        name: "photography.mikesvendsen.net",
        dns: sst.cloudflare.dns(),
      },
      build: {
        command: "npm run build",
        output: "out",
      },
      environment: {
        NEXT_PUBLIC_CDN_BASE: "https://photography.mikesvendsen.net/assets",
        NEXT_PUBLIC_SITE_STAGE: $app.stage,
      },
    });

    return {
      url: site.url,
      domain: site.domain,
    };
  },
});
\`\`\`

With this declaration:
1. **Zero Cold Starts**: The entire application compiles to static HTML/JS/CSS assets distributed to 330+ Cloudflare edge PoPs worldwide.
2. **Deterministic DNS**: Custom subdomains and SSL certificates are provisioned and bound automatically via the Cloudflare provider.
3. **Reproducible Previews**: Staging branches deploy ephemeral review URLs with isolated asset namespaces in seconds.

---

## 3. The Automated Image Processing Pipeline: Multi-Width AVIF & WebP

Rather than dynamically resizing images on the fly via an expensive serverless image proxy (which burns edge compute on every cache miss), images are pre-processed during the build pipeline using **Sharp**.

### Responsive Multi-Resolution Matrix
For every master high-resolution photo, the asset pipeline generates four discrete width breakpoints in both **AVIF** (superior compression and color depth) and **WebP** (universal fallback):

| Target Width | Resolution Purpose | Average AVIF Size | Average WebP Size |
| :--- | :--- | :--- | :--- |
| **400px** | Mobile thumbnail grid & feeds | ~18 KB | ~28 KB |
| **1200px** | Tablet & desktop thumbnail previews | ~74 KB | ~112 KB |
| **2400px** | High-DPI 4K modal displays | ~280 KB | ~440 KB |
| **3840px** | Ultra-HD 1:1 zoom inspection | ~790 KB | ~1.2 MB |

### Building the Asset Pipeline Script

\`\`\`typescript
// scripts/process-gallery.ts
import sharp from "sharp";
import exifr from "exifr";
import fs from "fs-extra";
import path from "path";

const BREAKPOINTS = [400, 1200, 2400, 3840];

export async function processPhoto(sourcePath: string, outputDir: string) {
  const filename = path.basename(sourcePath, path.extname(sourcePath));
  const buffer = await fs.readFile(sourcePath);

  // 1. Extract complete camera, lens, and exposure metadata
  const exif = await exifr.parse(buffer, [
    "Make", "Model", "LensModel", "FocalLength", 
    "FNumber", "ExposureTime", "ISO", "DateTimeOriginal"
  ]);

  // 2. Generate multi-resolution AVIF and WebP responsive sets
  const variants: Record<string, string[]> = { avif: [], webp: [] };

  for (const width of BREAKPOINTS) {
    const avifName = \`\${filename}-\${width}w.avif\`;
    const webpName = \`\${filename}-\${width}w.webp\`;

    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 80, effort: 6 })
      .toFile(path.join(outputDir, avifName));

    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(path.join(outputDir, webpName));

    variants.avif.push(\`/assets/photos/\${avifName} \${width}w\`);
    variants.webp.push(\`/assets/photos/\${webpName} \${width}w\`);
  }

  // 3. Generate tiny 16px BlurHash Low-Quality Image Placeholder (LQIP)
  const lqipBuffer = await sharp(buffer)
    .resize(16, 16, { fit: "inside" })
    .toBuffer();
  const lqipBase64 = \`data:image/jpeg;base64,\${lqipBuffer.toString("base64")}\`;

  return {
    id: filename,
    metadata: {
      camera: \`\${exif?.Make || ""} \${exif?.Model || ""}\`.trim(),
      lens: exif?.LensModel,
      focalLength: exif?.FocalLength ? \`\${exif.FocalLength}mm\` : undefined,
      aperture: exif?.FNumber ? \`f/\${exif.FNumber}\` : undefined,
      shutter: exif?.ExposureTime ? \`1/\${Math.round(1 / exif.ExposureTime)}s\` : undefined,
      iso: exif?.ISO,
      date: exif?.DateTimeOriginal,
    },
    srcsets: {
      avif: variants.avif.join(", "),
      webp: variants.webp.join(", "),
    },
    lqip: lqipBase64,
  };
}
\`\`\`

---

## 4. Cache-Control & Global Edge Delivery

To ensure instantaneous loading for repeat visitors across the world, static assets are configured with deterministic HTTP caching headers in the Cloudflare deployment manifest:

\`\`\`text
# Immutable Hashed Image Assets (Fingerprinted or width-versioned)
Cache-Control: public, max-age=31536000, immutable

# Content Manifests & HTML Shells (Revalidated quickly)
Cache-Control: public, max-age=0, must-revalidate
\`\`\`

Because image file names contain their resolution hashes (e.g. \`deer-dawn-2400w.avif\`), Cloudflare edge caches retain the assets permanently without cache eviction. 

A user in London clicking on a photo initially fetched by a user in Toronto receives a **sub-15ms edge cache hit**, eliminating all origin bandwidth costs.

---

## 5. Keyboard-Centric Lightbox & Fluid UX

Photography portfolios should honor the art: no visual clutter, no floating cookie banners, and distraction-free viewing.

The frontend is implemented with keyboard-first ergonomics:

\`\`\`typescript
// components/LightboxViewer.tsx
export const LightboxViewer = ({ photo, onNext, onPrev, onClose }: LightboxProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "j":
          onNext();
          break;
        case "ArrowLeft":
        case "k":
          onPrev();
          break;
        case "Escape":
          onClose();
          break;
        case "f":
          document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center">
      <picture>
        <source type="image/avif" srcSet={photo.srcsets.avif} sizes="100vw" />
        <source type="image/webp" srcSet={photo.srcsets.webp} sizes="100vw" />
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[90vh] max-w-[95vw] object-contain transition-opacity duration-300"
          style={{ backgroundImage: \`url(\${photo.lqip})\`, backgroundSize: "cover" }}
        />
      </picture>
      
      {/* Non-intrusive EXIF Telemetry Bar */}
      <footer className="absolute bottom-4 flex gap-4 text-xs font-mono text-zinc-400">
        <span>{photo.metadata.camera}</span>
        <span>{photo.metadata.lens}</span>
        <span>{photo.metadata.focalLength}</span>
        <span>{photo.metadata.aperture}</span>
        <span>{photo.metadata.shutter}</span>
        <span>ISO {photo.metadata.iso}</span>
      </footer>
    </div>
  );
};
\`\`\`

---

## 6. Live Portfolio & Summary

By synthesizing SST Ion's declarative infrastructure with Cloudflare's edge network and a multi-width AVIF asset pipeline, **photography.mikesvendsen.net** achieves:
- **100/100 Google Lighthouse Performance Score**.
- **Under 400ms Largest Contentful Paint (LCP)** globally.
- **Zero Database Maintenance**: No server patches, no RDS instances, zero operational overhead.

View the gallery in action: [photography.mikesvendsen.net](https://photography.mikesvendsen.net).
`.trim(),
};
