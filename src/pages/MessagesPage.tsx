import React, { useEffect, useState } from "react";
import ChatComponent from "../components/chat/ChatComponent";
import {
  Mail,
  MessageSquare,
  User,
  Search,
  ArrowLeft,
  MoreHorizontal,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatUserService, ChatUser } from "../services/chatUser.service";
import { conversationService } from "../services/conversation.service";
import { getUserFromToken } from "../utils/auth";

interface ChatListItem {
  conversationId: number;
  otherUserId: number;
  otherUserName: string;
}

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
const AestheticSparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute pointer-events-none text-yellow-400"
  >
    <Sparkles size={10} fill="currentColor" />
  </motion.div>
);

const MessagesPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [isMobileChat, setIsMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden transition-colors duration-500 relative">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[var(--accent)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* SIDEBAR: CONTACT LIST */}
      <div
        className={`fixed inset-0 z-30 md:relative md:inset-auto w-full md:w-80 lg:w-[400px] bg-[var(--bg-card)] border-r border-[var(--border-main)] transition-all duration-500 shadow-2xl md:shadow-none
        ${
          isMobileChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="p-8 pb-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="relative">
              <h2 className="text-3xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">
                Uplink
              </h2>
              <div className="absolute -top-1 -right-4">
                <AestheticSparkle />
              </div>
            </div>
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl shadow-inner border border-[var(--accent)]/20">
              <Mail size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
              size={18}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty nodes..."
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:border-[var(--accent)] text-[var(--text-main)] placeholder-[var(--text-muted)] transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-180px)] px-4 no-scrollbar space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50 mb-4">
            Active Nodes
          </p>
          <AnimatePresence>
            {filteredUsers.map((u, index) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectUser(u)}
                className={`p-4 rounded-[2rem] cursor-pointer flex items-center gap-4 transition-all border-2 ${
                  selectedChat?.otherUserId === u.id
                    ? "bg-[var(--accent)] border-[var(--accent)]/20 text-white shadow-xl shadow-indigo-500/20"
                    : "bg-transparent border-transparent hover:bg-[var(--bg-main)] hover:border-[var(--border-main)]"
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`p-3 rounded-2xl shadow-lg border ${
                      selectedChat?.otherUserId === u.id
                        ? "bg-white/20 border-white/30"
                        : "bg-gradient-to-tr from-[var(--accent)] to-purple-500 border-transparent"
                    }`}
                  >
                    <User
                      size={22}
                      className={
                        selectedChat?.otherUserId === u.id
                          ? "text-white"
                          : "text-white"
                      }
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[var(--bg-card)] rounded-full"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-black tracking-tight truncate ${
                      selectedChat?.otherUserId === u.id
                        ? "text-white"
                        : "text-[var(--text-main)]"
                    }`}
                  >
                    {u.name}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${
                      selectedChat?.otherUserId === u.id
                        ? "text-white/70"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                {selectedChat?.otherUserId === u.id && (
                  <motion.div layoutId="sparkle-active" className="ml-auto">
                    <Zap size={14} fill="white" className="text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CHAT MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col bg-[var(--bg-main)] transition-all duration-500 relative
        ${
          !isMobileChat ? "translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        {selectedChat ? (
          <>
            {/* CHAT HEADER */}
            <div className="px-8 py-5 bg-[var(--bg-card)] border-b border-[var(--border-main)] flex items-center justify-between shadow-xl shadow-black/5 z-10 transition-colors duration-500">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setIsMobileChat(false)}
                  className="md:hidden p-3 bg-[var(--bg-main)] rounded-2xl text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                >
                  <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30 border border-white/20">
                      <User size={24} />
                      <div className="absolute -top-1 -right-1">
                        <AestheticSparkle delay={1} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tighter text-[var(--text-main)] uppercase">
                      {selectedChat.otherUserName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">
                        Uplink Established
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] rounded-full border border-[var(--border-main)] mr-2">
                  <ShieldCheck size={14} className="text-[var(--accent)]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    Encrypted
                  </span>
                </div>
                <button className="p-3 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-2xl transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* CHAT COMPONENT AREA */}
            <div className="flex-1 relative overflow-hidden bg-[var(--bg-main)]">
              <ChatComponent
                chatRoomId={selectedChat.conversationId}
                currentUserId={currentUser.id}
                currentUserName={currentUser.name}
                currentUserRole={currentUser.role}
              />
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 transition-all duration-500 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 bg-[var(--bg-card)] rounded-[3rem] shadow-2xl flex items-center justify-center mb-8 border-4 border-[var(--border-main)] relative z-10 group">
                <MessageSquare
                  size={48}
                  className="text-[var(--accent)] group-hover:scale-110 transition-transform"
                  strokeWidth={2.5}
                />
                <div className="absolute -top-4 -right-4">
                  <AestheticSparkle />
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <AestheticSparkle delay={0.5} />
                </div>
              </div>
              <div className="absolute inset-0 bg-[var(--accent)] blur-[80px] opacity-10 rounded-full" />
            </motion.div>

            <h3 className="text-4xl font-black text-[var(--text-main)] mb-4 tracking-tighter uppercase italic">
              Neural Network Terminal
            </h3>
            <p className="text-[var(--text-muted)] max-w-sm font-bold text-sm uppercase tracking-widest opacity-60 leading-relaxed">
              Select a peer node to initiate <br />
              secure administrative communication.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
