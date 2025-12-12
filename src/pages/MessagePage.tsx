// src/pages/MessagePage.tsx
import React, { useState, useEffect } from "react";
import ChatComponent from "../components/chat/ChatComponent";
import { Mail, MessageSquare, User, Search, ArrowLeft } from "lucide-react"; // Imported ArrowLeft for back button
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  orderBy,
  limit,
} from "firebase/firestore";

// --- MOCK DATA from DashboardLayout.tsx for Name Lookup ---
// CRITICAL: This MUST match the data used in ChatComponent.tsx
const MOCK_USER_DATABASE: Record<string, { name: string; role: string }> = {
  // Mock Firebase UIDs for Admin and Students (replace with real UIDs)
  "admin-uid-123": { name: "Dr. Milan Sharma (Admin)", role: "admin" },
  "student-uid-987": { name: "Aarav Singh (Student)", role: "student" },
  "student-uid-654": { name: "Priya Patel (Student)", role: "student" },

  // The IDs for Faculty (available for students to chat with)
  "faculty-milan": { name: "Dr. Milan Sharma (Faculty)", role: "faculty" },
  "faculty-anya": { name: "Dr. Anya Smith (Faculty)", role: "faculty" },
  "faculty-john": { name: "Prof. John Doe (Faculty)", role: "faculty" },
  "faculty-jane": { name: "Dr. Jane Wilson (Faculty)", role: "faculty" },
};

// All Faculty available for selection (for the mock search panel)
const FACULTY_LIST = Object.entries(MOCK_USER_DATABASE)
  .filter(([id, data]) => data.role === "faculty")
  .map(([id, data]) => ({ id, name: data.name }));

// --- Helper Function for Name Lookup (Enhanced for new users) ---
const getOtherUserName = (userId: string) => {
  const user = MOCK_USER_DATABASE[userId];
  if (user) {
    return user.name;
  }
  if (userId.startsWith("faculty-")) {
    return userId
      .replace("faculty-", "Faculty-")
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  }
  // Fallback for new students/unknown UIDs
  return `User ${userId.substring(0, 6)}`;
};

// --- Helper Function to create a canonical chat ID (Unchanged) ---
const createCanonicalChatId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join("--");
};

// --- Types for Chat List Item (Unchanged) ---
interface ChatListItem {
  id: string;
  otherUserId: string;
  otherUserName: string;
  lastMessageText: string;
  lastMessageTime: Date;
}

// -------------------------------------------------------------
// Faculty Search Panel Component (Unchanged)
// -------------------------------------------------------------

interface FacultySearchPanelProps {
  onSelectChat: (chat: ChatListItem) => void;
  currentUserId: string;
}

const FacultySearchPanel: React.FC<FacultySearchPanelProps> = ({
  onSelectChat,
  currentUserId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFaculty = FACULTY_LIST.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFacultyClick = (facultyId: string, facultyName: string) => {
    // 1. Generate the canonical chat ID
    const newChatId = createCanonicalChatId(currentUserId, facultyId);

    // 2. Create a mock ChatListItem to initialize the chat window
    const newChat: ChatListItem = {
      id: newChatId,
      otherUserId: facultyId,
      otherUserName: facultyName,
      lastMessageText: "Start a conversation",
      lastMessageTime: new Date(),
    };

    // 3. Pass the new chat item to the parent to set the selectedChat state
    onSelectChat(newChat);
    setSearchTerm(""); // Clear search after selection
  };

  return (
    <div className="p-4 flex flex-col gap-3 h-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Faculty to Chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 border-t pt-2 border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Available Faculty:
        </p>
        {filteredFaculty.map((faculty) => (
          <div
            key={faculty.id}
            onClick={() => handleFacultyClick(faculty.id, faculty.name)}
            className="flex items-center p-3 cursor-pointer rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors border border-transparent hover:border-indigo-300 dark:hover:border-indigo-600"
          >
            <User size={20} className="text-indigo-600 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {faculty.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// MessagePage Component (Updated for mobile responsiveness)
// -------------------------------------------------------------
const MessagePage: React.FC = () => {
  const { user, loading, role } = useAuth();
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);

  const currentUserId = user?.uid;
  const currentUserRole = role;
  // Get a display name for the new user, defaulting to 'User'
  const currentUserName = user?.displayName || user?.email || "User";

  // State for mobile view: true when a chat is selected, showing the right panel.
  const [isMobileView, setIsMobileView] = useState(false);

  // Handler to set the selected chat, used by both the list and the search panel
  const handleSelectChat = (chat: ChatListItem) => {
    setSelectedChat(chat);
    setIsMobileView(true); // Switch to chat window view on mobile
  };

  const handleBackToChatList = () => {
    setIsMobileView(false);
    // setSelectedChat(null); // Optional: clear selection, but often better to keep it selected
  };

  // 1. Fetch Chat List: Conditional query based on role.
  useEffect(() => {
    if (!currentUserId || loading) return;

    let chatQuery;

    if (currentUserRole === "admin") {
      chatQuery = query(
        collection(db, "chats"),
        where("chatType", "==", "support"),
        orderBy("createdAt", "desc")
      );
    } else {
      chatQuery = query(
        collection(db, "chats"),
        where(`members.${currentUserId}`, "==", true)
      );
    }

    const unsubscribe = onSnapshot(chatQuery, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data() as DocumentData & {
          members: Record<string, boolean>;
        };
        const chatRoomId = doc.id;

        // Find the other user ID in the members list
        const memberIds = Object.keys(data.members);
        const otherUserId = memberIds.find((id) => id !== currentUserId);

        if (!otherUserId) return null;

        // Use the simplified getOtherUserName helper
        const otherUserName = getOtherUserName(otherUserId);

        const messagesRef = collection(db, "chats", chatRoomId, "messages");
        const lastMsgQuery = query(
          messagesRef,
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const lastMsgSnapshot = await new Promise<DocumentData>((resolve) => {
          const unsub = onSnapshot(lastMsgQuery, (snap) => {
            unsub();
            resolve(snap.docs[0]?.data());
          });
        });

        const lastMessageText =
          lastMsgSnapshot?.message || "Start a conversation";
        const lastMessageTime =
          lastMsgSnapshot?.timestamp?.toDate() || new Date(0);

        return {
          id: chatRoomId,
          otherUserId: otherUserId,
          otherUserName,
          lastMessageText,
          lastMessageTime,
        } as ChatListItem;
      });

      const list = (await Promise.all(chatPromises)).filter(
        (item): item is ChatListItem => item !== null
      );

      list.sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      );
      setChatList(list);

      // Select the first chat automatically if none is selected
      if (!selectedChat && list.length > 0) {
        setSelectedChat(list[0]);
      }
    });

    return () => unsubscribe();
  }, [currentUserId, loading, currentUserRole, selectedChat]);

  if (loading || !user || !currentUserId) {
    return (
      <div className="h-full flex items-center justify-center text-lg text-gray-700 dark:text-gray-300">
        Loading Messages...
      </div>
    );
  }

  // 2. Render UI
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      {/* ⬅️ Chat List Sidebar (Left Panel) - Full width on mobile, w-80 on medium screens and up */}
      <div
        className={`absolute inset-0 md:relative md:w-80 md:flex flex-col flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out
          ${isMobileView ? "translate-x-[-100%]" : "translate-x-0"}
          md:translate-x-0 w-full`} // Conditional visibility and full width on mobile
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Mail size={24} className="text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Direct Messages
          </h2>
        </div>

        {chatList.length === 0 && currentUserRole !== "admin" ? (
          // STUDENT/FACULTY: Show search/selection panel to start a new chat
          <FacultySearchPanel
            onSelectChat={handleSelectChat}
            currentUserId={currentUserId}
          />
        ) : (
          // All users: Show the list of active chats
          <div className="overflow-y-auto flex-1">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)} // Use the new handler
                className={`flex items-center p-4 cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User size={20} className="text-gray-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {chat.otherUserName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessageText}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                  {chat.lastMessageTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            {/* Admin message if no support chats are active */}
            {currentUserRole === "admin" && chatList.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No student support chats have been started yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ➡️ Chat Window (Right Panel) - Full screen on mobile, fills remaining space on medium and up */}
      <div
        className={`absolute inset-0 md:relative flex-1 flex flex-col p-4 overflow-hidden transition-transform duration-300 ease-in-out
          ${isMobileView ? "translate-x-0" : "translate-x-[100%]"}
          md:translate-x-0`} // Conditional visibility on mobile
      >
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center p-3 mb-4 bg-indigo-100 dark:bg-indigo-800 rounded-lg shadow-md flex-shrink-0">
              {/* Back Button for mobile view */}
              <button
                onClick={handleBackToChatList}
                className="md:hidden mr-2 p-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-700"
                aria-label="Back to chat list"
              >
                <ArrowLeft
                  size={20}
                  className="text-indigo-600 dark:text-indigo-200"
                />
              </button>

              <MessageSquare
                size={20}
                className="text-indigo-600 dark:text-indigo-200 mr-2 hidden md:block" // Hide icon on mobile when back button is present
              />
              <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-100 truncate">
                Conversation with {selectedChat.otherUserName}
              </h3>
            </div>
            {/* The ChatComponent receives the dynamic chatRoomId */}
            <div className="flex-1 min-h-0">
              <ChatComponent
                chatRoomId={selectedChat.id} // Correctly passes the generated ID
                currentUserId={currentUserId}
                currentUserName={currentUserName} // Use the robust display name
                currentUserRole={currentUserRole || "student"} // 🔑 CRITICAL: Pass the actual role
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            {currentUserRole === "admin"
              ? "Select a conversation from the list to begin monitoring."
              : "Select a faculty member from the list or use the search bar to start a new chat."}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
