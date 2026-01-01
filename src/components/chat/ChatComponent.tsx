import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCheck,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  messageService,
  MessageResponse,
} from "../../services/message.service";

interface ChatProps {
  chatRoomId: number;
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
}

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
const MessageSparkle = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: [0, 45, 90] }}
    transition={{ duration: 0.8 }}
    className="absolute -top-4 -right-4 text-yellow-400 pointer-events-none"
  >
    <Sparkles size={20} fill="currentColor" />
  </motion.div>
);

const ChatComponent: React.FC<ChatProps> = ({ chatRoomId, currentUserId }) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showSparkle, setShowSparkle] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRoomId) return;
    messageService.getMessages(chatRoomId).then(setMessages);
  }, [chatRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    if (editingId) {
      const updated = await messageService.editMessage(editingId, inputMessage);
      setMessages((prev) =>
        prev.map((m) => (m.id === editingId ? updated : m))
      );
      setEditingId(null);
    } else {
      const msg = await messageService.sendMessage(chatRoomId, inputMessage);
      setMessages((prev) => [...prev, msg]);

      // Trigger Send Sparkle Effect
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 800);
    }
    setInputMessage("");
  };

  const handleDelete = async (id: number) => {
    await messageService.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)] transition-colors duration-500 overflow-hidden relative">
      {/* BACKGROUND AMBIANCE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar z-10">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="relative mb-4">
                <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] shadow-2xl relative z-10">
                  <Zap
                    size={40}
                    className="text-[var(--accent)] animate-pulse"
                  />
                </div>
                <div className="absolute inset-0 bg-[var(--accent)] blur-2xl opacity-20 rounded-full" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter">
                Secure Uplink Ready
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-2 opacity-60">
                Initiate institutional correspondence
              </p>
            </motion.div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex w-full ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="group relative flex flex-col max-w-[85%] sm:max-w-[70%]">
                    {/* SENDER NAME */}
                    {!isMe && (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-2 ml-2 opacity-70 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />{" "}
                        {msg.senderName}
                      </span>
                    )}

                    <div
                      className={`relative px-5 py-4 rounded-[2rem] shadow-xl transition-all duration-300 border ${
                        isMe
                          ? "bg-[var(--accent)] text-white rounded-tr-none border-white/10 shadow-indigo-500/20"
                          : "bg-[var(--bg-card)] text-[var(--text-main)] rounded-tl-none border-[var(--border-main)]"
                      }`}
                    >
                      <p className="text-sm sm:text-[15px] leading-relaxed font-semibold">
                        {msg.content}
                      </p>

                      {/* FOOTER: TIME + STATUS */}
                      <div
                        className={`flex items-center justify-end gap-1.5 mt-2 opacity-50 text-[9px] font-black uppercase tracking-tighter ${
                          isMe ? "text-white" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {msg.edited && <span className="italic">Revised</span>}
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe && <CheckCheck size={12} strokeWidth={3} />}
                      </div>

                      {/* ACTION OVERLAY (HOVER) */}
                      {isMe && (
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <div className="flex flex-col gap-1 bg-[var(--bg-card)] p-1 rounded-2xl border border-[var(--border-main)] shadow-2xl">
                            <button
                              onClick={() => {
                                setEditingId(msg.id);
                                setInputMessage(msg.content);
                              }}
                              className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--accent)] rounded-xl transition-colors"
                            >
                              <Pencil size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                            >
                              <Trash2 size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-[var(--bg-card)] border-t border-[var(--border-main)] transition-all duration-500 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <AnimatePresence>
            {editingId && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => {
                  setEditingId(null);
                  setInputMessage("");
                }}
                className="p-4 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all border border-red-500/20"
              >
                <X size={20} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative flex-1 group">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                editingId
                  ? "Modify protocol content..."
                  : "Synthesize message..."
              }
              className="w-full p-5 bg-[var(--bg-main)] text-[var(--text-main)] rounded-[2rem] border-2 border-transparent outline-none focus:border-[var(--accent)] transition-all font-bold text-sm placeholder-[var(--text-muted)]/40 shadow-inner"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <ShieldCheck size={16} className="text-[var(--accent)]" />
            </div>
          </div>

          <div className="relative">
            <AnimatePresence>
              {showSparkle && <MessageSparkle />}
            </AnimatePresence>

            <motion.button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-5 rounded-[1.8rem] bg-[var(--accent)] text-white hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center border border-white/20"
            >
              <Send
                size={22}
                strokeWidth={3}
                className={
                  inputMessage.trim() ? "animate-in fade-in zoom-in" : ""
                }
              />
            </motion.button>
          </div>
        </div>

        <div className="text-center mt-3">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-30">
            End-to-End Encrypted Terminal
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
