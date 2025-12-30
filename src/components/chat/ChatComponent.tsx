import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  CheckCheck,
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
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-2">
              <Send size={32} />
            </div>
            <p className="text-sm font-medium">No messages yet. Say hi!</p>
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
                className={`group relative max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm transition-all ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700"
                }`}
              >
                {/* SENDER NAME (RECEIVED ONLY) */}
                {!isMe && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block mb-1">
                    {msg.senderName}
                  </span>
                )}

                <p className="text-sm sm:text-base leading-relaxed break-words">
                  {msg.content}
                </p>

                {/* FOOTER: TIME + STATUS */}
                <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                  {msg.edited && (
                    <span className="text-[9px] italic mr-1">(edited)</span>
                  )}
                  <span className="text-[10px]">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && <CheckCheck size={12} className="ml-1" />}
                </div>

                {/* ACTION DROPDOWN (OWN MESSAGES) */}
                {isMe && (
                  <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex bg-white dark:bg-gray-800 shadow-xl border dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          setEditingId(msg.id);
                          setInputMessage(msg.content);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                      >
                        <Trash2 size={14} />
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
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setInputMessage("");
              }}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            >
              <Trash2 size={20} />
            </button>
          )}
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              editingId ? "Edit your message..." : "Type a message..."
            }
            className="flex-1 p-3 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
