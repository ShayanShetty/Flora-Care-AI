import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Calendar, ArrowLeft, Download, History, Loader2 } from "lucide-react";
import { useGetScan } from "@workspace/api-client-react";
import BottomNav from "@/components/bottom-nav";

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.8 ? "bg-primary" : value >= 0.6 ? "bg-amber-500" : "bg-destructive";
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">Confidence</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg font-bold text-foreground"
        >
          {pct}%
        </motion.span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function Results() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: scan, isLoading } = useGetScan(params.id, { query: { enabled: !!params.id, queryKey: ["scan", params.id] } });

  const handleDownload = () => {
    if (!scan) return;
    const report = [
      `FloraCare Plant Health Report`,
      `Date: ${new Date(scan.scannedAt).toLocaleString()}`,
      ``,
      `Plant: ${scan.plantName}`,
      `Diagnosis: ${scan.diseaseName}`,
      `Confidence: ${Math.round(scan.confidence * 100)}%`,
      `Status: ${scan.isHealthy ? "Healthy" : "Disease Detected"}`,
      ``,
      `Description: ${scan.description}`,
      scan.symptoms ? `Symptoms: ${scan.symptoms}` : "",
      scan.treatment ? `Treatment: ${scan.treatment}` : "",
      scan.prevention ? `Prevention: ${scan.prevention}` : "",
    ].filter(Boolean).join("\n");
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `floracare-report-${scan.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="text-center">
          <p className="text-foreground font-semibold mb-2">Scan not found</p>
          <button onClick={() => setLocation("/history")} className="text-primary text-sm underline">
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const scanDate = new Date(scan.scannedAt);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-primary-foreground text-xl font-bold">Scan Result</h1>
          <p className="text-primary-foreground/70 text-xs mt-0.5">AI Plant Analysis</p>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Image + badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="relative">
            <img src={scan.imageUrl} alt={scan.plantName} className="w-full h-52 object-cover" />
            <div className="absolute top-3 left-3">
              {scan.isHealthy ? (
                <span className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Healthy Plant
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Disease Detected
                </span>
              )}
            </div>
          </div>
          <div className="p-5">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{scan.plantName}</p>
            <h2 className="text-foreground text-xl font-bold leading-tight mb-1">{scan.diseaseName}</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
              <Calendar className="w-3.5 h-3.5" />
              {scanDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {" · "}
              {scanDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <ConfidenceBar value={scan.confidence} />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-2">About this condition</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{scan.description}</p>
        </motion.div>

        {/* Symptoms */}
        {scan.symptoms && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-2">Symptoms</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{scan.symptoms}</p>
          </motion.div>
        )}

        {/* Treatment */}
        {scan.treatment && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-card-border rounded-2xl p-5 shadow-sm border-l-4 border-l-primary"
          >
            <h3 className="font-semibold text-foreground mb-2">Treatment</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{scan.treatment}</p>
          </motion.div>
        )}

        {/* Prevention */}
        {scan.prevention && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-2">Prevention</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{scan.prevention}</p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={handleDownload}
            className="py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button
            onClick={() => setLocation("/history")}
            className="py-3.5 rounded-2xl border-2 border-primary text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
