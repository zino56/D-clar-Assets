import { Link, useRoute } from "wouter";
import { Inbox, CheckSquare, MessageSquare, Download, Cpu, Users, HelpCircle, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/app/inbox",     label: "Inbox",       icon: Inbox },
  { href: "/app/readiness", label: "Readiness",   icon: CheckSquare },
  { href: "/app/followups", label: "Follow-ups",  icon: MessageSquare },
  { href: "/app/exports",   label: "Exports",     icon: Download },
  { href: "/app/jobs",      label: "Jobs",        icon: Cpu },
  { href: "/app/agents",    label: "Agents",      icon: Users },
];

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const [active] = useRoute(href);
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group ${
        active
          ? "bg-[#1A6B5E]/10 text-[#1A6B5E]"
          : "text-[#6B6966] hover:bg-black/[0.04] hover:text-[#1C1A16]"
      }`}>
        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#1A6B5E]" : ""}`} strokeWidth={active ? 2.5 : 2} />
        <span className={`text-[14px] ${active ? "font-semibold text-[#1A6B5E]" : "font-medium"}`}>{label}</span>
        {active && <ChevronRight className="w-3 h-3 ml-auto text-[#1A6B5E] opacity-60" />}
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <div className="w-[260px] flex-shrink-0 h-full flex flex-col bg-white border-r border-black/[0.06] overflow-hidden">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#141210] flex items-center justify-center text-white text-[11px] font-bold tracking-tight flex-shrink-0">
            DC
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#1C1A16] truncate">Déclaration Copilot</div>
            <div className="text-[11px] text-[#6B6966] truncate">Cabinet El Amel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-black/[0.06] pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/[0.03] cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-[#1A6B5E] flex items-center justify-center text-white text-[10px] font-bold">
            EA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#1C1A16] truncate">El Amel</div>
            <div className="text-[10px] text-[#6B6966]">Comptable principal</div>
          </div>
          <span className="text-[10px] bg-[#1A6B5E] text-white px-1.5 py-0.5 rounded font-bold">Pro</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#6B6966] hover:bg-black/[0.03] hover:text-[#1C1A16] transition-colors w-full">
          <HelpCircle className="w-4 h-4" />
          <span className="text-[13px] font-medium">Besoin d'aide ?</span>
        </button>
      </div>
    </div>
  );
}
