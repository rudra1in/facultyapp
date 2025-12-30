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
    <div className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-white text-xl bg-indigo-600 shadow-inner">
      {initials}
    </div>
  );
};

/* ================= CARD ================= */

const ContactCard: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 border-l-4 border-l-indigo-500 p-6 transition-all hover:shadow-lg">
      <div className="flex items-center mb-6">
        <ContactAvatar name={contact.name} />
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {contact.name}
          </h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-1" /> {contact.role}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
          {contact.department}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm ${
            contact.available
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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

      <div className="text-sm space-y-3 border-t border-gray-100 dark:border-gray-700 pt-5 text-gray-600 dark:text-gray-400">
        <p className="flex items-center hover:text-indigo-500 transition-colors cursor-default">
          <Mail className="h-4 w-4 mr-3 text-gray-400" />
          {contact.email}
        </p>
        <p className="flex items-center">
          <Phone className="h-4 w-4 mr-3 text-gray-400" />
          {contact.phoneExtension}
        </p>
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-3 text-gray-400" />
          {contact.officeLocation}
        </p>
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-3 text-gray-400" />
          {contact.officeHours}
        </p>
      </div>

      {contact.researchInterests.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {contact.researchInterests.map((r, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-md font-bold"
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
        <button className="flex-1 px-4 py-2.5 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-gray-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center">
          <Globe className="h-4 w-4 mr-2" />
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Users className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Synchronizing Directory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-8 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center tracking-tight">
            <Users className="h-10 w-10 mr-4 text-indigo-600 dark:text-indigo-400" />
            Faculty Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with educators and researchers across departments.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, department, or expertise..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFacultyOnly(!showFacultyOnly)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center transition-all ${
              showFacultyOnly
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <Filter
              className={`h-4 w-4 mr-2 ${
                showFacultyOnly ? "text-white" : "text-indigo-500"
              }`}
            />
            Faculty Only
          </button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-1">No matches found</h3>
            <p className="text-gray-500">
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
