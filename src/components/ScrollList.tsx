import React, { useRef, useEffect, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScrollListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  itemHeightMobile?: number;
}

const ScrollList = <T,>({
  data,
  renderItem,
  itemHeight = 155,
  itemHeightMobile,
}: ScrollListProps<T>) => {
  const isMobile = useIsMobile();
  const effectiveHeight = isMobile && itemHeightMobile != null ? itemHeightMobile : itemHeight;
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateFocusedItem = () => {
      if (!listRef.current) return;

      const container = listRef.current;
      const children = Array.from(container.children) as HTMLDivElement[];
      const viewportCenter = window.innerHeight / 2;

      let closestItemIndex = 0;
      let minDistanceToCenter = Infinity;

      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;

        const distanceToCenter = Math.abs(
          itemCenter - viewportCenter
        );

        if (distanceToCenter < minDistanceToCenter) {
          minDistanceToCenter = distanceToCenter;
          closestItemIndex = index;
        }
      });

      setFocusedIndex(closestItemIndex);
    };

    updateFocusedItem();

    window.addEventListener("scroll", updateFocusedItem);

    return () => {
      window.removeEventListener("scroll", updateFocusedItem);
    };
  }, [data, effectiveHeight]);

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.7,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" },
    },
    focused: {
      opacity: 1,
      scale: 1,
      zIndex: 10,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" },
    },
    next: {
      opacity: 1,
      scale: shouldReduceMotion ? 1 : 0.95,
      zIndex: 5,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={listRef}
      className="scroll-list__wrp scrollbar-hidden mx-auto w-full flex flex-col gap-4 sm:gap-6"
    >
      {data.map((item, index) => {
        let variant: keyof typeof itemVariants = "hidden";

        if (index === focusedIndex) {
          variant = "focused";
        } else if (index === focusedIndex + 1) {
          variant = "next";
        } else {
          const isWithinVisibleRange = Math.abs(index - focusedIndex) <= 2;
          if (isWithinVisibleRange) {
            variant = "visible";
          }
        }

        return (
          <motion.div
            key={index}
            className="scroll-list__item mx-auto max-w-5xl w-full px-1 sm:px-0 relative"
            variants={itemVariants}
            initial="hidden"
            animate={variant}
            style={{
              height: effectiveHeight ? `${effectiveHeight}px` : "auto",
              pointerEvents: "auto",
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScrollList;

