import { LogOut, Sparkles } from "lucide-react";
import { logout } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const LogoutButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {/* Background Sparkle Effect */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x: -30, y: -20 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute pointer-events-none text-yellow-400"
            >
              <Sparkles size={16} fill="currentColor" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 0.8, x: 35, y: 15 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute pointer-events-none text-orange-400"
            >
              <Sparkles size={20} fill="currentColor" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, x: 10, y: -30 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute pointer-events-none text-blue-400"
            >
              <Sparkles size={12} fill="currentColor" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={logout}
        whileHover={{
          scale: 1.05,
          backgroundColor: "#ef4444", // Solid red on hover
        }}
        whileTap={{ scale: 0.92 }}
        className="
          relative z-10 overflow-hidden
          flex items-center gap-3
          px-6 py-2.5 rounded-2xl
          bg-[var(--bg-main)] text-red-500
          border-2 border-red-500/20
          hover:text-white hover:border-red-500
          transition-colors duration-300
          text-xs font-black uppercase tracking-[0.2em]
          shadow-lg shadow-red-500/10
        "
      >
        {/* Sliding background overlay */}
        <motion.div
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute inset-0 bg-red-500 -z-10"
        />

        <motion.div
          animate={isHovered ? { rotate: -15, x: -2 } : { rotate: 0, x: 0 }}
        >
          <LogOut className="w-4 h-4 stroke-[3px]" />
        </motion.div>

        <span className="relative">Sign Out</span>

        {/* Inner Sparkle inside button */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -right-1 -top-1"
            >
              <Sparkles size={10} className="text-white fill-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default LogoutButton;
