import React, { useEffect, useRef } from "react";

interface FallBeamBackgroundProps {
  className?: string;
  lineCount?: number;
  displayText?: string;
  beamColorClass?: string;
}

const getColorValue = (colorClass: string): string => {
  switch (colorClass) {
    case "green-400":
      return "rgba(74, 222, 128, 0.6)";
    case "cyan-400":
      return "rgba(34, 211, 238, 0.6)";
    case "blue-400":
      return "rgba(96, 165, 250, 0.6)";
    case "red-400":
      return "rgba(248, 113, 113, 0.6)";
    case "indigo-400":
      return "rgba(129, 140, 248, 0.6)";
    case "orange-400":
      return "rgba(251, 146, 60, 0.55)";
    case "amber-400":
      return "rgba(251, 191, 36, 0.5)";
    default:
      return "rgba(251, 146, 60, 0.55)";
  }
};

const FallBeamBackground: React.FC<FallBeamBackgroundProps> = ({
  className = "",
  lineCount = 16,
  displayText,
  beamColorClass = "orange-400",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const dynamicStyles = `
    .fall-beam-line {
      position: absolute;
      width: 1px;
      height: 100%;
      z-index: 1;
    }
    .fall-beam-line::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 120px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        var(--beam-glow-color)
      );
      animation: fallBeam var(--ani-duration) var(--ani-delay) linear infinite;
    }
    @keyframes fallBeam {
      0% { top: -120px; opacity: 0; }
      5% { opacity: 0.6; }
      95% { opacity: 0.6; }
      100% { top: 100%; opacity: 0; }
    }
  `;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    container.querySelectorAll(".fall-beam-line").forEach((line) => line.remove());
    const glowColor = getColorValue(beamColorClass);

    for (let i = 1; i <= lineCount; i++) {
      const line = document.createElement("div");
      line.classList.add("fall-beam-line");

      const leftPosition = `${(i - 0.5) * (100 / lineCount) + (Math.random() * 3 - 1.5)}%`;
      const duration = 10 + Math.random() * 8 + "s";
      const delay = -Math.random() * 12 + "s";

      line.style.setProperty("left", leftPosition);
      line.style.setProperty("--ani-duration", duration);
      line.style.setProperty("--ani-delay", delay);
      line.style.setProperty("--beam-glow-color", glowColor);

      container.appendChild(line);
    }

    return () => {
      container.querySelectorAll(".fall-beam-line").forEach((line) => line.remove());
    };
  }, [lineCount, beamColorClass]);

  return (
    <>
      <style>{dynamicStyles}</style>
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 overflow-hidden bg-transparent pointer-events-none ${className}`}
        aria-hidden
      >
        {displayText && (
          <h1 className="relative z-20 grid place-content-center h-full font-sans text-4xl sm:text-5xl lg:text-7xl font-bold text-white p-4 text-center">
            {displayText}
            <div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)",
              }}
            />
          </h1>
        )}
      </div>
    </>
  );
};

export default FallBeamBackground;
