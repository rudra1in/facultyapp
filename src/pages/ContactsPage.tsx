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
  role: string; // "Faculty"
  email: string;
  phoneExtension: string;
  officeLocation: string;
  researchInterests: string[];
  available: boolean;
  status: string; // ACTIVE / INACTIVE
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
    <div className="h-14 w-14 rounded-full flex items-center justify-center font-bold text-white text-xl bg-indigo-600">
      {initials}
    </div>
  );
};

/* ================= CARD ================= */

const ContactCard: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-indigo-500 p-6">
      <div className="flex items-center mb-4">
        <ContactAvatar name={contact.name} />
        <div className="ml-4">
          <h3 className="text-xl font-bold">{contact.name}</h3>
          <p className="text-indigo-600 flex items-center">
            <Briefcase className="h-4 w-4 mr-1" /> Faculty
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-3">
        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
          {contact.department}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm flex items-center ${
            contact.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {contact.available ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" /> Active
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-1" /> Inactive
            </>
          )}
        </span>
      </div>

      <div className="text-sm space-y-2 border-t pt-4">
        <p className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          {contact.email}
        </p>
        <p className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {contact.phoneExtension}
        </p>
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {contact.officeLocation}
        </p>
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {contact.officeHours}
        </p>
      </div>

      {contact.researchInterests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {contact.researchInterests.map((r, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-gray-200 rounded-full"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
          <Calendar className="h-4 w-4 inline mr-1" />
          Book Meeting
        </button>
        <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded text-sm">
          <Globe className="h-4 w-4 inline mr-1" />
          View Map
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

  /* ===== FETCH DIRECTORY ===== */
  useEffect(() => {
    facultyDirectoryService
      .getDirectory()
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  /* ===== FILTER ===== */
  const filteredContacts = useMemo(() => {
    let list = contacts;

    if (showFacultyOnly) {
      list = list.filter((c) => c.role === "Faculty");
    }

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
    return <div className="p-10 text-center">Loading directory...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Users className="h-7 w-7 mr-3" />
        Faculty Directory
      </h1>

      <input
        type="text"
        placeholder="Search faculty..."
        className="w-full mb-6 p-3 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        onClick={() => setShowFacultyOnly(!showFacultyOnly)}
        className="mb-6 px-4 py-2 border rounded"
      >
        <Filter className="h-4 w-4 inline mr-1" />
        Show Faculty Only
      </button>

      {filteredContacts.length === 0 ? (
        <p>No faculty found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContacts.map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactPage;
