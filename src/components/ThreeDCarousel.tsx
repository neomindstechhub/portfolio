import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ThreeDCarouselItem {
  id: number;
  title: string;
  brand: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
  title?: string;
  subtitle?: string;
  tagline?: string;
  isMobileSwipe?: boolean;
}

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 3500,
  cardHeight = 500,
  title = "Our Work",
  subtitle = "Portfolio",
  tagline = "Explore AI and ML projects we've delivered for real clients across healthcare, e-commerce, banking, and more.",
  isMobileSwipe = true,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!autoRotate || items.length === 0) return;
    const interval = setInterval(() => {
      if (!isHovering) {
        setActive((prev) => (prev + 1) % items.length);
      }
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, items.length, isHovering]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index: number) => {
    if (index === active) return "scale-100 opacity-100 z-20";
    if (isMobile) {
      return "scale-95 opacity-0 pointer-events-none -z-10";
    }
    if (index === (active + 1) % items.length)
      return "translate-x-[40%] scale-95 opacity-60 z-10";
    if (index === (active - 1 + items.length) % items.length)
      return "translate-x-[-40%] scale-95 opacity-60 z-10";
    return "scale-90 opacity-0 pointer-events-none";
  };

  if (items.length === 0) return null;

  return (
    <section
      id="portfolio-carousel"
      className="bg-transparent min-w-full flex items-center justify-center"
      ref={carouselRef}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl">
        <div
          className="relative overflow-hidden min-h-[460px] sm:min-h-[640px] md:min-h-[780px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={isMobileSwipe ? onTouchStart : undefined}
          onTouchMove={isMobileSwipe ? onTouchMove : undefined}
          onTouchEnd={isMobileSwipe ? onTouchEnd : undefined}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {items.map((item, index) => (
              <Link
                key={item.id}
                to={item.link}
                className={cn(
                  "absolute top-0 w-full max-w-3xl transform transition-all duration-500 block",
                  getCardAnimationClass(index)
                )}
                aria-live={index === active ? "polite" : undefined}
                aria-atomic={index === active}
                aria-label={index === active ? `Project ${index + 1} of ${items.length}: ${item.title}. Tap to view details.` : undefined}
              >
                <Card
                  className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/5 hover:border-primary/50 hover:bg-white/10 shadow-[0_18px_80px_rgba(0,0,0,0.7)] hover:shadow-[0_24px_96px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 rounded-2xl flex flex-col h-full transition-all duration-300 max-w-[calc(100vw-1.5rem)] sm:max-w-[640px] md:max-w-[720px]"
                  style={{ minHeight: isMobile ? 420 : cardHeight }}
                >
                  <div className="absolute inset-0 rounded-2xl pointer-events-none z-0" style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, transparent 45%, transparent 100%)" }} aria-hidden />
                  <div className="relative h-52 sm:h-80 md:h-96 overflow-hidden rounded-t-2xl">
                    <div
                      className="absolute inset-0 bg-black"
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  <CardContent
                    className={cn(
                      "px-4 sm:px-7 pt-6 sm:pt-10 pb-5 sm:pb-7 flex flex-col flex-grow transition-opacity duration-300",
                      index === active ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <h3 className="text-base sm:text-heading-3 font-bold mb-1 text-foreground line-clamp-2 sm:line-clamp-none">
                      {item.title}
                    </h3>
                    <p className="text-body text-muted-foreground font-medium mb-2">
                      {item.brand}
                    </p>
                    <p className="text-sm sm:text-body text-muted-foreground flex-grow line-clamp-3 sm:line-clamp-none">
                      {item.description}
                    </p>

                    <div className="mt-3 sm:mt-4">
                      <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hidden -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-caption whitespace-nowrap shrink-0"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-primary flex items-center group w-fit">
                        <span className="relative z-10">Learn more</span>
                        <ArrowRight className="ml-2 w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {!isMobile && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-card/70 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground/90 hover:text-foreground border border-white/10 z-30 transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-card/70 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground/90 hover:text-foreground border border-white/10 z-30 transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() =>
                  setActive((prev) => (prev + 1) % items.length)
                }
                aria-label="Next project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute bottom-0 sm:bottom-1 left-0 right-0 flex justify-center items-center gap-1.5 sm:gap-2 z-30 pt-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  "h-2 w-2 min-w-[8px] rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active === idx ? "bg-primary w-5" : "bg-white/30 hover:bg-white/50"
                )}
                onClick={() => setActive(idx)}
                aria-label={`Go to project ${idx + 1}`}
                aria-current={active === idx ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
