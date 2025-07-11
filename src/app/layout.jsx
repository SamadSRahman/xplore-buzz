'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import Navbar from '@/src/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>BUZZ - Video Annotation & Survey Tool</title>
        <meta name="description" content="Professional video annotation and survey platform" />
      </head>
      <body className={inter.className}>
       
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="pt-16"
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <Toaster richColors position="top-right" />
          </div>
      </body>
    </html>
  );
}