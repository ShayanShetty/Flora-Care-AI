import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Leaf, Loader2 } from "lucide-react";
import { useListDiseases, getListDiseasesQueryKey } from "@workspace/api-client-react";
import BottomNav from "@/components/bottom-nav";

export default function Diseases() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: diseases, isLoading } = useListDiseases(
    { search: search || undefined },
    { query: { queryKey: getListDiseasesQueryKey({ search: search || undefined }) } }
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-primary-foreground text-2xl font-bold">Disease Encyclopedia</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Learn about plant diseases and treatments</p>
        </motion.div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search plants or diseases..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setExpandedId(null); }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
          />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !diseases || diseases.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Leaf className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">No results found</p>
            <p className="text-muted-foreground text-sm">Try a different search term</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {diseases.map((disease, idx) => {
              const isExpanded = expandedId === disease.id;
              return (
                <motion.div
                  key={disease.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-card border border-card-border rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : disease.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1.5">
                        {disease.plantName}
                      </span>
                      <p className="font-semibold text-sm text-foreground">{disease.diseaseName}</p>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    }
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-foreground leading-relaxed">{disease.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Symptoms</p>
                            <p className="text-sm text-foreground leading-relaxed">{disease.symptoms}</p>
                          </div>
                          <div className="bg-primary/5 rounded-xl p-3">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Treatment</p>
                            <p className="text-sm text-foreground leading-relaxed">{disease.treatment}</p>
                          </div>
                          <div className="bg-muted rounded-xl p-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Prevention</p>
                            <p className="text-sm text-foreground leading-relaxed">{disease.prevention}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
