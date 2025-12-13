export interface FacultyMember {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: "active" | "inactive";
  subjects: string[];
  sessions: number;
  rating: number;
  initials: string;
  color: string;
  lastActivity: string;
  workloadThreshold: number;
}
