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
    <div className="flex h-16 items-center justify-between border-b border-slate-700 bg-surface-dark px-6">
      <div>
        <h1 className="text-xl font-semibold text-white">
          Good {getGreeting()}, {userName}
        </h1>
        <p className="text-sm text-slate-400">Here&apos;s what&apos;s happening today</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <select className="h-9 rounded-lg bg-surface-dark border border-slate-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-700 bg-surface-dark px-3 text-sm text-slate-400 hover:border-slate-600 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          <span>Search incidents...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </button>
        <button className="relative h-9 w-9 rounded-lg border border-slate-700 bg-surface-dark flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-severity-p1 rounded-full"></span>
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

