"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { Badge } from "@/components/ui/Badge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Incidents", href: "/dashboard/incidents", icon: "warning" },
  { name: "Integrations", href: "/dashboard/integrations", icon: "link" },
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-700 bg-surface-dark">
      <div className="flex h-16 items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-white text-lg">✈</span>
          </div>
          <span className="text-xl font-semibold text-white">SRE Agent</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="default" className="text-xs">
                On-Call
              </Badge>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-sm">
            expand_more
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-lg align-middle mr-2">logout</span>
          Log out
        </button>
      </div>
    </div>
  );
}

