import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Particles from "../components/effects/Particles";
import LightStreaks from "../components/effects/LightStreaks";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message || "Authentication failed");
      setLoading(false);
    } else {
      navigate("/studio");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 cinema-radial" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-700/20 blur-[140px]" />
      </div>
      <LightStreaks />
      <Particles count={60} />

      <div className="absolute left-4 top-4 z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-white/65 hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Back to Cinema
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong relative rounded-3xl p-8 shadow-[0_40px_100px_-20px_rgba(168,85,247,0.55)]">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-200">
              <Lock className="h-3 w-3" /> Studio Access
            </div>
            <h1 className="mt-3 font-display text-3xl tracking-cinema text-white">CONTROL ROOM</h1>
            <p className="mt-1 text-sm text-white/55">Sign in to manage the cinematic catalog.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 px-4 text-sm text-white outline-none transition focus:border-fuchsia-500/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
                required
                autoFocus
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-fuchsia-500/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-blue-600 py-3 text-sm font-bold text-white shadow-[0_15px_50px_-10px_rgba(168,85,247,0.55)] transition hover:scale-[1.01] disabled:opacity-70"
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</> : <>Enter Control Room</>}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
