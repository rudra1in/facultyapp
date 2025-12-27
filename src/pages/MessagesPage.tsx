import React, { useState } from "react";
import ChatComponent from "../components/chat/ChatComponent";
import { Mail, MessageSquare, User, Search, ArrowLeft } from "lucide-react";

/* =====================================================
   🔹 TEMP MOCK USER (NO AUTH / NO BACKEND)
===================================================== */
const MOCK_CURRENT_USER = {
  uid: "faculty-milan",
  name: "Dr. Milan Sharma",
  role: "faculty",
};

/* =====================================================
   🔹 MOCK FACULTY DATABASE
===================================================== */
const MOCK_FACULTY = [
  { id: "faculty-milan", name: "Dr. Milan Sharma" },
  { id: "faculty-anya", name: "Dr. Anya Smith" },
  { id: "faculty-john", name: "Prof. John Doe" },
  { id: "faculty-jane", name: "Dr. Jane Wilson" },
];

/* =====================================================
   🔹 TYPES
===================================================== */
interface ChatListItem {
  id: string;
  otherUserId: string;
  otherUserName: string;
  lastMessageText: string;
  lastMessageTime: Date;
}

/* =====================================================
   🔹 UTILS
===================================================== */
const createChatId = (a: string, b: string) => [a, b].sort().join("--");

/* =====================================================
   🔹 FACULTY SEARCH PANEL (DARK MODE FIXED)
===================================================== */
const FacultySearchPanel = ({
  onSelectChat,
}: {
  onSelectChat: (chat: ChatListItem) => void;
}) => {
  const [search, setSearch] = useState("");

  const filtered = MOCK_FACULTY.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search faculty..."
          className="
            w-full pl-10 p-2 rounded-lg
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400
            border border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />
      </div>

      {filtered.map((f) => (
        <div
          key={f.id}
          onClick={() =>
            onSelectChat({
              id: createChatId(MOCK_CURRENT_USER.uid, f.id),
              otherUserId: f.id,
              otherUserName: f.name,
              lastMessageText: "Start a conversation",
              lastMessageTime: new Date(),
            })
          }
          className="
            p-3 rounded-lg cursor-pointer flex gap-3
            hover:bg-indigo-100 dark:hover:bg-gray-700
            transition
          "
        >
          <User className="text-indigo-600" />
          <span className="font-medium">{f.name}</span>
        </div>
      ))}
    </div>
  );
};

/* =====================================================
   🔹 MAIN PAGE (DARK MODE WORKING)
===================================================== */
const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [isMobileChat, setIsMobileChat] = useState(false);

  const handleSelectChat = (chat: ChatListItem) => {
    setSelectedChat(chat);
    setIsMobileChat(true);
  };

  return (
    <div
      className="
        flex h-[calc(100vh-64px)]
        bg-gray-50 dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        overflow-hidden
      "
    >
      {/* ================= LEFT PANEL ================= */}
      <div
        className={`
          w-full md:w-80
          bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transition-transform
          ${isMobileChat ? "-translate-x-full md:translate-x-0" : ""}
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <Mail className="text-indigo-600" />
          <h2 className="font-bold text-lg">Messages</h2>
        </div>

        {!selectedChat && (
          <FacultySearchPanel onSelectChat={handleSelectChat} />
        )}
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        className={`
          flex-1
          bg-white dark:bg-gray-800
          transition-transform
          ${!isMobileChat ? "translate-x-full md:translate-x-0" : ""}
        `}
      >
        {selectedChat ? (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <button
                className="md:hidden"
                onClick={() => setIsMobileChat(false)}
              >
                <ArrowLeft />
              </button>
              <MessageSquare className="text-indigo-600" />
              <h3 className="font-semibold">{selectedChat.otherUserName}</h3>
            </div>

            <ChatComponent
              chatRoomId={selectedChat.id}
              currentUserId={MOCK_CURRENT_USER.uid}
              currentUserName={MOCK_CURRENT_USER.name}
              currentUserRole={MOCK_CURRENT_USER.role}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a faculty to start chat
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
