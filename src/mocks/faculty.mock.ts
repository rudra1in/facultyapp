import { FacultyMember } from "../types/faculty";

export const mockFaculty: FacultyMember[] = [
  {
    id: 1,
    name: "Dr. Milan Sahoo",
    email: "milan@faculty.com",
    phone: "9876543210",
    address: "Bhubaneswar",
    subjects: ["DSA", "Java"],
    areaOfSpecialisation: "Computer Science",
    status: "pending",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Dr. Ananya Mishra",
    email: "ananya@faculty.com",
    phone: "9123456780",
    address: "Cuttack",
    subjects: ["Maths"],
    areaOfSpecialisation: "Mathematics",
    status: "active",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
