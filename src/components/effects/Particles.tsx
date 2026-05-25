import React, { useMemo } from "react";

type Props = { count?: number; className?: string };

const Particles: React.FC<Props> = ({ count = 40, className = "" }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = 18 + Math.random() * 22;
      const opacity = 0.3 + Math.random() * 0.6;
      const hueShift = Math.random();
      const color =
        hueShift < 0.4
          ? "rgba(236, 72, 153, " + opacity + ")"
          : hueShift < 0.75
          ? "rgba(168, 85, 247, " + opacity + ")"
          : "rgba(96, 165, 250, " + opacity + ")";
      return { i, size, left, delay, duration, color };
    });
  }, [count]);

  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + className}>
      {particles.map(p => (
        <span
          key={p.i}
          style={{
            position: "absolute",
            bottom: "-10px",
            left: p.left + "%",
            width: p.size + "px",
            height: p.size + "px",
            borderRadius: "9999px",
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
