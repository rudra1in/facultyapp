import React, { useEffect, useState } from "react";
import ChatComponent from "../components/chat/ChatComponent";
import {
  Mail,
  MessageSquare,
  User,
  Search,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { chatUserService, ChatUser } from "../services/chatUser.service";
import { conversationService } from "../services/conversation.service";
import { getUserFromToken } from "../utils/auth";

interface ChatListItem {
  conversationId: number;
  otherUserId: number;
  otherUserName: string;
}

const MessagesPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [isMobileChat, setIsMobileChat] = useState(false);

  const currentUser = getUserFromToken();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await chatUserService.getChatUsers();
        setUsers(res.filter((u) => u.id !== currentUser.id));
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, [currentUser.id]);

  const handleSelectUser = async (user: ChatUser) => {
    const conversationId = await conversationService.findOrCreate(user.id);
    setSelectedChat({
      conversationId,
      otherUserId: user.id,
      otherUserName: user.name,
    });
    setIsMobileChat(true);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden transition-colors duration-300">
      {/* SIDEBAR */}
      <div
        className={`fixed inset-0 z-30 md:relative md:inset-auto w-full md:w-80 lg:w-96 bg-[var(--bg-card)] border-r border-[var(--border-main)] transition-transform duration-300 shadow-2xl md:shadow-none
        ${
          isMobileChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-[var(--border-main)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
              Messages
            </h2>
            <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full transition-colors">
              <Mail size={20} />
            </div>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={16}
            />
            <input
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border-none rounded-xl text-sm focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] placeholder-[var(--text-muted)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)] no-scrollbar">
          {users.map((u) => (
            <motion.div
              key={u.id}
              whileHover={{ x: 4 }}
              onClick={() => handleSelectUser(u)}
              className={`p-4 mx-2 my-1 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors ${
                selectedChat?.otherUserId === u.id
                  ? "bg-[var(--accent)]/10"
                  : "hover:bg-[var(--bg-main)]"
              }`}
            >
              <div className="relative">
                <div className="p-3 bg-gradient-to-tr from-[var(--accent)] to-purple-500 rounded-full text-white shadow-lg shadow-[var(--accent)]/20">
                  <User size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg-card)] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[var(--text-main)]">
                  {u.name}
                </span>
                <span className="text-[11px] font-black uppercase text-[var(--text-muted)] tracking-tighter opacity-80">
                  {u.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CHAT MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col bg-[var(--bg-main)] transition-transform duration-300
        ${
          !isMobileChat ? "translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        {selectedChat ? (
          <>
            <div className="px-6 py-4 bg-[var(--bg-card)] border-b border-[var(--border-main)] flex items-center justify-between shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileChat(false)}
                  className="md:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <ArrowLeft />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-md shadow-[var(--accent)]/20">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] leading-tight">
                      {selectedChat.otherUserName}
                    </h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                      Online Now
                    </p>
                  </div>
                </div>
              </div>
              <button className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <MoreHorizontal />
              </button>
            </div>

            <ChatComponent
              chatRoomId={selectedChat.conversationId}
              currentUserId={currentUser.id}
              currentUserName={currentUser.name}
              currentUserRole={currentUser.role}
            />
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 transition-colors duration-300">
            <div className="w-24 h-24 bg-[var(--bg-card)] rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-[var(--border-main)]">
              <MessageSquare size={40} className="text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-2 tracking-tight">
              Welcome to Secure Messages
            </h3>
            <p className="text-[var(--text-muted)] max-w-xs font-medium">
              Select a colleague from the left to start a professional
              conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
