import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bug,
  Lightbulb,
  Heart,
  Sparkles,
} from "lucide-react";

const FeedbackWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Suggestion");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    // Simulate API Delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Feedback Category:", category);
    console.log("Feedback Message:", message);

    setIsSending(false);
    setMessage("");
    setOpen(false);
    // Use a custom toast here if you have one, alert is a fallback
    alert("Feedback sent! Thank you for helping us improve. ✨");
  };

  const categories = [
    {
      name: "Suggestion",
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    { name: "Bug Report", icon: Bug, color: "text-red-500", bg: "bg-red-50" },
    { name: "Praise", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white px-5 py-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.4)]"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-bold text-sm hidden md:block">Feedback</span>
        <MessageSquare className="w-6 h-6" />

        {/* Decorative Pulse Effect */}
        <span className="absolute inset-0 rounded-2xl bg-white/20 animate-ping pointer-events-none" />
      </motion.button>

      {/* Feedback Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-md flex items-end md:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white/95 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-white"
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    Share your thoughts{" "}
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Your input helps us shape the platform.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Picker */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2 ${
                      category === cat.name
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`What's on your mind? Tell us about your ${category.toLowerCase()}...`}
                  className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isSending}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-lg transition-all shadow-lg ${
                  !message.trim() || isSending
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95"
                }`}
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
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <>
                    <span>Send Feedback</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Secure & Anonymous
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
