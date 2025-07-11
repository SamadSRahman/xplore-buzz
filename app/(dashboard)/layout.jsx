// "use client";

// import { Inter } from "next/font/google";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import { Toaster } from "sonner";

// const inter = Inter({ subsets: ["latin"] });

// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   in: { opacity: 1, y: 0 },
//   out: { opacity: 0, y: -20 },
// };

// const pageTransition = {
//   type: "tween",
//   ease: "anticipate",
//   duration: 0.5,
// };

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();

//   return (
//     <html lang="en">
//       <body
//         className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100`}
//       >
//         <Navbar />
//         <div className="flex flex-1 h-[calc(100vh-4rem)]">
//           {" "}
//           {/* minus navbar height */}
//           <Sidebar />
//           <AnimatePresence mode="wait" initial={false}>
//             <motion.main
//               key={pathname}
//               initial="initial"
//               animate="in"
//               exit="out"
//               variants={pageVariants}
//               transition={pageTransition}
//               className="flex-1 overflow-y-auto p-6 scrollbar-hide"
//             >
//               {children}
//             </motion.main>
//           </AnimatePresence>
//         </div>
//         <Toaster richColors position="top-right" />
//       </body>
//     </html>
//   );
// }


"use client";

import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

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
