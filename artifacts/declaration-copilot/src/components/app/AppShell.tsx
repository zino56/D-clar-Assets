import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AgentPanel } from "./AgentPanel";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  hideAgentPanel?: boolean;
}

export function AppShell({ children, title, subtitle, hideAgentPanel = false }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-[#F4F3EF] overflow-hidden font-sans text-[#1C1A16]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile menu button injected into topbar */}
        <div className="relative">
          <Topbar title={title} subtitle={subtitle} />
          <button
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/[0.04]"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-4 h-4 text-[#6B6966]" />
          </button>
        </div>

        {/* Content */}
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Agent panel — desktop only */}
      {!hideAgentPanel && (
        <div className="hidden xl:flex">
          <AgentPanel />
        </div>
      )}
    </div>
  );
}
