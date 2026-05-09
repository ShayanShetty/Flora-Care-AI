import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import BottomNav from "@/components/bottom-nav";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async () => {
    if (!file || !token) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }
      setLocation(`/results/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-primary-foreground text-2xl font-bold">Scan Plant</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Upload a clear photo of the plant leaf</p>
        </motion.div>
      </div>

      <div className="px-5 mt-6 space-y-5">
        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragging ? "border-primary bg-primary/5" : "border-border bg-card"
          } ${preview ? "p-0 overflow-hidden" : "p-8"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <img src={preview} alt="Preview" className="w-full rounded-2xl max-h-72 object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-sm">Drop your image here</p>
                  <p className="text-muted-foreground text-xs mt-1">or tap to select from gallery</p>
                </div>
                <p className="text-muted-foreground text-xs">PNG, JPG, WEBP up to 20MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {/* Select button (when no preview) */}
        {!preview && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 rounded-2xl border-2 border-primary text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Choose Photo
          </motion.button>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl px-4 py-3"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Analyze button */}
        {preview && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-60 hover:opacity-95 active:opacity-90 transition-opacity"
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing plant...
              </>
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                Analyze Plant
              </>
            )}
          </motion.button>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-card-border rounded-2xl p-4 space-y-2"
        >
          <p className="font-semibold text-sm text-foreground mb-2">Tips for best results</p>
          {[
            "Use good natural lighting",
            "Focus on a single leaf",
            "Show both sides if possible",
            "Include visible symptoms clearly",
          ].map((tip) => (
            <p key={tip} className="text-muted-foreground text-xs flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {tip}
            </p>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
