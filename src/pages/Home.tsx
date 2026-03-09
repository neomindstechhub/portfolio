import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ThreeDCarousel from "@/components/ThreeDCarousel";
import ScrollList from "@/components/ScrollList";
import { projects } from "@/data/projects";
import { projectToCarouselItem } from "@/types/project";
import type { PortfolioProject } from "@/types/project";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const MAIN_SITE_URL = "https://neomindstechhub.com";
const carouselItems = projects.slice(0, 10).map(projectToCarouselItem);

export default function Home() {
  const navigate = useNavigate();
  const allProjectsRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showBackToCarousel, setShowBackToCarousel] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (window.location.hash === "#all-projects" && allProjectsRef.current) {
      const t = setTimeout(() => {
        allProjectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const threshold = 600;
    const handleScroll = () => {
      setShowBackToCarousel(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAllProjects = () => {
    allProjectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={heroRef}
        className="relative min-h-[85svh] sm:min-h-[80vh] flex flex-col items-center justify-center pt-16 sm:pt-6 md:pt-10 pb-8"
      >
        <a
          href={MAIN_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-3 sm:left-4 top-4 sm:top-6 inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-black/70 active:scale-95 sm:hover:scale-105 shadow-lg transition-all duration-200 z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
          aria-label="Back to main website"
        >
          <ArrowLeft className="w-4 h-4" />
        </a>
        <Link
          to="/event-registration"
          className="absolute right-3 sm:right-4 top-4 sm:top-6 inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-primary-cta text-white font-medium hover:bg-primary-cta-hover transition-all duration-200 z-10 shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px]"
        >
          Book a demo
        </Link>
        <header className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
          <h1 className="text-2xl sm:text-display font-bold text-foreground mb-2">
            Our Work
          </h1>
          <p className="text-sm sm:text-body-lg text-muted-foreground max-w-xl mx-auto">
            AI & ML projects we&apos;ve delivered for real clients across healthcare, e-commerce, banking, and more.
          </p>
        </header>
        <ThreeDCarousel
          items={carouselItems}
          autoRotate
          rotateInterval={3500}
          cardHeight={720}
          isMobileSwipe
        />

        <button
          type="button"
          onClick={scrollToAllProjects}
          className="mt-10 sm:mt-14 md:mt-16 flex flex-col items-center gap-2 px-4 py-3 sm:py-2 rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-white/10 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation min-h-[44px]"
          aria-label="See all projects"
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce-subtle" />
          <span className="text-sm sm:text-body">See all projects</span>
        </button>
      </div>

      <section
        id="all-projects"
        ref={allProjectsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24"
      >
        <header className="mb-6 sm:mb-10">
          <p className="text-caption font-medium text-primary uppercase tracking-wider mb-1">
            All Projects
          </p>
          <h2 className="text-xl sm:text-heading-2 font-bold text-foreground">
            Explore the full stack of work
          </h2>
          <p className="text-sm sm:text-body text-muted-foreground mt-2 max-w-xl">
            Case studies from healthcare, e-commerce, banking, and more. Tap a project to open its detailed story.
          </p>
        </header>

        <ScrollList<PortfolioProject>
          data={projects}
          itemHeight={340}
          itemHeightMobile={380}
          renderItem={(project) => (
            <div
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/${project.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/${project.slug}`);
                }
              }}
              className="group relative flex h-full w-full flex-col rounded-2xl border border-white/5 bg-white/5 overflow-hidden shadow-[0_18px_80px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:shadow-[0_24px_96px_rgba(0,0,0,0.8)] active:scale-[0.99] sm:hover:-translate-y-0.5 touch-manipulation cursor-pointer"
              aria-label={`View ${project.title} details`}
            >
              <div
                className="w-full h-36 sm:h-44 flex-shrink-0 overflow-hidden bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${project.imageUrl})` }}
                aria-hidden
              />

              <div className="flex min-w-0 flex-1 flex-col px-4 sm:px-5 py-3 sm:py-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary mb-1">
                  {project.brand}
                </p>
                <h3 className="truncate text-base sm:text-heading-3 font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm sm:text-body text-muted-foreground">
                  {project.shortDescription}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5 overflow-x-auto scrollbar-hidden sm:overflow-visible">
                  {project.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="mt-3 text-xs font-medium text-primary opacity-80 group-hover:opacity-100">
                  View
                </span>
              </div>
            </div>
          )}
        />
      </section>

      <AnimatePresence>
        {showBackToCarousel && (
          <motion.button
            type="button"
            onClick={scrollToHero}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-4 sm:right-6 z-20 inline-flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-black/70 active:scale-95 sm:hover:scale-105 shadow-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
            aria-label="Back to carousel"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
