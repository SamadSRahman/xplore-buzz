// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Menu, X, User, LogOut, Upload, Home } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import useAuth from '@/hooks/useAuth'

// const BuzzLogo = () => (
//   <div className="flex items-center space-x-2">
//     <div className="w-8 h-8 rounded-full bg-buzz-gradient flex items-center justify-center">
//       <span className="text-white font-bold text-sm">B</span>
//     </div>
//     <span className="text-2xl font-bold bg-buzz-gradient bg-clip-text text-transparent">
//       BUZZ
//     </span>
//   </div>
// );

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();
//   const user = localStorage.getItem('user')
//   const {logout} = useAuth();
//   const navigation = [
//     { name: 'Home', href: '/', icon: Home },
//     { name: 'Upload', href: '/upload', icon: Upload, requireAuth: true },
//   ];

//   const isActive = (href) => pathname === href;

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <BuzzLogo />
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navigation.map((item) => {
           
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`relative px-3 py-2 rounded-lg transition-colors ${
//                     isActive(item.href)
//                       ? 'text-purple-600 bg-purple-50'
//                       : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="flex items-center space-x-1">
//                     <item.icon className="w-4 h-4" />
//                     <span>{item.name}</span>
//                   </span>
//                   {isActive(item.href) && (
//                     <motion.div
//                       layoutId="activeTab"
//                       className="absolute inset-0 bg-purple-100 rounded-lg -z-10"
//                       transition={{ type: 'spring', duration: 0.5 }}
//                     />
//                   )}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Auth Section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="flex items-center space-x-2">
//                     <User className="w-4 h-4" />
//                     <span>{user.email}</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem asChild>
//                     <Link href="/profile">Profile</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={logout}>
//                     <LogOut className="w-4 h-4 mr-2" />
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link href="/login">
//                   <Button variant="ghost">Sign In</Button>
//                 </Link>
//                 <Link href="/register">
//                   <Button className="bg-purple-gradient text-white">Sign Up</Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden py-4 border-t"
//           >
//             <div className="space-y-2">
//               {navigation.map((item) => {
//                 if (item.requireAuth && !user) return null;
//                 return (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     onClick={() => setIsOpen(false)}
//                     className={`block px-3 py-2 rounded-lg transition-colors ${
//                       isActive(item.href)
//                         ? 'text-purple-600 bg-purple-50'
//                         : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     <span className="flex items-center space-x-2">
//                       <item.icon className="w-4 h-4" />
//                       <span>{item.name}</span>
//                     </span>
//                   </Link>
//                 );
//               })}
//               {user ? (
//                 <>
//                   <Link
//                     href="/profile"
//                     onClick={() => setIsOpen(false)}
//                     className="block px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
//                   >
//                     <span className="flex items-center space-x-2">
//                       <User className="w-4 h-4" />
//                       <span>Profile</span>
//                     </span>
//                   </Link>
//                   <button
//                     onClick={() => {
//                       signOut();
//                       setIsOpen(false);
//                     }}
//                     className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
//                   >
//                     <span className="flex items-center space-x-2">
//                       <LogOut className="w-4 h-4" />
//                       <span>Sign Out</span>
//                     </span>
//                   </button>
//                 </>
//               ) : (
//                 <div className="space-y-2 pt-2 border-t">
//                   <Link
//                     href="/login"
//                     onClick={() => setIsOpen(false)}
//                     className="block px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/register"
//                     onClick={() => setIsOpen(false)}
//                     className="block px-3 py-2 rounded-lg bg-purple-gradient text-white text-center"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.nav>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Upload, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuth from '@/hooks/useAuth';

const BuzzLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full bg-buzz-gradient flex items-center justify-center">
      <span className="text-white font-bold text-sm">B</span>
    </div>
    <span className="text-2xl font-bold bg-buzz-gradient bg-clip-text text-transparent">
      BUZZ
    </span>
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload, requireAuth: true },
  ];

  const isActive = (href) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BuzzLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.requireAuth && !user) return null;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-purple-100 rounded-lg -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.email || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-purple-gradient text-white">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.requireAuth && !user) return null;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    <span className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    <span className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2 border-t">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-purple-gradient text-white text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}