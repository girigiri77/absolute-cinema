import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Film, ChevronDown } from "lucide-react";
import Particles from "../components/effects/Particles";
import LightStreaks from "../components/effects/LightStreaks";
import CinemaElements from "../components/effects/CinemaElements";

type Props = {
  onExploreMoods: () => void;
  onBrowseFilms: () => void;
  onScrollToContent: () => void;
};

const Hero: React.FC<Props> = ({ onExploreMoods, onBrowseFilms, onScrollToContent }) => {
  return (
    <section className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Pure brand poster: no movies, actors, franchises, posters, or metadata. */}
      <div className="absolute inset-0">
        <motion.img
          src="/images/absolute-cinema-brand-hero.jpg"
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_38%),linear-gradient(180deg,rgba(7,5,13,0.45),rgba(7,5,13,0.88))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,5,13,0.72),rgba(7,5,13,0.22)_45%,rgba(7,5,13,0.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_30%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 160 160%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.65%22/%3E%3C/svg%3E')" }} />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="pointer-events-none absolute left-1/2 top-0 h-[85vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(216,180,254,0.34),rgba(168,85,247,0.13)_32%,transparent_68%)] blur-xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: ["-30%", "12%", "-30%"], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-1/3 h-44 w-[140vw] -rotate-6 bg-gradient-to-r from-transparent via-fuchsia-400/18 to-transparent blur-2xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: ["18%", "-18%", "18%"], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-1/4 h-36 w-[130vw] rotate-3 bg-gradient-to-r from-transparent via-blue-400/14 to-transparent blur-2xl"
        />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-blue-600/18 blur-[120px]" />
        
        {/* Cinematic gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07050d] via-[#07050d]/70 to-transparent pointer-events-none" />
        
        {/* Content tease - blurred movie card edges at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 opacity-20 blur-[2px]">
            <div className="w-12 h-16 bg-gradient-to-b from-fuchsia-500/30 to-purple-600/20 rounded-t-lg" />
            <div className="w-12 h-16 bg-gradient-to-b from-purple-500/30 to-blue-600/20 rounded-t-lg" />
            <div className="w-12 h-16 bg-gradient-to-b from-blue-500/30 to-fuchsia-600/20 rounded-t-lg" />
            <div className="w-12 h-16 bg-gradient-to-b from-fuchsia-500/30 to-purple-600/20 rounded-t-lg" />
            <div className="w-12 h-16 bg-gradient-to-b from-purple-500/30 to-blue-600/20 rounded-t-lg" />
          </div>
        </div>
        </div>

      {/* Light streaks & particles */}
      <LightStreaks className="z-[1]" />
      <Particles count={50} className="z-[1]" />
      <CinemaElements />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pb-12 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-5xl"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 inline-flex"
          >
            <div className="relative rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500 px-4 py-1.5 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500 blur-md opacity-50" />
              <span className="relative text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
                #1 OTT DISCOVERY WEBSITE
              </span>
            </div>
          </motion.div>

          <h1 className="font-display text-hero-primary tracking-[0.14em] text-white xs:tracking-[0.18em]">
            <span className="block">ABSOLUTE</span>
            <span className="block text-gradient-cinema neon-glow">CINEMA</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-serif text-hero-tagline italic text-white/85 [text-shadow:0_0_24px_rgba(255,255,255,0.26)]">
            "Find what to watch tonight."
          </p>

          {/* Cinematic scroll guidance */}
          <div className="flex justify-center">
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              onClick={onScrollToContent}
              className="group relative mt-6 flex flex-col items-center gap-2 cursor-pointer"
            >
              {/* Glowing divider line */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scaleX: [0.8, 1, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent"
              />
              
              {/* Soft ambient glow behind text */}
              <motion.div
                animate={{ 
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-fuchsia-500/10 blur-xl rounded-full pointer-events-none"
              />
              
              <div className="relative flex items-center gap-2">
                {/* Animated arrow */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ y: [0, 8, 0] }}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-fuchsia-400/30 blur-sm rounded-full"
                  />
                  <ChevronDown className="relative h-4 w-4 text-fuchsia-200/90 group-hover:text-fuchsia-100 transition-colors duration-500" />
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative text-sm uppercase tracking-[0.2em] text-white font-medium group-hover:text-white transition-colors duration-500"
                >
                  Scroll down to see new OTT releases
                </motion.span>
              </div>
            </motion.button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
            <button
              onClick={onExploreMoods}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_20px_50px_-10px_rgba(168,85,247,0.6)] transition hover:scale-[1.03] glow-pulse min-h-[44px]"
            >
              <Sparkles className="h-4 w-4" />
              Explore Moods
            </button>
            <button
              onClick={onBrowseFilms}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white/10 min-h-[44px]"
            >
              <Film className="h-4 w-4" />
              Browse Films
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
