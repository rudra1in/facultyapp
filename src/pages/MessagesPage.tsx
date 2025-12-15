// src/pages/MessagesPage.tsx
import React, { useState } from "react";
import ChatComponent from "../components/chat/ChatComponent";
import { Mail, MessageSquare, User, Search, ArrowLeft } from "lucide-react";

/* =====================================================
   🔹 TEMP MOCK USER (NO AUTH / NO BACKEND)
   Change role to "admin" | "faculty" later
===================================================== */
const MOCK_CURRENT_USER = {
  uid: "faculty-milan",
  name: "Dr. Milan Sharma",
  role: "faculty", // change to "admin" to test admin view
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
   🔹 FACULTY SEARCH PANEL
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
          className="w-full pl-10 p-2 border rounded-lg"
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
          className="p-3 rounded-lg cursor-pointer hover:bg-indigo-100 flex gap-3"
        >
          <User />
          <span>{f.name}</span>
        </div>
      ))}
    </div>
  );
};

/* =====================================================
   🔹 MAIN PAGE
===================================================== */
const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [isMobileChat, setIsMobileChat] = useState(false);

  const handleSelectChat = (chat: ChatListItem) => {
    setSelectedChat(chat);
    setIsMobileChat(true);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* LEFT PANEL */}
      <div
        className={`w-full md:w-80 bg-white border-r transition-transform
        ${isMobileChat ? "-translate-x-full md:translate-x-0" : ""}`}
      >
        <div className="p-4 border-b flex items-center gap-2">
          <Mail className="text-indigo-600" />
          <h2 className="font-bold text-lg">Messages</h2>
        </div>

        {!selectedChat && (
          <FacultySearchPanel onSelectChat={handleSelectChat} />
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`flex-1 bg-white transition-transform
        ${!isMobileChat ? "translate-x-full md:translate-x-0" : ""}`}
      >
        {selectedChat ? (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b flex items-center gap-2">
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
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a faculty to start chat
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
