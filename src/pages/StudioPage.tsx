import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Edit3,
  Eye,
  Film,
  Flame,
  GripVertical,
  Layers,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useMovies } from "../context/MoviesContext";
import { useAuth } from "../context/AuthContext";
import MovieForm from "../studio/MovieForm";
import ImageUpload from "../studio/ImageUpload";
import type { MoodCategory, Movie } from "../types";
import { PLATFORMS } from "../types";
import { getMoodMovieCount } from "../utils/moodCollections";
import Logo from "../components/Logo";
const GRADIENT_PRESETS = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-indigo-500",
  "from-orange-500 to-red-600",
  "from-amber-500 to-orange-600",
  "from-zinc-700 to-zinc-900",
  "from-yellow-400 to-amber-500",
  "from-fuchsia-400 to-pink-500",
  "from-red-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-700",
  "from-emerald-500 to-teal-600",
  "from-lime-500 to-green-600",
];

type CatalogFilter = "all" | "trending" | "telugu" | "weekly" | "hero";
type ToastTone = "success" | "danger" | "info";
type Toast = { id: number; title: string; detail?: string; tone: ToastTone };

const StudioPage: React.FC = () => {
  const { signOut } = useAuth();
  return <ControlRoom onLogout={signOut} />;
};

const ControlRoom: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { movies, moods, toggles, setToggles, addMovie, updateMovie, deleteMovie, addMood, updateMood, deleteMood, reorderMoods, resetData } = useMovies();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [platform, setPlatform] = useState("all");
  const [editing, setEditing] = useState<Movie | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  const notify = (title: string, detail?: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [{ id, title, detail, tone }, ...prev].slice(0, 4));
    window.setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return movies.filter(m => {
      const statusMatch =
        filter === "all" ||
        (filter === "trending" && m.isTrending) ||
        (filter === "telugu" && (m.isTeluguPick || m.isTelugu)) ||
        (filter === "weekly" && m.isWeeklyRelease) ||
        (filter === "hero" && m.isHeroFeatured);
      const platformMatch = platform === "all" || m.platforms.includes(platform);
      const moodLabels = m.moods
        .map(id => moods.find(md => md.id === id)?.label || id)
        .join(" ")
        .toLowerCase();
      const searchMatch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        String(m.year).includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.platforms.some(p => p.toLowerCase().includes(q)) ||
        moodLabels.includes(q);
      return statusMatch && platformMatch && searchMatch;
    });
  }, [movies, moods, query, filter, platform]);

  const stats = useMemo(() => ({
    total: movies.length,
    trending: movies.filter(m => m.isTrending).length,
    telugu: movies.filter(m => m.isTeluguPick || m.isTelugu).length,
    weekly: movies.filter(m => m.isWeeklyRelease).length,
  }), [movies]);

  const handleSubmit = (data: Omit<Movie, "id" | "createdAt">) => {
    if (editing) {
      updateMovie(editing.id, data);
      notify("Movie updated", `${data.title} is live everywhere.`);
    } else {
      addMovie(data);
      notify("Movie added", `${data.title} now appears on the public site.`);
    }
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (m: Movie) => {
    setEditing(m);
    setShowForm(true);
  };

  const startAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const removeOne = (m: Movie) => {
    if (!confirm(`Delete "${m.title}" from the catalog?`)) return;
    deleteMovie(m.id);
    notify("Movie deleted", `${m.title} was removed everywhere.`, "danger");
  };

  const toggleSection = (key: keyof typeof toggles, value: boolean) => {
    setToggles({ ...toggles, [key]: value });
    notify("Homepage section updated", `${sectionLabel(key)} is now ${value ? "visible" : "hidden"}.`, "info");
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 cinema-radial opacity-90" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-700/10 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07050d]/85 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl gap-2 px-3 sm:px-4 py-2.5 sm:py-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="hidden rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-200 md:inline-block">
                Studio
              </span>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/" className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10">
                Site
              </Link>
              <button onClick={onLogout} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10">
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_150px_160px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search title, mood, OTT, genre..."
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-fuchsia-500/60 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
              />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as CatalogFilter)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500/60"
            >
              <option className="bg-[#0c0817]" value="all">All Status</option>
              <option className="bg-[#0c0817]" value="trending">Trending</option>
              <option className="bg-[#0c0817]" value="telugu">Telugu Picks</option>
              <option className="bg-[#0c0817]" value="weekly">Weekly Releases</option>
              <option className="bg-[#0c0817]" value="hero">Hero Featured</option>
            </select>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500/60"
            >
              <option className="bg-[#0c0817]" value="all">All OTT</option>
              {PLATFORMS.map(p => <option className="bg-[#0c0817]" key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">
              <Eye className="h-3.5 w-3.5" /> Back to Cinema
            </Link>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-200/80">Studio Control Room</div>
            <h1 className="mt-1 font-display text-4xl tracking-cinema text-white md:text-5xl">
              ABSOLUTE <span className="text-gradient-cinema">CMS</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/55">
              One catalog controls homepage, releases, trending, Telugu picks, mood discovery, search results, and movie modals in real time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Reset to initial seed data?")) {
                  resetData();
                  notify("Demo catalog restored", "The shared catalog was reset.", "info");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Demo
            </button>
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Add Movie
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={<Film className="h-5 w-5" />} label="Total Titles" value={stats.total} color="from-fuchsia-500 to-purple-600" />
          <StatCard icon={<Flame className="h-5 w-5" />} label="Trending" value={stats.trending} color="from-orange-500 to-red-600" />
          <StatCard icon={<Sparkles className="h-5 w-5" />} label="Weekly Releases" value={stats.weekly} color="from-blue-500 to-cyan-500" />
          <StatCard icon={<Star className="h-5 w-5" />} label="Telugu Picks" value={stats.telugu} color="from-pink-500 to-fuchsia-600" />
        </div>

        <div className="mt-8 glass-strong rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-fuchsia-300" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/85">Homepage Sections</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "weeklyReleases" as const, label: "Weekly Releases" },
              { key: "moodDiscovery" as const, label: "Mood Discovery" },
              { key: "trending" as const, label: "Trending Movies" },
              { key: "teluguPicks" as const, label: "Telugu Picks" },
            ].map(t => (
              <label key={t.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10">
                <span className="text-sm text-white/85">{t.label}</span>
                <ToggleSwitch on={toggles[t.key]} onChange={(v) => toggleSection(t.key, v)} />
              </label>
            ))}
          </div>
        </div>

        <MoodDiscoveryManager
          moods={moods}
          movies={movies}
          onAddMood={addMood}
          onUpdateMood={updateMood}
          onDeleteMood={deleteMood}
          onReorderMoods={reorderMoods}
          notify={notify}
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl tracking-cinema text-white">MOVIE MANAGEMENT</h3>
            <p className="text-xs text-white/45">Showing {filtered.length} of {movies.length} titles from the shared catalog.</p>
          </div>
          <button
            onClick={() => { setQuery(""); setFilter("all"); setPlatform("all"); }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
          >
            Clear Filters
          </button>
        </div>

        <CatalogTable movies={filtered} moodsCatalog={moods} onEdit={startEdit} onDelete={removeOne} />

        <div className="py-10 text-center text-xs text-white/35">
          Absolute Cinema Studio - localStorage persisted, Context powered, and synced across tabs.
        </div>
      </main>

      <MovieEditorModal
        open={showForm}
        initial={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
};

type MoodDraft = Omit<MoodCategory, "id" | "createdAt" | "updatedAt"> & { id?: string };

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/55">{label}</div>
    {children}
  </div>
);

const MoodDiscoveryManager: React.FC<{
  moods: MoodCategory[];
  movies: Movie[];
  onAddMood: (mood: MoodDraft) => MoodCategory;
  onUpdateMood: (id: string, patch: Partial<MoodCategory>) => void;
  onDeleteMood: (id: string) => void;
  onReorderMoods: (ids: string[]) => void;
  notify: (title: string, detail?: string, tone?: ToastTone) => void;
}> = ({ moods, movies, onAddMood, onUpdateMood, onDeleteMood, onReorderMoods, notify }) => {
  const sortedMoods = useMemo(() => [...moods].sort((a, b) => a.sortOrder - b.sortOrder), [moods]);
  const [editing, setEditing] = useState<MoodCategory | null>(null);
  const [draft, setDraft] = useState<MoodDraft | null>(null);
  const [linkedMovieIds, setLinkedMovieIds] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [linkedDragId, setLinkedDragId] = useState<string | null>(null);
  const [movieSearch, setMovieSearch] = useState("");

  const searchableMovies = useMemo(() => {
    const q = movieSearch.toLowerCase().trim();
    if (!q) return movies;
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(q) ||
      movie.genres.some(genre => genre.toLowerCase().includes(q)) ||
      movie.platforms.some(platform => platform.toLowerCase().includes(q))
    );
  }, [movies, movieSearch]);

  const linkedMovies = useMemo(() => {
    const byId = new Map(movies.map(movie => [movie.id, movie]));
    return linkedMovieIds.map(id => byId.get(id)).filter(Boolean) as Movie[];
  }, [linkedMovieIds, movies]);

  const openAdd = () => {
    setEditing(null);
    setDraft({
      label: "",
      emoji: "✨",
      description: "",
      color: GRADIENT_PRESETS[0],
      glowColor: "rgba(168,85,247,0.62)",
      bannerImage: "",
      linkedMovieIds: [],
      autoIncludeByTag: false,
      featured: false,
      visible: true,
      sortOrder: sortedMoods.length + 1,
    });
    setLinkedMovieIds([]);
    setMovieSearch("");
  };

  const openEdit = (mood: MoodCategory) => {
    setEditing(mood);
    setDraft({ ...mood });
    setLinkedMovieIds(mood.linkedMovieIds || []);
    setMovieSearch("");
  };

  const closeForm = () => {
    setEditing(null);
    setDraft(null);
    setLinkedMovieIds([]);
    setMovieSearch("");
  };

  const saveMood = () => {
    if (!draft?.label.trim()) {
      alert("Mood name is required.");
      return;
    }
    const moodId = editing?.id || uniqueMoodId(draft.label, moods);
    if (editing) {
      onUpdateMood(editing.id, { ...draft, linkedMovieIds, updatedAt: Date.now() });
      notify("Mood updated", `${draft.label} is live on the homepage.`);
    } else {
      onAddMood({ ...draft, id: moodId, linkedMovieIds });
      notify("Mood created", `${draft.label} now appears in Mood Discovery.`);
    }
    closeForm();
  };

  const toggleLinkedMovie = (movieId: string) => {
    setLinkedMovieIds(prev => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
  };

  const onDropLinkedMovie = (targetId: string) => {
    if (!linkedDragId || linkedDragId === targetId) return;
    setLinkedMovieIds(prev => {
      const from = prev.indexOf(linkedDragId);
      const to = prev.indexOf(targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setLinkedDragId(null);
  };

  const removeMood = (mood: MoodCategory) => {
    if (!confirm(`Delete mood "${mood.label}"? This removes the tag from linked movies.`)) return;
    onDeleteMood(mood.id);
    notify("Mood deleted", `${mood.label} was removed from Mood Discovery.`, "danger");
    if (editing?.id === mood.id) closeForm();
  };

  const onDropMood = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const ids = sortedMoods.map(m => m.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorderMoods(next);
    setDraggedId(null);
    notify("Mood order updated", "Homepage mood card order has been saved.", "info");
  };

  return (
    <div className="mt-8 glass-strong rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-fuchsia-200">
            <Sparkles className="h-3 w-3" /> Mood Discovery Manager
          </div>
          <h3 className="font-display text-2xl tracking-cinema text-white">MOOD DISCOVERY MANAGER</h3>
          <p className="mt-1 max-w-2xl text-sm text-white/50">
            Manage emotion categories, featured moods, icons, gradients, and mood-based curation.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" /> Add New Mood
        </button>
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] overflow-y-auto bg-black/80 p-3 backdrop-blur-xl md:p-6"
          >
            <button className="fixed inset-0 cursor-default" onClick={closeForm} aria-label="Close mood manager" />
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative mx-auto my-6 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#08060f] shadow-[0_50px_140px_-30px_rgba(168,85,247,0.65)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.28),transparent_70%)]" />
              <div className="relative flex items-start justify-between gap-4 border-b border-white/10 p-5 md:p-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-200/80">Manage Mood Collection</div>
                  <h3 className="mt-1 font-display text-3xl tracking-cinema text-white md:text-4xl">
                    {editing ? `EDIT ${editing.label}` : "ADD NEW MOOD"}
                  </h3>
                  <p className="mt-1 text-xs text-white/45">Curate mood details, manually selected movies, and optional tag automation.</p>
                </div>
                <button onClick={closeForm} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close mood manager">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative grid max-h-[calc(100vh-9rem)] gap-5 overflow-y-auto p-5 md:p-6 xl:grid-cols-[1fr_340px]">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-fuchsia-400/20 bg-black/30 p-4">
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-100">Mood Details</div>
                    <div className="grid gap-3 md:grid-cols-[1fr_90px_160px]">
                      <Field label="Mood Name">
                        <input value={draft.label} onChange={e => setDraft(d => d && ({ ...d, label: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60" placeholder="Comedy" />
                      </Field>
                      <Field label="Emoji/Icon">
                        <input value={draft.emoji} onChange={e => setDraft(d => d && ({ ...d, emoji: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60" placeholder="😂" />
                      </Field>
                      <Field label="Sort Order">
                        <input type="number" value={draft.sortOrder} onChange={e => setDraft(d => d && ({ ...d, sortOrder: Number(e.target.value) }))} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60" />
                      </Field>
                    </div>
                    <div className="mt-3">
                      <Field label="Short Description">
                        <textarea value={draft.description} onChange={e => setDraft(d => d && ({ ...d, description: e.target.value }))} rows={2} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60" placeholder="Light, clever, comfort-watch cinema." />
                      </Field>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <Field label="Gradient Color Theme">
                        <select value={draft.color} onChange={e => setDraft(d => d && ({ ...d, color: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60">
                          {GRADIENT_PRESETS.map(p => <option className="bg-[#0c0817]" key={p} value={p}>{p}</option>)}
                        </select>
                      </Field>
                      <Field label="Glow Color">
                        <input value={draft.glowColor} onChange={e => setDraft(d => d && ({ ...d, glowColor: e.target.value }))} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60" placeholder="rgba(168,85,247,0.62)" />
                      </Field>
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-4">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85">
                        <input type="checkbox" checked={draft.visible} onChange={e => setDraft(d => d && ({ ...d, visible: e.target.checked }))} className="accent-fuchsia-500" /> Visible ON/OFF
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85">
                        <input type="checkbox" checked={draft.featured} onChange={e => setDraft(d => d && ({ ...d, featured: e.target.checked }))} className="accent-fuchsia-500" /> Featured State
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85 md:col-span-2">
                        <input type="checkbox" checked={draft.autoIncludeByTag} onChange={e => setDraft(d => d && ({ ...d, autoIncludeByTag: e.target.checked }))} className="accent-fuchsia-500" /> Auto include movies by tag
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-100">Linked Movies Section</div>
                        <p className="mt-1 text-xs text-white/45">Search, select, remove, and drag curated movies into the order you want.</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50">
                        Manual picks: <span className="text-white">{linkedMovieIds.length}</span>
                      </div>
                    </div>

                    <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Curated Order</div>
                      {linkedMovies.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-white/40">No manually curated movies yet.</div>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {linkedMovies.map(movie => (
                            <div
                              key={movie.id}
                              draggable
                              onDragStart={() => setLinkedDragId(movie.id)}
                              onDragOver={e => e.preventDefault()}
                              onDrop={() => onDropLinkedMovie(movie.id)}
                              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
                            >
                              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/35" />
                              <img src={movie.poster} alt="" className="h-12 w-8 rounded-md object-cover" />
                              <div className="min-w-0 flex-1">
                                <div className="line-clamp-1 text-xs font-semibold text-white">{movie.title}</div>
                                <div className="text-[10px] text-white/40">{movie.year}</div>
                              </div>
                              <button onClick={() => toggleLinkedMovie(movie.id)} className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-200">Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input value={movieSearch} onChange={e => setMovieSearch(e.target.value)} placeholder="Search movie titles, genres, platforms..." className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-fuchsia-500/60" />
                    </div>

                    <div className="grid max-h-[360px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                      {searchableMovies.map(movie => {
                        const active = linkedMovieIds.includes(movie.id);
                        return (
                          <button
                            type="button"
                            key={movie.id}
                            onClick={() => toggleLinkedMovie(movie.id)}
                            className={"group flex items-center gap-2 rounded-xl border p-2 text-left transition " + (active ? "border-fuchsia-400/45 bg-fuchsia-500/12 shadow-[0_0_24px_-14px_rgba(217,70,239,0.8)]" : "border-white/10 bg-white/5 hover:bg-white/10")}
                          >
                            <input type="checkbox" checked={active} readOnly className="accent-fuchsia-500" />
                            <img src={movie.poster} alt="" className="h-14 w-10 rounded-md object-cover" />
                            <div className="min-w-0">
                              <div className="line-clamp-1 text-xs font-semibold text-white">{movie.title}</div>
                              <div className="text-[10px] text-white/45">{movie.year} • {movie.platforms.slice(0, 1).join("")}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={saveMood} className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-[0_15px_40px_-12px_rgba(168,85,247,0.8)]">{editing ? "Save Mood Collection" : "Create Mood"}</button>
                    <button onClick={closeForm} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/10">Cancel</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <ImageUpload label="Featured Banner Image" value={draft.bannerImage || ""} onChange={(v) => setDraft(d => d && ({ ...d, bannerImage: v }))} aspect="backdrop" hint="Optional" />
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className={"pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-30 blur-2xl " + draft.color} />
                    <div className="relative">
                      <div className="text-4xl">{draft.emoji}</div>
                      <div className="mt-3 text-lg font-bold text-white">{draft.label || "Mood Preview"}</div>
                      <p className="mt-1 line-clamp-3 text-xs text-white/50">{draft.description || "Your mood description will appear here."}</p>
                      <div className="mt-3 text-[10px] uppercase tracking-wider text-white/35">
                        {linkedMovieIds.length} manually curated • {draft.autoIncludeByTag ? "auto tags on" : "manual only"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3 lg:grid-cols-2">
        {sortedMoods.map(mood => {
          const count = getMoodMovieCount(mood, movies);
          return (
            <div
              key={mood.id}
              draggable
              onDragStart={() => setDraggedId(mood.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDropMood(mood.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-fuchsia-400/30 hover:bg-white/[0.055]"
            >
              {mood.bannerImage && <img src={mood.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-10 transition group-hover:opacity-15" />}
              <div className={"pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-30 blur-2xl " + mood.color} />
              <div className="relative flex items-center gap-3">
                <button className="cursor-grab rounded-lg border border-white/10 bg-black/25 p-2 text-white/40 active:cursor-grabbing" aria-label="Drag mood">
                  <GripVertical className="h-4 w-4" />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-2xl" style={{ boxShadow: `0 0 26px -8px ${mood.glowColor}` }}>
                  {mood.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-white">{mood.label}</div>
                    {!mood.visible && <MiniPill>Hidden</MiniPill>}
                    {mood.featured && <MiniPill>Featured</MiniPill>}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{mood.description}</p>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-white/35">{count} linked films • order {mood.sortOrder}</div>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  <button onClick={() => onUpdateMood(mood.id, { visible: !mood.visible })} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10">
                    {mood.visible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => openEdit(mood)} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10">Edit</button>
                  <button onClick={() => removeMood(mood)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-200 hover:bg-red-500/20">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const uniqueMoodId = (label: string, moods: MoodCategory[]) => {
  const base = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "mood";
  const existing = new Set(moods.map(m => m.id));
  if (!existing.has(base)) return base;
  let index = 2;
  while (existing.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
};

const CatalogTable: React.FC<{ movies: Movie[]; moodsCatalog: MoodCategory[]; onEdit: (m: Movie) => void; onDelete: (m: Movie) => void }> = ({ movies, moodsCatalog, onEdit, onDelete }) => {
  if (!movies.length) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-200 ring-1 ring-fuchsia-400/20">
          <Search className="h-5 w-5" />
        </div>
        <div className="text-sm font-semibold text-white">No catalog matches</div>
        <p className="mt-1 text-xs text-white/45">Try clearing search or filters, then add a new title.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_30px_90px_-40px_rgba(168,85,247,0.5)]">
      <div className="hidden grid-cols-[64px_minmax(220px,1.3fr)_80px_90px_minmax(160px,1fr)_minmax(170px,1fr)_130px] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white/45 md:grid">
        <div>Poster</div>
        <div>Title</div>
        <div>Year</div>
        <div>Rating</div>
        <div>Moods</div>
        <div>OTT Platforms</div>
        <div className="text-right">Actions</div>
      </div>
      <ul>
        {movies.map((m, i) => (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.25) }}
            className="grid grid-cols-[64px_1fr] gap-3 border-b border-white/5 px-4 py-4 transition hover:bg-white/[0.035] md:grid-cols-[64px_minmax(220px,1.3fr)_80px_90px_minmax(160px,1fr)_minmax(170px,1fr)_130px] md:items-center"
          >
            <div className="overflow-hidden rounded-lg border border-white/10 shadow-[0_10px_30px_-15px_rgba(168,85,247,0.6)]">
              <img src={m.poster} alt="" className="aspect-poster h-16 w-11 object-cover" />
            </div>
            <div className="min-w-0">
              <div className="line-clamp-1 text-sm font-semibold text-white">{m.title}</div>
              <div className="mt-0.5 line-clamp-1 text-[11px] text-white/45">
                {m.type} - {m.genres.slice(0, 3).join(", ")} {m.releaseDate ? `- ${m.releaseDate}` : ""}
              </div>
              <div className="mt-2 flex flex-wrap gap-1 md:hidden">
                <MoodPills moods={m.moods} moodsCatalog={moodsCatalog} />
                {m.platforms.slice(0, 3).map(p => <MiniPill key={p}>{p}</MiniPill>)}
              </div>
            </div>
            <div className="hidden text-xs text-white/70 md:block">{m.year}</div>
            <div className="hidden items-center gap-1 text-xs text-amber-200 md:flex">
              <Star className="h-3 w-3 fill-amber-300 stroke-amber-300" /> {m.rating.toFixed(1)}
            </div>
            <div className="hidden flex-wrap gap-1 md:flex"><MoodPills moods={m.moods} moodsCatalog={moodsCatalog} /></div>
            <div className="hidden flex-wrap gap-1 md:flex">
              {m.platforms.map(p => <MiniPill key={p}>{p}</MiniPill>)}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-1">
              <button onClick={() => onEdit(m)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => onDelete(m)} className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-200 hover:bg-red-500/20">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

const MovieEditorModal: React.FC<{
  open: boolean;
  initial: Movie | null;
  onClose: () => void;
  onSubmit: (data: Omit<Movie, "id" | "createdAt">) => void;
}> = ({ open, initial, onClose, onSubmit }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-3 backdrop-blur-xl md:p-6"
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 cursor-default"
          onClick={onClose}
          aria-label="Close editor backdrop"
        />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="relative mx-auto my-8 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#08060f] shadow-[0_50px_140px_-30px_rgba(168,85,247,0.65)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.28),transparent_70%)]" />
          <div className="relative flex items-start justify-between gap-4 border-b border-white/10 p-5 md:p-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-fuchsia-200/80">Studio Catalog Editor</div>
              <h2 className="mt-1 font-display text-3xl tracking-cinema text-white md:text-4xl">
                {initial ? "EDIT MOVIE" : "ADD MOVIE"}
              </h2>
              <p className="mt-1 text-xs text-white/45">Changes save to the shared movie store and update the public homepage instantly.</p>
            </div>
            <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close editor">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative max-h-[calc(100vh-9rem)] overflow-y-auto p-5 md:p-6">
            <MovieForm initial={initial} onCancel={onClose} onSubmit={onSubmit} />
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ToastViewport: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed right-4 top-24 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.96 }}
          className={
            "glass-strong rounded-2xl p-4 shadow-[0_25px_70px_-25px_rgba(168,85,247,0.65)] " +
            (toast.tone === "danger" ? "border-red-500/30" : toast.tone === "info" ? "border-blue-500/30" : "border-fuchsia-400/30")
          }
        >
          <div className="flex items-start gap-3">
            <div className={"mt-0.5 rounded-lg p-2 " + (toast.tone === "danger" ? "bg-red-500/15 text-red-200" : toast.tone === "info" ? "bg-blue-500/15 text-blue-200" : "bg-fuchsia-500/15 text-fuchsia-200")}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{toast.title}</div>
              {toast.detail && <p className="mt-0.5 text-xs text-white/55">{toast.detail}</p>}
            </div>
            <button onClick={() => onDismiss(toast.id)} className="text-white/35 hover:text-white" aria-label="Dismiss toast">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4"
  >
    <div className={"pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-30 blur-2xl " + color} />
    <div className={"inline-flex rounded-lg bg-gradient-to-br p-2 text-white " + color}>{icon}</div>
    <div className="mt-3 text-2xl font-bold text-white">{value}</div>
    <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
  </motion.div>
);

const ToggleSwitch: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    className={
      "relative h-6 w-11 rounded-full border transition " +
      (on ? "border-fuchsia-400/60 bg-gradient-to-r from-fuchsia-500 to-purple-600 shadow-[0_0_18px_-2px_rgba(168,85,247,0.7)]" : "border-white/10 bg-white/10")
    }
    aria-pressed={on}
  >
    <span
      className={
        "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition-all " +
        (on ? "left-[calc(100%-1.15rem)]" : "left-0.5")
      }
    />
  </button>
);

const MoodPills: React.FC<{ moods: string[]; moodsCatalog: MoodCategory[] }> = ({ moods, moodsCatalog }) => (
  <>
    {moods.slice(0, 4).map(id => {
      const mood = moodsCatalog.find(m => m.id === id);
      return <MiniPill key={id}>{mood ? `${mood.emoji} ${mood.label}` : id}</MiniPill>;
    })}
  </>
);

const MiniPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
    {children}
  </span>
);

const sectionLabel = (key: keyof ReturnType<typeof useMovies>["toggles"]) => {
  const labels: Record<string, string> = {
    weeklyReleases: "Weekly Releases",
    moodDiscovery: "Mood Discovery",
    trending: "Trending Movies",
    teluguPicks: "Telugu Picks",
  };
  return labels[key] || key;
};

export default StudioPage;