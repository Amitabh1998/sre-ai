"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { SearchModal } from "@/components/ui/SearchModal";
import { useAuthStore } from "@/lib/store/auth";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userName = user?.name?.split(" ")[0] || "Engineer";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-16 items-center justify-between border-b border-white/10 bg-surface-dark/50 backdrop-blur-sm px-6">
      <div>
        <h1 className="text-lg font-semibold text-white">
          Good {getGreeting()}, {userName}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Here&apos;s what&apos;s happening today</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <select className="h-10 rounded-lg bg-white/5 border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:border-white/20">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/10 transition-all"
        >
          <span className="material-symbols-outlined text-base">search</span>
          <span className="hidden sm:inline">Search incidents...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </button>
        <button className="relative h-10 w-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all">
          <span className="material-symbols-outlined text-base">notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 bg-severity-p1 rounded-full ring-2 ring-surface-dark"></span>
        </button>
      </div>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

