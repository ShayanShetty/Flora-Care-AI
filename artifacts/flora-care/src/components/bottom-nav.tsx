import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LayoutDashboard, Camera, Clock, BookOpen } from "lucide-react";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/upload", icon: Camera, label: "Upload" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/diseases", icon: BookOpen, label: "Diseases" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around px-2 pb-safe">
        {tabs.map((tab) => {
          const active = location === tab.path || location.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="flex flex-col items-center gap-1 py-3 px-4 relative flex-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
