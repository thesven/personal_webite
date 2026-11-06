import { Article } from "@/data/articles";
import { Project } from "@/data/projects";

export const SITE_URL = "https://michael-svendsen.dev";
export const AUTHOR_NAME = "Michael Svendsen";
export const SITE_TITLE = "Michael Svendsen — Senior Backend & AI Platform Engineer";
export const SITE_DESCRIPTION =
  "Production analytics, personalization, data infrastructure (Snowflake, dbt, AWS Bedrock AgentCore), Model Context Protocol (MCP), and open-source AI tooling by Michael Svendsen.";

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    alternateName: ["thesven", "Mike Svendsen", "Michael Sven"],
    jobTitle: "Senior Backend & AI Platform Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    worksFor: {
      "@type": "Organization",
      name: "Reactiv",
      url: "https://www.reactiv.ai",
    },
    sameAs: [
      "https://github.com/thesven",
      "https://huggingface.co/thesven",
      "https://photography.mikesvendsen.net",
    ],
    knowsAbout: [
      "Snowflake Data Warehousing",
      "dbt (data build tool)",
      "AWS Bedrock AgentCore",
      "Model Context Protocol (MCP)",
      "LiteMCP",
      "Cloudflare Workers",
      "Python",
      "TypeScript",
      "Rust",
      "GGUF Quantization",
      "E-Commerce Analytics",
      "Reverse ETL",
      "Telemetry & Systems Architecture",
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Humber College",
      },
      {
        "@type": "EducationalOrganization",
        name: "Seneca Polytechnic",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aurora",
      addressRegion: "Ontario",
      addressCountry: "Canada",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    description: "Technical publication, systems architecture showcase, and engineering portfolio by Michael Svendsen.",
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    inLanguage: "en-US",
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

export function getArticleSchema(article: Article) {
  const url = `${SITE_URL}/articles/${article.slug}/`;
  const wordCount = article.content ? article.content.trim().split(/\s+/).length : 0;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.summary,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    publisher: {
      "@id": `${SITE_URL}/#person`,
    },
    image: `${SITE_URL}/og-image.png`,
    datePublished: article.date,
    dateModified: article.date,
    keywords: article.tags.join(", "),
    articleSection: article.category,
    proficiencyLevel: "Expert",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[role='doc-abstract']", "h1"],
    },
    wordCount,
    articleBody: article.content,
  };
}

export function getArticlesListSchema(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Technical Publications & Systems Research",
    description: "In-depth engineering essays and systems research by Michael Svendsen.",
    itemListElement: articles.map((art, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: art.title,
      description: art.summary,
      url: `${SITE_URL}/articles/${art.slug}/`,
    })),
  };
}

export function getProjectsListSchema(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Systems & Infrastructure Portfolio",
    description: "Production platforms and open-source systems engineered by Michael Svendsen.",
    itemListElement: projects.map((proj, idx) => ({
      "@type": "SoftwareApplication",
      position: idx + 1,
      name: proj.title,
      description: proj.description,
      applicationCategory: proj.category,
      softwareVersion: proj.version,
      operatingSystem: "Cross-platform",
      url: proj.githubUrl,
      author: {
        "@id": `${SITE_URL}/#person`,
      },
    })),
  };
}

export function getAboutFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Michael Svendsen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Michael Svendsen (thesven) is a Senior Backend & AI Platform Engineer based in Aurora / Toronto, Canada, with over 16 years of engineering experience architecting scalable data lakes, low-latency APIs, and AI agent frameworks.",
        },
      },
      {
        "@type": "Question",
        name: "What is Michael Svendsen's current role and focus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Michael serves as Senior Artificial Intelligence Developer at Reactiv, where he architects unified Snowflake and dbt data platform foundations, high-throughput AWS data pipelines, and AWS Bedrock AgentCore autonomous agents for high-growth Shopify merchants.",
        },
      },
      {
        "@type": "Question",
        name: "What open source AI and developer tools has Michael Svendsen authored?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Michael has authored LiteMCP (edge-native Model Context Protocol framework for Cloudflare Workers), GGUF-n-Go (automated Hugging Face model quantizer), spypoint_mcp (19-tool MCP server for cellular trail cameras), iracing-data-sdk (typed TypeScript SDK), and open-source fine-tuned code models on Hugging Face with over 10,000 community downloads.",
        },
      },
      {
        "@type": "Question",
        name: "What core technical technologies does Michael Svendsen specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Core technologies include Snowflake, dbt, SQL, AWS (Bedrock AgentCore, Lambda, Step Functions, Glue, Redshift Serverless), Model Context Protocol (MCP), Python, TypeScript, Rust, GGUF quantization, and high-frequency telemetry architectures.",
        },
      },
    ],
  };
}
