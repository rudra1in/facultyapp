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
} from "lucide-react";
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

/* ================= AVATAR ================= */

const ContactAvatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-white text-xl bg-[var(--accent)] shadow-inner transition-colors duration-300">
      {initials}
    </div>
  );
};

/* ================= CARD ================= */

const ContactCard: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-md border border-[var(--border-main)] border-l-4 border-l-[var(--accent)] p-6 transition-all hover:shadow-lg">
      <div className="flex items-center mb-6">
        <ContactAvatar name={contact.name} />
        <div className="ml-4">
          <h3 className="text-xl font-bold text-[var(--text-main)] transition-colors">
            {contact.name}
          </h3>
          <p className="text-[var(--accent)] font-medium flex items-center text-sm transition-colors">
            <Briefcase className="h-4 w-4 mr-1" /> {contact.role}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="px-3 py-1 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-full text-xs font-semibold opacity-80">
          {contact.department}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm ${
            contact.available
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {contact.available ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Active
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5 mr-1" /> Inactive
            </>
          )}
        </span>
      </div>

      <div className="text-sm space-y-3 border-t border-[var(--border-main)] pt-5 text-[var(--text-muted)]">
        <p className="flex items-center hover:text-[var(--accent)] transition-colors cursor-default">
          <Mail className="h-4 w-4 mr-3 text-[var(--text-muted)] opacity-50" />
          {contact.email}
        </p>
        <p className="flex items-center">
          <Phone className="h-4 w-4 mr-3 text-[var(--text-muted)] opacity-50" />
          {contact.phoneExtension}
        </p>
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-3 text-[var(--text-muted)] opacity-50" />
          {contact.officeLocation}
        </p>
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-3 text-[var(--text-muted)] opacity-50" />
          {contact.officeHours}
        </p>
      </div>

      {contact.researchInterests.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {contact.researchInterests.map((r, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] rounded-md font-bold border border-[var(--accent)]/5"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center">
          <Calendar className="h-4 w-4 mr-2" />
          Book Meeting
        </button>
        <button className="flex-1 px-4 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] hover:bg-[var(--accent)]/5 rounded-xl text-sm font-bold transition-all flex items-center justify-center">
          <Globe className="h-4 w-4 mr-2 text-[var(--accent)]" />
          Map
        </button>
      </div>
    </div>
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
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-pulse">
          <Users className="h-12 w-12 text-[var(--accent)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)] font-medium">
            Synchronizing Directory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center tracking-tight">
            <Users className="h-10 w-10 mr-4 text-[var(--accent)] transition-colors" />
            Faculty Directory
          </h1>
          <p className="text-[var(--text-muted)] transition-colors">
            Connect with educators and researchers across departments.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] opacity-60" />
            <input
              type="text"
              placeholder="Search by name, department, or expertise..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all shadow-sm text-[var(--text-main)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFacultyOnly(!showFacultyOnly)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center transition-all ${
              showFacultyOnly
                ? "bg-[var(--accent)] text-white shadow-lg"
                : "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)] hover:bg-[var(--bg-main)]"
            }`}
          >
            <Filter
              className={`h-4 w-4 mr-2 ${
                showFacultyOnly ? "text-white" : "text-[var(--accent)]"
              }`}
            />
            Faculty Only
          </button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-3xl p-20 text-center border border-dashed border-[var(--border-main)] transition-colors">
            <Search className="h-16 w-16 text-[var(--text-muted)] opacity-30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-1">No matches found</h3>
            <p className="text-[var(--text-muted)]">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredContacts.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
