import React from "react";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

const SectionHeader: React.FC<Props> = ({ eyebrow, title, subtitle, right }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
    >
      <div>
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl tracking-cinema text-white sm:text-4xl md:text-5xl">
          {title.split(" ").map((w, i) =>
            i % 3 === 1 ? (
              <span key={i} className="text-gradient-cinema">{w} </span>
            ) : (
              <span key={i}>{w} </span>
            )
          )}
        </h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/55 md:text-base">{subtitle}</p>}
      </div>
      {right}
    </motion.div>
  );
};

export default SectionHeader;
