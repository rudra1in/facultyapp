import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Bug,
  Lightbulb,
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";

const FeedbackWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Suggestion");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setShowSuccess(true);
    setMessage("");
    setTimeout(() => {
      setShowSuccess(false);
      setOpen(false);
    }, 2000);
  };

  const categories = [
    {
      name: "Suggestion",
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      name: "Bug Report",
      icon: Bug,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      name: "Praise",
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <>
      {/* SUPER ANIMATED STAR FLOATING BUTTON */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-[var(--accent)] text-white p-4 md:px-6 md:py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 group"
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center justify-center h-6 w-6">
          {/* Constellation Glow Effect */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 90, 0],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-[-10px] bg-white rounded-full blur-xl opacity-30"
          />

          {/* Individual Sparkle Particles */}
          {[0, 72, 144, 216, 288].map((degree, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                rotate: [degree, degree + 360],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <Sparkles
                size={10}
                className="text-white fill-white translate-x-5"
              />
            </motion.div>
          ))}

          {/* Main Animated Star */}
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Star
              className="w-6 h-6 fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              strokeWidth={2}
            />
          </motion.div>
        </div>

        <span className="font-black text-[10px] uppercase tracking-[0.25em] hidden md:block ml-1">
          Share Sparkle
        </span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xl flex items-end md:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSending && setOpen(false)}
          >
            <motion.div
              className="bg-[var(--bg-card)] w-full max-w-md rounded-[3rem] shadow-2xl p-1 border border-[var(--border-main)] overflow-hidden relative"
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {!showSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[var(--accent)] rounded-2xl shadow-[0_0_20px_var(--accent)] opacity-90">
                            <Star className="text-white fill-white w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tighter leading-tight">
                              Send Us Your <br />
                              <span className="text-[var(--accent)]">
                                Sparkle
                              </span>
                            </h3>
                            <p className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">
                              Protocol: Creative Input
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setOpen(false)}
                          className="p-2 rounded-xl hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-red-500 transition-all"
                        >
                          <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                      </div>

                      {/* Category Selector */}
                      <div className="bg-[var(--bg-main)] p-1.5 rounded-3xl border border-[var(--border-main)] flex gap-1 mb-6">
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => setCategory(cat.name)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                              category === cat.name
                                ? "bg-[var(--bg-card)] text-[var(--text-main)] shadow-xl border border-[var(--border-main)]"
                                : "text-[var(--text-muted)] hover:opacity-70"
                            }`}
                          >
                            <cat.icon
                              className={`w-3 h-3 ${cat.color}`}
                              strokeWidth={3}
                            />
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      {/* Input Area */}
                      <div className="relative group">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={`Share your ${category.toLowerCase()} here...`}
                          className="w-full h-44 p-6 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[2rem] text-[var(--text-main)] placeholder-[var(--text-muted)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/5 focus:border-[var(--accent)] transition-all resize-none font-bold text-sm leading-relaxed"
                        />
                        <div className="absolute bottom-4 right-6 flex items-center gap-1.5 text-[var(--text-muted)] opacity-30 text-[9px] font-black">
                          <ShieldCheck size={12} /> SECURE CHANNEL
                        </div>
                      </div>

                      {/* Animated Submit Button */}
                      <motion.button
                        onClick={handleSubmit}
                        disabled={!message.trim() || isSending}
                        className={`mt-6 w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                          !message.trim() || isSending
                            ? "bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] cursor-not-allowed opacity-50"
                            : "bg-[var(--accent)] text-white shadow-[var(--accent)]/30 hover:scale-[1.02] active:scale-95"
                        }`}
                        whileHover={
                          !message.trim() || isSending ? {} : { y: -2 }
                        }
                      >
                        {isSending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>
                            <span>Transmit Sparkle</span>
                            <Star
                              className="w-4 h-4 fill-white"
                              strokeWidth={3}
                            />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* Success State Overlay */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-black text-[var(--text-main)] mb-2 tracking-tighter uppercase">
                        Radiance Received
                      </h3>
                      <p className="text-[var(--text-muted)] font-bold text-[11px] uppercase tracking-widest">
                        Your thoughts are now part of our core.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Secure Footer Bar */}
              <div className="bg-[var(--bg-main)]/50 py-3 text-center border-t border-[var(--border-main)]">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-30">
                  Faculty Hub Galactic Protocol Active
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
