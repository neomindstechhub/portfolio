import { ReactNode } from "react";
import Galaxy from "./Galaxy";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy
          className="absolute inset-0"
          mouseInteraction={true}
          mouseRepulsion={false}
          density={0.9}
          speed={0.12}
          rotationSpeed={0.015}
          glowIntensity={0.32}
          saturation={0.22}
          twinkleIntensity={0.26}
          transparent={false}
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/20"
          aria-hidden
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />
      </div>

      <main className="relative z-10 py-4 sm:py-10 pb-24 sm:pb-20">
        {children}
      </main>
    </div>
  );
}
