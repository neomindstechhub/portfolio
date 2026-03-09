"use client";

import React, { useRef, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const CardContainer = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("relative", className)} style={{ perspective: "1000px" }}>
      {children}
    </div>
  );
};

export const CardBody = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxTilt = 4;
      const moveY = Math.max(-maxTilt, Math.min(maxTilt, (e.clientY - centerY) / 55));
      const moveX = Math.max(-maxTilt, Math.min(maxTilt, -(e.clientX - centerX) / 55));
      rotateX.set(moveY);
      rotateY.set(moveX);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  translateZ = 0,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  translateZ?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}) => {
  return (
    <Tag
      className={cn(className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};
