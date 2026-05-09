import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Leaf, AlertTriangle, CheckCircle2, Camera, ChevronRight } from "lucide-react";
import { useGetScanStats, useGetMe } from "@workspace/api-client-react";
import { useAuthStore } from "@/lib/auth";
import BottomNav from "@/components/bottom-nav";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: me } = useGetMe();
  const { data: stats } = useGetScanStats();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary-foreground/70 text-sm font-medium mb-1">
            Good day{me ? `, ${me.username}` : ""}
          </p>
          <h1 className="text-primary-foreground text-2xl font-bold leading-tight">
            AI-Powered Plant Health
          </h1>
          <p className="text-primary-foreground/70 text-sm mt-2">
            Disease detection in seconds
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-4">
        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: "Total Scans", value: stats?.totalScans ?? 0, color: "bg-primary/10 text-primary" },
            { label: "Diseased", value: stats?.diseasedScans ?? 0, color: "bg-destructive/10 text-destructive" },
            { label: "Healthy", value: stats?.healthyScans ?? 0, color: "bg-green-100 text-green-700" },
          ].map((s) => (
            <motion.div key={s.label} variants={item} className="bg-card border border-card-border rounded-2xl p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={item}
          initial="hidden"
          animate="show"
          onClick={() => setLocation("/upload")}
          className="w-full bg-primary text-primary-foreground rounded-2xl p-5 flex items-center justify-between shadow-md mb-6 hover:opacity-95 active:opacity-90 transition-opacity"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Scan a Plant</p>
              <p className="text-primary-foreground/70 text-xs">Upload a leaf photo for analysis</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-primary-foreground/70" />
        </motion.button>

        {/* Features */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: ShieldCheck, title: "Trusted Accuracy", desc: "AI trained on thousands of plant images", color: "text-primary" },
            { icon: Zap, title: "Instant Analysis", desc: "Results in under 10 seconds", color: "text-amber-600" },
          ].map((f) => (
            <motion.div key={f.title} variants={item} className="bg-card border border-card-border rounded-2xl p-4 shadow-sm">
              <f.icon className={`w-6 h-6 ${f.color} mb-3`} />
              <p className="font-semibold text-sm text-foreground">{f.title}</p>
              <p className="text-muted-foreground text-xs mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent scans */}
        {stats && stats.recentScans.length > 0 && (
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Recent Scans</h2>
              <button onClick={() => setLocation("/history")} className="text-primary text-sm font-medium hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {stats.recentScans.slice(0, 3).map((scan) => (
                <motion.div
                  key={scan.id}
                  variants={item}
                  onClick={() => setLocation(`/results/${scan.id}`)}
                  className="bg-card border border-card-border rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={scan.imageUrl} alt={scan.plantName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{scan.plantName}</p>
                    <p className="text-muted-foreground text-xs truncate">{scan.diseaseName}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {scan.isHealthy
                      ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                      : <AlertTriangle className="w-5 h-5 text-destructive" />
                    }
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {stats && stats.totalScans === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <Leaf className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No scans yet. Upload a plant image to get started.</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
