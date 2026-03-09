import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { projects } from "@/data/projects";
import { setProjectSeo, resetSeo } from "@/lib/seo";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { PortfolioProject } from "@/types/project";

const MAIN_SITE_URL = "https://neomindstechhub.com";

/** Renders longDescription with paragraphs, subheadings (h2), and bullet lists for SEO and readability. */
function ProjectContent({ text }: { text: string }) {
  const blocks = useMemo(() => {
    const raw = text.split(/\n\n+/);
    return raw.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
      const isShortHeading =
        lines.length === 1 &&
        lines[0].length < 55 &&
        !/\.$|!$|\?$/.test(lines[0]);
      const isBulletList =
        lines.some((l) => l.startsWith("•")) ||
        lines.every((l) => l.startsWith("- "));
      const listItems = isBulletList
        ? lines.map((l) => l.replace(/^[•\-]\s*/, "").trim())
        : [];
      return {
        isHeading: isShortHeading && !isBulletList,
        isList: isBulletList && listItems.length > 0,
        heading: isShortHeading ? lines[0] : null,
        listItems,
        paragraph: !isShortHeading && !isBulletList ? trimmed : null,
      };
    });
  }, [text]);

  return (
    <div className="project-content space-y-6 max-w-3xl leading-relaxed">
      {blocks.map((b, i) => {
        if (!b) return null;
        if (b.isHeading && b.heading) {
          return (
            <h2
              key={i}
              className="text-heading-3 font-semibold text-foreground mt-8 mb-2 first:mt-0 scroll-mt-6"
              id={b.heading.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
            >
              {b.heading}
            </h2>
          );
        }
        if (b.isList && b.listItems.length > 0) {
          return (
            <ul key={i} className="list-none space-y-2 pl-0">
              {b.listItems.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-muted-foreground text-body-lg"
                >
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.paragraph) {
          return (
            <p key={i} className="text-muted-foreground text-body-lg leading-relaxed">
              {b.paragraph}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    if (!project) return;
    const metaDesc =
      (project as PortfolioProject & { metaDescription?: string }).metaDescription ??
      project.shortDescription;
    setProjectSeo({
      title: project.title,
      description: metaDesc,
      slug: project.slug,
      imageUrl: project.imageUrl,
      tags: project.tags,
    });
    return resetSeo;
  }, [project]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center shadow-[0_18px_80px_rgba(0,0,0,0.5)]">
          <h1 className="text-heading-2 font-bold text-foreground mb-2">
            Project not found
          </h1>
          <p className="text-body text-muted-foreground mb-6">
            This project wasn&apos;t found. It may have been moved or the link might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-cta text-white font-medium hover:bg-primary-cta-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Back to portfolio
            </Link>
            <Link
              to="/#all-projects"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-white/15 bg-black/50 text-foreground font-medium hover:border-primary/50 hover:bg-black/70 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View all projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isYouTube = project.videoUrl?.includes("youtube.com") ?? false;
  const isVimeo = project.videoUrl?.includes("vimeo.com") ?? false;
  const isEmbed = isYouTube || isVimeo;

  return (
    <div className="relative max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 pt-14 sm:pt-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-3 sm:left-4 top-4 sm:top-6 inline-flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-black/70 active:scale-95 sm:hover:scale-105 shadow-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
        aria-label="Back to previous page"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <nav className="mb-6 sm:mb-8 pt-0 sm:pt-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm sm:text-body text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Portfolio
            </Link>
          </li>
          <li aria-hidden className="text-muted-foreground/60">/</li>
          <li className="text-foreground/80 font-medium truncate max-w-[180px] sm:max-w-md">
            {project.title}
          </li>
        </ol>
      </nav>

      <article itemScope itemType="https://schema.org/CreativeWork">
        <header className="mb-8 sm:mb-10">
          <p className="text-caption font-medium text-primary uppercase tracking-wider mb-1">
            {project.brand}
          </p>
          <h1 className="text-xl sm:text-heading-1 font-bold text-foreground leading-tight" itemProp="name">
            {project.title}
          </h1>
          <p className="sr-only" itemProp="description">
            {project.shortDescription}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-caption"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="w-full aspect-video rounded-xl overflow-hidden bg-muted mb-10 border border-white/5"
          style={{
            backgroundImage: `url(${project.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          role="img"
          aria-label={`${project.title} project preview`}
        />

        {project.videoUrl && (
          <section className="mb-10" aria-labelledby="video-heading">
            <h2 id="video-heading" className="text-heading-3 font-semibold text-foreground mb-4 scroll-mt-6">
              Video overview
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {isEmbed ? (
                <iframe
                  src={project.videoUrl}
                  title={`${project.title} video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={project.videoUrl}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </section>
        )}

        {project.longDescription && (
          <section className="mb-10" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-heading-3 font-semibold text-foreground mb-4 scroll-mt-6">
              About this project
            </h2>
            <ProjectContent text={project.longDescription} />
          </section>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <section className="mb-10" aria-labelledby="tech-heading">
            <h2 id="tech-heading" className="text-heading-3 font-semibold text-foreground mb-4 scroll-mt-6">
              Technologies
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-body"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.outcomes && project.outcomes.length > 0 && (
          <section className="mb-10" aria-labelledby="outcomes-heading">
            <h2 id="outcomes-heading" className="text-heading-3 font-semibold text-foreground mb-4 scroll-mt-6">
              Outcomes
            </h2>
            <ul className="space-y-2">
              {project.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-2 text-muted-foreground text-body-lg"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="pt-10 border-t border-border">
          <p className="text-body text-muted-foreground mb-4">
            Interested in a similar project or want to discuss AI for your business?
          </p>
          <p className="text-caption text-muted-foreground/80 mb-4">
            Free consultation — we typically respond within 24 hours.
          </p>
          <Link
            to="/event-registration"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 min-h-[48px] rounded-lg bg-primary-cta text-white font-medium hover:bg-primary-cta-hover active:scale-[0.98] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
          >
            Get in touch / Book a demo
          </Link>
        </section>
      </article>

      <a
        href={MAIN_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 inline-flex items-center gap-2 text-body text-muted-foreground hover:text-primary transition-colors border border-white/10 rounded-lg px-4 py-2 hover:border-primary/40 hover:bg-white/5"
        aria-label="Back to main website"
      >
        <ExternalLink className="w-4 h-4 shrink-0" />
        <span>Back to main website</span>
      </a>
    </div>
  );
}
