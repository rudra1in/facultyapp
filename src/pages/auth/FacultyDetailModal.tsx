import React from "react";
import { X } from "lucide-react";
import { FacultyMember } from "../../types/faculty";

interface Props {
  faculty: FacultyMember;
  onClose: () => void;
}

const FacultyDetailModal: React.FC<Props> = ({ faculty, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{faculty.name}</h2>
          <p className="text-sm text-gray-500">{faculty.email}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          <Detail label="Phone" value={faculty.phone} />
          <Detail label="Address" value={faculty.address} />
          <Detail label="Subjects" value={faculty.subjects.join(", ")} />
          <Detail label="Specialisation" value={faculty.areaOfSpecialisation} />
          <Detail label="Status" value={faculty.status.toUpperCase()} />
          <Detail
            label="Created At"
            value={new Date(faculty.createdAt).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default FacultyDetailModal;
