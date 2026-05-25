import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

type Props = {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  aspect?: "poster" | "backdrop";
  hint?: string;
};

const accept = "image/jpeg,image/png,image/webp";

const ImageUpload: React.FC<Props> = ({ label, value, onChange, aspect = "poster", hint }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/jpeg|png|webp/)) {
      alert("Only JPG, PNG, WEBP are supported.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Max 4MB image size.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  }, [onChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/55">{label}</label>
        {hint && <span className="text-[10px] text-white/35">{hint}</span>}
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition " +
          (dragging
            ? "border-fuchsia-400 bg-fuchsia-500/10"
            : "border-white/15 bg-white/[0.03] hover:border-white/25") +
          " " +
          (aspect === "poster" ? "aspect-poster" : "aspect-backdrop")
        }
      >
        <AnimatePresence>
          {value && (
            <motion.img
              key={value.slice(0, 40)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              src={value}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>

        {!value && !loading && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white/55"
          >
            <ImageIcon className="h-8 w-8 text-fuchsia-300/70" />
            <div className="text-sm">
              <span className="text-white">Drop image</span> or
              <span className="ml-1 text-fuchsia-300 underline">browse</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/35">JPG • PNG • WEBP</div>
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur">
            <Loader2 className="h-8 w-8 animate-spin text-fuchsia-300" />
          </div>
        )}

        {value && !loading && (
          <>
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white ring-1 ring-white/20 hover:bg-black/90"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/90"
            >
              <Upload className="h-3.5 w-3.5" /> Replace
            </button>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
