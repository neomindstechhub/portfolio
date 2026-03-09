const BASE_URL = "https://portfolio.neomindstechhub.com";

/** Meta tag IDs for dynamic updates */
const META_IDS = {
  description: "meta-description",
  canonical: "canonical-link",
  ogTitle: "og-title",
  ogDescription: "og-description",
  ogUrl: "og-url",
  ogImage: "og-image",
  twitterTitle: "twitter-title",
  twitterDescription: "twitter-description",
  twitterImage: "twitter-image",
  projectJsonLd: "project-json-ld",
} as const;

const DEFAULT_TITLE = "Our Work | NeoMinds TechHub Portfolio";
const DEFAULT_DESCRIPTION =
  "Explore AI and ML projects by NeoMinds TechHub — real client work across healthcare, e-commerce, banking, and more.";

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function setMeta(nameOrProp: string, content: string, isProperty = false): void {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaById(id: string, content: string): void {
  const el = document.getElementById(id);
  if (el && el.tagName === "META") el.setAttribute("content", content);
}

function setCanonical(href: string): void {
  let el = document.getElementById(META_IDS.canonical) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.id = META_IDS.canonical;
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeProjectJsonLd(): void {
  const el = document.getElementById(META_IDS.projectJsonLd);
  if (el) el.remove();
}

function setProjectJsonLd(data: object): void {
  removeProjectJsonLd();
  const script = document.createElement("script");
  script.id = META_IDS.projectJsonLd;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function setProjectSeo(params: {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  tags?: string[];
}): void {
  const { title, description, slug, imageUrl, tags } = params;
  const url = `${BASE_URL}/${slug}`;
  const fullTitle = `${title} | NeoMinds TechHub Portfolio`;
  const image = imageUrl ? toAbsoluteUrl(imageUrl) : undefined;

  document.title = fullTitle;
  setMetaById(META_IDS.description, description);
  setCanonical(url);

  setMeta("og:title", fullTitle, true);
  setMeta("og:description", description, true);
  setMeta("og:url", url, true);
  if (image) setMeta("og:image", image, true);

  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", description);
  if (image) setMeta("twitter:image", image);

  setProjectJsonLd({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: description.slice(0, 200),
    url,
    ...(image && { image }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
    author: {
      "@type": "Organization",
      name: "NeoMinds TechHub",
      url: "https://neomindstechhub.com",
    },
  });
}

export function resetSeo(): void {
  document.title = DEFAULT_TITLE;
  setMetaById(META_IDS.description, DEFAULT_DESCRIPTION);
  setCanonical(BASE_URL + "/");

  setMeta("og:title", DEFAULT_TITLE, true);
  setMeta("og:description", DEFAULT_DESCRIPTION, true);
  setMeta("og:url", BASE_URL + "/", true);
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.remove();
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.remove();

  setMeta("twitter:title", DEFAULT_TITLE);
  setMeta("twitter:description", DEFAULT_DESCRIPTION);

  removeProjectJsonLd();
}
