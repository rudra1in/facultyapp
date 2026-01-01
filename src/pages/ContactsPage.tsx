import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Filter,
  Globe,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { facultyDirectoryService } from "../services/facultyDirectory.service";

/* ================= TYPES ================= */

interface Contact {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  phoneExtension: string;
  officeLocation: string;
  researchInterests: string[];
  available: boolean;
  status: string;
  officeHours: string;
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

/* ================= AVATAR ================= */

const ContactAvatar: React.FC<{ name: string; available: boolean }> = ({
  name,
  available,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative group">
      <div
        className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-white text-xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 relative z-10`}
      >
        {initials}
      </div>
      {/* Decorative Glow Ring */}
      <div
        className={`absolute inset-0 rounded-2xl blur-lg opacity-40 transition-all duration-500 group-hover:opacity-100 ${
          available ? "bg-green-400" : "bg-[var(--accent)]"
        }`}
      />

      {available && (
        <>
          <div className="absolute -top-1 -right-1 z-20">
            <AestheticSparkle />
          </div>
          <div className="absolute -bottom-1 -left-1 z-20">
            <AestheticSparkle delay={1} />
          </div>
        </>
      )}
    </div>
  );
};

/* ================= CARD (UPGRADED) ================= */

const ContactCard: React.FC<{ contact: Contact; index: number }> = ({
  contact,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-xl border border-[var(--border-main)] p-7 transition-all group overflow-hidden relative"
    >
      {/* Background Ghost Icon */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none rotate-12">
        <Users size={180} />
      </div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <ContactAvatar name={contact.name} available={contact.available} />
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-[var(--text-main)] tracking-tighter uppercase italic leading-none mb-2 group-hover:text-[var(--accent)] transition-colors">
              {contact.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)]">
                <Briefcase className="h-3 w-3" strokeWidth={3} />
              </span>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-80">
                {contact.role}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
            contact.available
              ? "bg-green-500/5 text-green-600 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
              : "bg-red-500/5 text-red-600 border-red-500/20"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              contact.available ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          {contact.available ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="bg-[var(--bg-main)]/50 rounded-3xl p-5 border border-[var(--border-main)] space-y-4 mb-6 relative z-10">
        <div className="flex items-center gap-4 group/item cursor-pointer">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm group-hover/item:scale-110 transition-transform">
            <Mail className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)] truncate">
            {contact.email}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <MapPin className="h-4 w-4 text-purple-500" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">
            {contact.officeLocation}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">
            {contact.officeHours}
          </span>
        </div>
      </div>

      {contact.researchInterests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {contact.researchInterests.map((r, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider bg-[var(--bg-card)] text-[var(--text-muted)] rounded-xl border border-[var(--border-main)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-default"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 relative z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-6 py-4 bg-[var(--accent)] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Calendar size={14} strokeWidth={3} /> Sync Node
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm"
        >
          <ArrowUpRight size={16} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ================= MAIN PAGE ================= */

const ContactPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFacultyOnly, setShowFacultyOnly] = useState(false);

  useEffect(() => {
    facultyDirectoryService
      .getDirectory()
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const filteredContacts = useMemo(() => {
    let list = contacts;
    if (showFacultyOnly) list = list.filter((c) => c.role === "Faculty");

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.researchInterests.some((r) => r.toLowerCase().includes(q))
      );
    }
    return list;
  }, [contacts, searchTerm, showFacultyOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center transition-colors duration-300 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Users className="h-16 w-16 text-[var(--accent)] opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="h-6 w-6 text-[var(--accent)] animate-pulse" />
          </div>
        </motion.div>
        <p className="absolute mt-24 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
          Initializing Directory Node
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-10 transition-all duration-500 overflow-hidden font-sans relative">
      {/* Background Decorative Blur */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                <Users size={20} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
                Directory Access
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-[var(--text-main)] leading-[0.85] uppercase italic">
              Peer <br /> <span className="text-[var(--accent)]">Network.</span>
            </h1>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative">
            <div className="relative group flex-1 md:w-96">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                strokeWidth={3}
              />
              <input
                type="text"
                placeholder="Search Node, Dept, or Research..."
                className="w-full pl-12 pr-6 py-4 bg-[var(--bg-card)] border-2 border-transparent rounded-2xl focus:border-[var(--accent)] outline-none transition-all shadow-xl text-sm font-bold placeholder:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => setShowFacultyOnly(!showFacultyOnly)}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl ${
                showFacultyOnly
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)]"
              }`}
            >
              <Filter size={14} strokeWidth={3} /> Faculty Only
            </motion.button>
          </div>
        </header>

        <AnimatePresence mode="popLayout">
          {filteredContacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-card)] rounded-[3.5rem] p-32 text-center border-2 border-dashed border-[var(--border-main)] transition-colors"
            >
              <div className="relative w-fit mx-auto mb-8">
                <Search className="h-16 w-16 text-[var(--text-muted)] opacity-20" />
                <AestheticSparkle />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                Zero Nodes Detected
              </h3>
              <p className="text-[var(--text-muted)] font-medium max-w-xs mx-auto text-sm">
                The search query returned no active directory results.
                Recalibrate parameters.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredContacts.map((c, idx) => (
                <ContactCard key={c.id} contact={c} index={idx} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactPage;
