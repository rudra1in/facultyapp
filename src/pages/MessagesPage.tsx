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
    <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-gray-950 overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`fixed inset-0 z-30 md:relative md:inset-auto w-full md:w-80 lg:w-96 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-transform duration-300 shadow-2xl md:shadow-none
        ${
          isMobileChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="p-6 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight dark:text-white">
              Messages
            </h2>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              <Mail size={20} />
            </div>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {users.map((u) => (
            <motion.div
              key={u.id}
              whileHover={{ x: 4 }}
              onClick={() => handleSelectUser(u)}
              className={`p-4 mx-2 my-1 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors ${
                selectedChat?.otherUserId === u.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <div className="relative">
                <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full text-white">
                  <User size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {u.name}
                </span>
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-tighter">
                  {u.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CHAT MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col bg-slate-50 dark:bg-gray-900 transition-transform duration-300
        ${
          !isMobileChat ? "translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        {selectedChat ? (
          <>
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileChat(false)}
                  className="md:hidden p-2 -ml-2 text-gray-500"
                >
                  <ArrowLeft />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white leading-tight">
                      {selectedChat.otherUserName}
                    </h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                      Online Now
                    </p>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
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
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center mb-6 border dark:border-gray-700">
              <MessageSquare size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Welcome to Secure Messages
            </h3>
            <p className="text-gray-500 max-w-xs">
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
