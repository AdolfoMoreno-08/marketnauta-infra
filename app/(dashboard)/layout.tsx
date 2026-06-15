import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, BarChart3, Bot, Compass, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Dashboard | Marketnauta", template: "%s | Dashboard Marketnauta" },
  robots: { index: false, follow: false },
};

const NAV_LINKS = [
  { href: "/leads",     icon: Users,           label: "Leads & CRM" },
  { href: "/analytics", icon: BarChart3,        label: "Analytics" },
  { href: "/agents",    icon: Bot,              label: "Agentes IA" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-abisal-950 flex">
      {/* SIDEBAR */}
      <aside className="w-[220px] flex-shrink-0 border-r border-white/[0.05] bg-abisal-950 flex flex-col">
        {/* LOGO */}
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <Link href="/" className="flex items-center gap-2 group">
            <Compass className="w-5 h-5 text-marketnauta-primary group-hover:rotate-45 transition-transform duration-300" />
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Marketnauta</p>
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Control Hub</p>
            </div>
          </Link>
        </div>

        {/* NAV */}
        <nav className="flex-grow px-3 py-4 space-y-0.5">
          <Link
            href="/overview"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm group"
          >
            <LayoutDashboard className="w-4 h-4 group-hover:text-marketnauta-primary transition-colors" />
            Overview
          </Link>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm group"
              >
                <Icon className="w-4 h-4 group-hover:text-marketnauta-primary transition-colors" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/[0.05]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Ver sitio público
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-grow overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
