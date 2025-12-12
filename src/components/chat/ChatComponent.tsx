// src/components/ChatComponent.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";

// --- MOCK DATABASE (local only, no Firebase) ---
const localMessageStore: Record<string, any[]> = {};

// Dummy user database (same as your original)
const MOCK_USER_DATABASE: Record<string, { name: string; role: string }> = {
  "admin-uid-123": { name: "Dr. Milan Sharma (Admin)", role: "admin" },
  "student-uid-987": { name: "Aarav Singh (Student)", role: "student" },
  "student-uid-654": { name: "Priya Patel (Student)", role: "student" },
  "faculty-milan": { name: "Dr. Milan Sharma", role: "faculty" },
  "faculty-anya": { name: "Dr. Anya Smith", role: "faculty" },
  "faculty-john": { name: "Prof. John Doe", role: "faculty" },
  "faculty-jane": { name: "Dr. Jane Wilson", role: "faculty" },
};

// Determine role of a user (without Firebase)
const getUserRole = (
  userId: string,
  currentUserId: string,
  currentUserRole: string
) => {
  if (MOCK_USER_DATABASE[userId]?.role) return MOCK_USER_DATABASE[userId].role;
  if (userId === currentUserId) return currentUserRole;
  return "unknown";
};

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  chatRoomId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

const ChatComponent: React.FC<ChatProps> = ({
  chatRoomId,
  currentUserId,
  currentUserName,
  currentUserRole,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Room (local only)
  useEffect(() => {
    if (!localMessageStore[chatRoomId]) {
      localMessageStore[chatRoomId] = [];
    }
    setMessages([...localMessageStore[chatRoomId]]);
  }, [chatRoomId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = useCallback(() => {
    if (inputMessage.trim() === "") return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      message: inputMessage,
      timestamp: new Date(),
    };

    // Save into local store
    localMessageStore[chatRoomId].push(newMsg);

    // Update UI
    setMessages([...localMessageStore[chatRoomId]]);

    // Reset input
    setInputMessage("");
  }, [inputMessage, currentUserId, currentUserName, chatRoomId]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-xl bg-white dark:bg-gray-800 max-w-full mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
            Start the conversation!
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-md text-sm ${
                msg.senderId === currentUserId
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
              }`}
            >
              <p
                className={`font-bold text-xs mb-1 ${
                  msg.senderId === currentUserId
                    ? "text-indigo-200"
                    : "text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {msg.senderName}
              </p>

              <p>{msg.message}</p>

              <span
                className={`text-[10px] mt-1 block ${
                  msg.senderId === currentUserId
                    ? "text-indigo-200 opacity-80"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          className="px-4 flex items-center justify-center bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
