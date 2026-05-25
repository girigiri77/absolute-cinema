import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-blue-600 p-[2px] shadow-[0_0_25px_rgba(168,85,247,0.55)]">
          <div className="relative flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0612]">
            {/* Aperture */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-fuchsia-300" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3 L15 11 L21 12 L15 13 L12 21 L9 13 L3 12 L9 11 Z" fill="currentColor" opacity=".7" stroke="none"/>
            </svg>
          </div>
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-fuchsia-500/30 opacity-0 blur-xl transition group-hover:opacity-100" />
        </div>
      </motion.div>
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-xl tracking-cinema text-white">
            ABSOLUTE
          </div>
          <div className="font-display text-xl tracking-cinema text-gradient-cinema">
            CINEMA
          </div>
        </div>
      )}
    </Link>
  );
};

export default Logo;
