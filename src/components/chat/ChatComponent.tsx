import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
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

const ChatComponent: React.FC<ChatProps> = ({ chatRoomId, currentUserId }) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
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
    }
    setInputMessage("");
  };

  const handleDelete = async (id: number) => {
    await messageService.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)] transition-colors duration-300">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full mb-3 shadow-xl">
              <Send size={32} className="text-[var(--accent)]" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">
              No correspondence yet
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
                  isMe
                    ? "bg-[var(--accent)] text-white rounded-tr-none"
                    : "bg-[var(--bg-card)] text-[var(--text-main)] rounded-tl-none border border-[var(--border-main)]"
                }`}
              >
                {/* SENDER NAME (ONLY FOR OTHERS) */}
                {!isMe && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] block mb-1 opacity-80">
                    {msg.senderName}
                  </span>
                )}

                <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
                  {msg.content}
                </p>

                {/* FOOTER: TIME + STATUS */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1.5 opacity-60 text-[10px] font-bold ${
                    isMe ? "text-white/80" : "text-[var(--text-muted)]"
                  }`}
                >
                  {msg.edited && <span className="italic mr-1">(edited)</span>}
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck size={12} className="ml-1 opacity-90" />}
                </div>

                {/* ACTION DROPDOWN (SENT MESSAGES HOVER) */}
                {isMe && (
                  <div className="absolute top-0 right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex bg-[var(--bg-card)] shadow-2xl border border-[var(--border-main)] rounded-xl overflow-hidden">
                      <button
                        onClick={() => {
                          setEditingId(msg.id);
                          setInputMessage(msg.content);
                        }}
                        className="p-2.5 hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        <Pencil size={14} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-2.5 hover:bg-red-500/10 text-red-500 transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-5 bg-[var(--bg-card)] border-t border-[var(--border-main)] transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setInputMessage("");
              }}
              className="p-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all"
              title="Cancel Edit"
            >
              <X size={20} strokeWidth={3} />
            </button>
          )}

          <div className="relative flex-1">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                editingId
                  ? "Revise your thoughts..."
                  : "Type a professional message..."
              }
              className="w-full p-4 bg-[var(--bg-main)] text-[var(--text-main)] rounded-2xl border border-[var(--border-main)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-medium placeholder-[var(--text-muted)]/50"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="p-4 rounded-2xl bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-30 disabled:grayscale shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center"
          >
            <Send size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
