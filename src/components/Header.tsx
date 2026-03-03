import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { TrendingUp, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { signOut } = useAuthActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d0d14]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">CoachMetrics</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-white font-medium text-sm hover:text-amber-400 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
              Analytics
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
              Reports
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
              Settings
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button
              onClick={() => signOut()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 py-4"
          >
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-white font-medium text-sm py-2 px-3 bg-white/5 rounded-lg">
                Dashboard
              </a>
              <a href="#" className="text-gray-400 text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors">
                Analytics
              </a>
              <a href="#" className="text-gray-400 text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors">
                Reports
              </a>
              <a href="#" className="text-gray-400 text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors">
                Settings
              </a>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-rose-400 text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors mt-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
