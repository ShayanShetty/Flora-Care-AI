import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Leaf, Loader2 } from "lucide-react";
import { useListScans } from "@workspace/api-client-react";
import BottomNav from "@/components/bottom-nav";

export default function History() {
  const [, setLocation] = useLocation();
  const { data: scans, isLoading } = useListScans();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-primary-foreground text-2xl font-bold">Scan History</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Your previous plant analyses</p>
        </motion.div>
      </div>

      <div className="px-5 mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !scans || scans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Leaf className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-1">No scans yet</p>
            <p className="text-muted-foreground text-sm mb-5">Upload a plant image to get started</p>
            <button
              onClick={() => setLocation("/upload")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity"
            >
              Scan a Plant
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {scans.map((scan, idx) => {
              const date = new Date(scan.scannedAt);
              const pct = Math.round(scan.confidence * 100);
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setLocation(`/results/${scan.id}`)}
                  className="bg-card border border-card-border rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={scan.imageUrl} alt={scan.plantName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-foreground truncate">{scan.plantName}</p>
                      {scan.isHealthy
                        ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        : <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                      }
                    </div>
                    <p className="text-muted-foreground text-xs truncate mb-2">{scan.diseaseName}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${scan.isHealthy ? "bg-green-600" : pct >= 80 ? "bg-primary" : "bg-amber-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                      <Clock className="w-3 h-3" />
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" · "}
                      {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
