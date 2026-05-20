import { useState } from "react";
import { Search, Bell, ChevronDown, RefreshCw } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="h-[64px] flex-shrink-0 flex items-center gap-4 px-6 bg-white/80 backdrop-blur-md border-b border-black/[0.06] z-30">
      {/* Title */}
      <div className="flex-shrink-0 min-w-[160px]">
        <h1 className="text-[16px] font-semibold text-[#1C1A16] leading-none">{title}</h1>
        {subtitle && <p className="text-[11px] text-[#6B6966] mt-0.5 truncate max-w-[220px]">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className={`flex-1 max-w-[480px] relative flex items-center rounded-xl border transition-all duration-200 bg-[#F4F3EF] ${
        searchFocused ? "border-[#1A6B5E] ring-2 ring-[#1A6B5E]/10" : "border-black/[0.08]"
      }`}>
        <Search className="w-4 h-4 text-[#6B6966] absolute left-3" />
        <input
          className="w-full bg-transparent pl-9 pr-4 py-2 text-[13px] text-[#1C1A16] placeholder:text-[#6B6966] outline-none"
          placeholder="Rechercher document, NIF, RC, fournisseur…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        {/* Month selector */}
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#1C1A16] bg-[#F4F3EF] border border-black/[0.08] rounded-lg px-3 py-1.5 hover:bg-black/[0.04] transition-colors">
          Mai 2026
          <ChevronDown className="w-3.5 h-3.5 text-[#6B6966]" />
        </button>

        {/* Sync status */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#6B6966] bg-[#F4F3EF] border border-black/[0.06] rounded-lg px-2.5 py-1.5">
          <RefreshCw className="w-3 h-3" />
          Synchro il y a 2 min
        </div>

        {/* Bell */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors">
          <Bell className="w-4 h-4 text-[#6B6966]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#1A6B5E] flex items-center justify-center text-white text-[11px] font-bold cursor-pointer">
          EA
        </div>
      </div>
    </div>
  );
}
