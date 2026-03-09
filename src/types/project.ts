export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  brand: string;
  shortDescription: string;
  imageUrl: string;
  tags: string[];
  videoUrl?: string;
  longDescription?: string;
  /** Optional SEO meta description (falls back to shortDescription if not set). */
  metaDescription?: string;
  technologies?: string[];
  outcomes?: string[];
}

export interface ThreeDCarouselItem {
  id: number;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export function projectToCarouselItem(p: PortfolioProject): ThreeDCarouselItem {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand,
    description: p.shortDescription,
    tags: p.tags,
    imageUrl: p.imageUrl,
    link: `/${p.slug}`,
  };
}
