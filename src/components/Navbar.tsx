import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Sparkles, Film, Flame, Heart, Cog } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

type Props = {
  onSearch?: (q: string) => void;
  onScrollTo?: (id: string) => void;
};

const NAV_ITEMS = [
  { id: "releases", label: "Releases", icon: Sparkles },
  { id: "moods", label: "Moods", icon: Heart },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "telugu", label: "Telugu", icon: Film },
];

const Navbar: React.FC<Props> = ({ onSearch, onScrollTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { onSearch?.(q); }, [q, onSearch]);

  const go = (id: string) => {
    onScrollTo?.(id);
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
        (scrolled ? "py-1 sm:py-2" : "py-2 sm:py-4")
      }
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div
          className={
            "flex items-center justify-between gap-2 sm:gap-4 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-500 " +
            (scrolled
              ? "glass-strong shadow-[0_20px_60px_-20px_rgba(168,85,247,0.35)]"
              : "glass")
          }
        >
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="group relative rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="absolute inset-x-2 -bottom-px h-px scale-x-0 bg-gradient-to-r from-fuchsia-400 to-purple-500 transition-transform group-hover:scale-x-100" />
              </button>
            ))}
            <Link
              to="/studio"
              className="group relative ml-1 inline-flex items-center gap-1.5 overflow-hidden rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-3.5 py-2 text-xs font-bold tracking-[0.18em] text-fuchsia-100 shadow-[0_0_24px_-10px_rgba(168,85,247,0.9)] backdrop-blur-xl transition duration-300 hover:scale-[1.04] hover:border-fuchsia-300/55 hover:bg-fuchsia-400/15 hover:text-white hover:shadow-[0_0_34px_-8px_rgba(217,70,239,0.95)]"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-300/10 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Cog className="relative z-10 h-4 w-4 text-fuchsia-200 transition-transform duration-300 group-hover:rotate-45" />
              <span className="relative z-10">STUDIO</span>
            </Link>
          </nav>

          <div className="hidden flex-1 max-w-sm md:flex lg:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search films, series, moods…"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-10 pr-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-fuchsia-500/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
            <Link
              to="/studio"
              className="inline-flex items-center gap-1.5 rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 px-2.5 py-2 text-[10px] font-bold tracking-[0.16em] text-fuchsia-100 shadow-[0_0_24px_-10px_rgba(168,85,247,0.9)] backdrop-blur-xl transition hover:scale-105 hover:border-fuchsia-300/55 hover:bg-fuchsia-400/15 hover:text-white"
            >
              <Cog className="h-3.5 w-3.5" />
              STUDIO
            </Link>
            <button
              className="rounded-lg p-2 text-white/80 hover:bg-white/5"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 glass-strong rounded-2xl p-3 sm:p-4"
            >
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search films, series, moods…"
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder-white/40 outline-none focus:border-fuchsia-500/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80"
                  >
                    <item.icon className="h-4 w-4 text-fuchsia-300" />
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/studio"
                  onClick={() => setOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-fuchsia-400/25 bg-gradient-to-r from-fuchsia-500/20 to-purple-600/15 px-3 py-3 text-sm font-bold tracking-[0.2em] text-fuchsia-100 shadow-[0_0_26px_-12px_rgba(168,85,247,0.9)] transition hover:scale-[1.02] hover:border-fuchsia-300/55 hover:text-white"
                >
                  <Cog className="h-4 w-4 text-fuchsia-200" />
                  STUDIO
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
