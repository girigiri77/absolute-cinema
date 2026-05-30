import React, { useState } from "react";
import { motion } from "framer-motion";
import { PLATFORM_LOGOS, PLATFORM_COLORS } from "../types";

type Props = {
  platform: string;
};

const LOGO_SIZES: Record<string, string> = {
  Netflix: "max-w-[70%] max-h-[45px]",
  "Prime Video": "max-w-[95%] max-h-[75px]",
  Aha: "max-w-[95%] max-h-[75px]",
  SunNXT: "max-w-[95%] max-h-[75px]",
  JioHotstar: "max-w-[95%] max-h-[75px]",
  SonyLIV: "max-w-[95%] max-h-[75px]",
  Zee5: "max-w-[95%] max-h-[75px]",
  JioCinema: "max-w-[95%] max-h-[75px]",
};

const PlatformCard: React.FC<Props> = ({ platform }) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = PLATFORM_LOGOS[platform];
  const platformColor = PLATFORM_COLORS[platform] || { bg: "#333333", text: "#FFFFFF" };

  return (
    <motion.div
      className="group relative w-[150px] h-[90px] md:w-[180px] md:h-[100px] rounded-2xl border border-white/8 bg-white/[0.03] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:border-fuchsia-400/30 hover:shadow-[0_12px_40px_-8px_rgba(168,85,247,0.4)] cursor-pointer"
      whileHover={{ y: -2 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 via-fuchsia-400/8 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Logo */}
      {logoUrl && !imageError ? (
        <div className="flex items-center justify-center w-full h-full p-1 overflow-hidden">
          <img
            src={logoUrl}
            alt={platform}
            className={`w-auto h-auto object-contain ${LOGO_SIZES[platform] || "max-w-[90%] max-h-[70px]"}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        /* Branded colored fallback */
        <div
          className="relative z-10 flex h-full items-center justify-center p-3 text-center"
          style={{ backgroundColor: platformColor.bg }}
        >
          <span
            className="text-xs sm:text-sm font-semibold"
            style={{ color: platformColor.text }}
          >
            {platform}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default PlatformCard;
