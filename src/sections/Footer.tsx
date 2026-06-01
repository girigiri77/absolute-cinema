import React from "react";
import { Mail, Heart } from "lucide-react";

const BrandIcon: React.FC<{ kind: "twitter" | "instagram" | "youtube" | "github" }> = ({ kind }) => {
  if (kind === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2H21l-6.49 7.41L22 22h-6.94l-4.51-5.96L4.8 22H2.04l6.98-7.98L2 2h7.06l4.08 5.4L18.24 2zm-2.43 18h1.84L7.27 4H5.32l10.5 16z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.1c-3.1.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z" />
    </svg>
  );
};
import Logo from "../components/Logo";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0614] to-[#07050d]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent" />
        <div className="absolute -top-32 left-1/2 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-4 lg:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-white/55">
              Absolute Cinema is a curated discovery experience for films, series, and emotions — across every OTT platform.
              Built for cinephiles, by cinephiles.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {(["twitter", "instagram", "youtube", "github"] as const).map(k => (
                <a
                  key={k}
                  href="#"
                  aria-label={k}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:scale-110 hover:border-fuchsia-400/40 hover:text-white"
                >
                  <BrandIcon kind={k} />
                </a>
              ))}
              <a
                href="mailto:hello@absolutecinema.app"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:scale-110 hover:border-fuchsia-400/40 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a className="hover:text-white" href="#releases">Weekly Releases</a></li>
              <li><a className="hover:text-white" href="#moods">Moods</a></li>
              <li><a className="hover:text-white" href="#trending">Trending</a></li>
              <li><a className="hover:text-white" href="#telugu">Telugu Picks</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><Link className="hover:text-white" to="/about">About</Link></li>
              <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
              <li><a className="hover:text-white" href="#">Press</a></li>
              <li>
                <Link className="text-fuchsia-300 hover:text-fuchsia-200" to="/studio">Studio</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Absolute Cinema. All rights reserved. Frame by frame.</div>
          <div className="inline-flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 fill-fuchsia-400 stroke-fuchsia-400" /> for cinema lovers.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
