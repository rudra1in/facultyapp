// ==============================
// CORE FACULTY TYPE (DB / API)
// ==============================
export interface Faculty {
  id: number; // unique faculty id
  name: string;
  email: string;
  phone: string;
  address: string;

  subjects: string[]; // ["Math", "Physics"]
  areaOfSpecialisation: string;

  status: "PENDING" | "ACTIVE" | "INACTIVE"; // admin controlled
  isDeleted: boolean; // soft delete flag

  createdAt: string; // ISO date
  updatedAt: string;
}

// ==============================
// FACULTY REGISTER REQUEST
// (Register Page → Backend)
// ==============================
export interface FacultyRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;

  address: string;
  subjects: string[]; // converted from comma input
  areaOfSpecialisation: string;

  aadhaarFile: File; // multipart upload
}

// ==============================
// ADMIN ACTIONS
// ==============================
export interface FacultyApprovalRequest {
  facultyId: number;
  action: "APPROVE" | "REJECT";
  reason?: string; // optional reject reason
}

// ==============================
// ADMIN DELETE OPTIONS
// ==============================
export interface FacultyDeleteRequest {
  facultyId: number;
  type: "HARD_DELETE" | "SOFT_DELETE";
}

// ==============================
// UI EXTENDED TYPE (DASHBOARD ONLY)
// ==============================
export interface FacultyUI extends Faculty {
  title: string; // Professor, Assistant Prof
  sessions: number;
  rating: number;
  initials: string;
  color: string;
  lastActivity: string;
  workloadThreshold: number;
}
