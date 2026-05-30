import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import type { Movie } from "../types";
import { GENRES, PLATFORMS } from "../types";
import { useMovies } from "../context/MoviesContext";
import ImageUpload from "./ImageUpload";
import { formatRuntime, formatReleaseDate } from "../utils/runtime";

type Props = {
  initial?: Movie | null;
  onCancel: () => void;
  onSubmit: (data: Omit<Movie, "id" | "createdAt">) => void;
};

const empty: Omit<Movie, "id" | "createdAt"> = {
  title: "",
  description: "",
  rating: 7.5,
  year: new Date().getFullYear(),
  releaseDate: new Date().toISOString().slice(0, 10),
  runtime: 120,
  genres: [],
  moods: [],
  platforms: [],
  trailerUrl: "",
  poster: "",
  backdrop: "",
  type: "Movie",
  language: "",
  isTelugu: false,
  isTeluguPick: false,
  isTrending: false,
  isWeeklyRelease: false,
  isHeroFeatured: false,
};

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "rounded-full px-3 py-1 text-xs font-semibold transition " +
      (active
        ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-[0_5px_20px_-5px_rgba(168,85,247,0.7)]"
        : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10")
    }
  >
    {children}
  </button>
);

const MovieForm: React.FC<Props> = ({ initial, onCancel, onSubmit }) => {
  const { moods } = useMovies();
  const [data, setData] = useState<Omit<Movie, "id" | "createdAt">>(empty);

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _c, ...rest } = initial;
      setData(rest);
    } else {
      setData(empty);
    }
  }, [initial]);

  const toggleInArr = (key: "genres" | "moods" | "platforms", value: string) => {
    setData(d => {
      const arr = d[key];
      return { ...d, [key]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title.trim()) { alert("Title is required."); return; }
    if (!data.poster) { alert("Poster image is required."); return; }
    onSubmit({
      ...data,
      backdrop: data.backdrop || data.poster,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="grid gap-6 lg:grid-cols-[300px_1fr]"
    >
      <div className="space-y-4">
        <ImageUpload
          label="Poster Upload"
          value={data.poster}
          onChange={(v) => setData(d => ({ ...d, poster: v }))}
          aspect="poster"
          hint="Required"
          movieId={initial?.id}
        />
        <ImageUpload
          label="Backdrop Upload"
          value={data.backdrop}
          onChange={(v) => setData(d => ({ ...d, backdrop: v }))}
          aspect="backdrop"
          hint="Optional"
          movieId={initial?.id}
        />
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Movie Title">
            <input
              value={data.title}
              onChange={e => setData(d => ({ ...d, title: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
              placeholder="e.g. Hi Nanna"
            />
          </Field>
          <Field label="Type">
            <select
              value={data.type}
              onChange={e => setData(d => ({ ...d, type: e.target.value as "Movie" | "Series" }))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
            >
              <option className="bg-[#0c0817]">Movie</option>
              <option className="bg-[#0c0817]">Series</option>
            </select>
          </Field>
        </div>

        <Field label="Overview">
          <textarea
            value={data.description}
            onChange={e => setData(d => ({ ...d, description: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
            placeholder="A short cinematic synopsis..."
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Rating">
            <input
              type="number" step="0.1" min={0} max={10}
              value={data.rating}
              onChange={e => setData(d => ({ ...d, rating: Number(e.target.value) }))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
            />
          </Field>
          <Field label="Year">
            <input
              type="number" min={1900} max={2100}
              value={data.year}
              onChange={e => setData(d => ({ ...d, year: Number(e.target.value) }))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
            />
          </Field>
          <Field label="Runtime">
            <div>
              <input
                type="number" min={1}
                value={data.runtime}
                onChange={e => setData(d => ({ ...d, runtime: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/45">
                <span>Enter total runtime in minutes. Example: 150 = 2h 30m</span>
                <span className="font-semibold text-fuchsia-300">Preview: {formatRuntime(data.runtime)}</span>
              </div>
            </div>
          </Field>
          <Field label="Release Date">
            <div>
              <input
                type="date"
                value={data.releaseDate || ""}
                onChange={e => setData(d => ({ ...d, releaseDate: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/45">
                <span>Date will be stored as YYYY-MM-DD</span>
                <span className="font-semibold text-fuchsia-300">Preview: {data.releaseDate ? formatReleaseDate(data.releaseDate) : "No date selected"}</span>
              </div>
            </div>
          </Field>
          <Field label="Language">
            <input
              value={data.language || ""}
              onChange={e => setData(d => ({ ...d, language: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
              placeholder="e.g. Telugu"
            />
          </Field>
        </div>

        <Field label="Trailer URL (YouTube)">
          <input
            value={data.trailerUrl}
            onChange={e => setData(d => ({ ...d, trailerUrl: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500/60"
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>

        <Field label="Genres">
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <Chip key={g} active={data.genres.includes(g)} onClick={() => toggleInArr("genres", g)}>{g}</Chip>
            ))}
          </div>
        </Field>

        <Field label="Moods">
          <div className="flex flex-wrap gap-2">
            {[...moods].sort((a, b) => a.sortOrder - b.sortOrder).map(m => (
              <Chip key={m.id} active={data.moods.includes(m.id)} onClick={() => toggleInArr("moods", m.id)}>
                {m.emoji} {m.label}{!m.visible ? " (hidden)" : ""}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="OTT Platforms">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <Chip key={p} active={data.platforms.includes(p)} onClick={() => toggleInArr("platforms", p)}>{p}</Chip>
            ))}
          </div>
        </Field>

        <Field label="Editorial Flags">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { key: "isTrending", label: "Add to Trending Movies" },
              { key: "isTeluguPick", label: "Add to Curated Telugu Picks" },
              { key: "isWeeklyRelease", label: "Mark as This Week's OTT Release" },
              { key: "isHeroFeatured", label: "Feature in Hero Banner" },
            ].map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={Boolean((data as any)[key])}
                  onChange={e => setData(d => ({ ...d, [key]: e.target.checked }))}
                  className="accent-fuchsia-500"
                />
                <span className="text-white/85">{label}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02]">
            <Save className="h-4 w-4" /> {initial ? "Save Changes" : "Add to Catalog"}
          </button>
          <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10">
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      </div>
    </motion.form>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/55">{label}</div>
    {children}
  </div>
);

export default MovieForm;
