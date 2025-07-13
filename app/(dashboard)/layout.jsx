"use client";

import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen`}>
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    );
  }

  return (
    <div className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen`}>
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex-1 overflow-y-auto p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}