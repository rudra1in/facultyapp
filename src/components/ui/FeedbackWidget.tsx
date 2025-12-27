import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const FeedbackWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) return;

    // 🔹 You can connect API here later
    console.log("Feedback:", message);

    setMessage("");
    setOpen(false);
    alert("Thank you for your feedback! 💙");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50
                   bg-gradient-to-r from-blue-600 to-teal-500
                   text-white p-4 rounded-full shadow-2xl"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Send Feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                       flex items-end md:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Send us your Feedback
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full h-32 p-3 border rounded-xl
                           focus:outline-none focus:ring-2
                           focus:ring-blue-500 resize-none"
              />

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="mt-4 w-full flex items-center justify-center gap-2
                           bg-gradient-to-r from-blue-600 to-teal-500
                           text-white py-3 rounded-xl font-medium
                           hover:opacity-90 transition"
              >
                <Send className="w-4 h-4" />
                Send Feedback
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
