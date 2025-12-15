// import api from "../api/axios";
// import { FacultyMember } from "../types/faculty";

// /**
//  * ==============================
//  * REQUEST PAYLOAD TYPES
//  * ==============================
//  */

// import { mockFaculty } from "../mocks/faculty.mock";

// const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

// // Faculty registration / add
// export interface CreateFacultyDTO {
//   name: string;
//   title: string;
//   email: string;
//   phone: string;
//   location: string;
//   subjects: string[];
//   workloadThreshold: number;
// }

// // Admin update
// export interface UpdateFacultyDTO extends CreateFacultyDTO {
//   status: "active" | "inactive";
// }

// /**
//  * ==============================
//  * FACULTY API SERVICE
//  * ==============================
//  */

// export const facultyService = {
//   getAllFaculty: async (): Promise<FacultyMember[]> => {
//     const res = await api.get("/faculty");
//     return res.data;
//   },

//   searchFaculty: async (params: {
//     q?: string;
//     subject?: string;
//     status?: "active" | "inactive";
//   }): Promise<FacultyMember[]> => {
//     const res = await api.get("/faculty/search", { params });
//     return res.data;
//   },

//   // 🔹 STEP 7 — FACULTY REGISTER
//   registerFaculty: async (data: CreateFacultyDTO): Promise<FacultyMember> => {
//     const res = await api.post("/faculty/register", {
//       ...data,
//       status: "pending",
//     });
//     return res.data;
//   },

//   // 🔹 ADMIN ADD
//   createFaculty: async (data: CreateFacultyDTO): Promise<FacultyMember> => {
//     const res = await api.post("/faculty", data);
//     return res.data;
//   },

//   updateFaculty: async (
//     id: number,
//     data: UpdateFacultyDTO
//   ): Promise<FacultyMember> => {
//     const res = await api.put(`/faculty/${id}`, data);
//     return res.data;
//   },

//   deactivateFaculty: async (id: number): Promise<void> => {
//     await api.patch(`/faculty/${id}/status`, { status: "inactive" });
//   },

//   activateFaculty: async (id: number): Promise<void> => {
//     await api.patch(`/faculty/${id}/status`, { status: "active" });
//   },

//   deleteFaculty: async (id: number): Promise<void> => {
//     await api.delete(`/faculty/${id}`);
//   },

//   approveFaculty: async (id: number): Promise<void> => {
//     await api.patch(`/faculty/${id}/approve`);
//   },

//   rejectFaculty: async (id: number): Promise<void> => {
//     await api.patch(`/faculty/${id}/reject`);
//   },
// };

import api from "../api/axios";
import { FacultyMember } from "../types/faculty";
import { mockFaculty } from "../mocks/faculty.mock";

/**
 * ==============================
 * ENV FLAG
 * ==============================
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

/**
 * ==============================
 * REQUEST PAYLOAD TYPES
 * ==============================
 */

// Faculty registration / add
export interface CreateFacultyDTO {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  subjects: string[];
  workloadThreshold: number;
}

// Admin update
export interface UpdateFacultyDTO extends CreateFacultyDTO {
  status: "active" | "inactive";
}

/**
 * ==============================
 * FACULTY API SERVICE
 * ==============================
 */

export const facultyService = {
  /**
   * ==============================
   * GET ALL FACULTY
   * ==============================
   */
  getAllFaculty: async (): Promise<FacultyMember[]> => {
    if (USE_MOCK) {
      console.log("[MOCK API] getAllFaculty");
      return Promise.resolve([...mockFaculty]);
    }

    const res = await api.get("/faculty");
    return res.data;
  },

  /**
   * ==============================
   * SEARCH / FILTER
   * ==============================
   */
  searchFaculty: async (params: {
    q?: string;
    subject?: string;
    status?: "active" | "inactive" | "pending";
  }): Promise<FacultyMember[]> => {
    if (USE_MOCK) {
      console.log("[MOCK API] searchFaculty", params);
      return Promise.resolve(
        mockFaculty.filter((f) => {
          if (params.status && f.status !== params.status) return false;
          if (
            params.q &&
            !f.name.toLowerCase().includes(params.q.toLowerCase())
          )
            return false;
          if (params.subject && !f.subjects.includes(params.subject))
            return false;
          return true;
        })
      );
    }

    const res = await api.get("/faculty/search", { params });
    return res.data;
  },

  /**
   * ==============================
   * FACULTY SELF REGISTER (PENDING)
   * ==============================
   */
  registerFaculty: async (data: CreateFacultyDTO): Promise<FacultyMember> => {
    if (USE_MOCK) {
      console.log("[MOCK API] registerFaculty");

      const newFaculty: FacultyMember = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.location,
        subjects: data.subjects,
        areaOfSpecialisation: data.title,
        status: "pending",
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockFaculty.unshift(newFaculty);
      return Promise.resolve(newFaculty);
    }

    const res = await api.post("/faculty/register", {
      ...data,
      status: "pending",
    });
    return res.data;
  },

  /**
   * ==============================
   * ADMIN CREATE (DIRECT ACTIVE)
   * ==============================
   */
  createFaculty: async (data: CreateFacultyDTO): Promise<FacultyMember> => {
    if (USE_MOCK) {
      console.log("[MOCK API] createFaculty");

      const newFaculty: FacultyMember = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.location,
        subjects: data.subjects,
        areaOfSpecialisation: data.title,
        status: "active",
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockFaculty.unshift(newFaculty);
      return Promise.resolve(newFaculty);
    }

    const res = await api.post("/faculty", data);
    return res.data;
  },

  /**
   * ==============================
   * UPDATE FACULTY
   * ==============================
   */
  updateFaculty: async (
    id: number,
    data: UpdateFacultyDTO
  ): Promise<FacultyMember> => {
    if (USE_MOCK) {
      console.log("[MOCK API] updateFaculty", id);

      const index = mockFaculty.findIndex((f) => f.id === id);
      if (index !== -1) {
        mockFaculty[index] = {
          ...mockFaculty[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return Promise.resolve(mockFaculty[index]);
      }

      throw new Error("Faculty not found");
    }

    const res = await api.put(`/faculty/${id}`, data);
    return res.data;
  },

  /**
   * ==============================
   * APPROVE FACULTY (ADMIN)
   * ==============================
   */
  approveFaculty: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      console.log("[MOCK API] approveFaculty", id);

      const faculty = mockFaculty.find((f) => f.id === id);
      if (faculty) faculty.status = "active";
      return Promise.resolve();
    }

    await api.patch(`/faculty/${id}/approve`);
  },

  /**
   * ==============================
   * REJECT FACULTY (ADMIN)
   * ==============================
   */
  rejectFaculty: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      console.log("[MOCK API] rejectFaculty", id);

      const faculty = mockFaculty.find((f) => f.id === id);
      if (faculty) faculty.status = "inactive";
      return Promise.resolve();
    }

    await api.patch(`/faculty/${id}/reject`);
  },

  /**
   * ==============================
   * SOFT DELETE (DEACTIVATE)
   * ==============================
   */
  deactivateFaculty: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      console.log("[MOCK API] deactivateFaculty", id);

      const faculty = mockFaculty.find((f) => f.id === id);
      if (faculty) faculty.status = "inactive";
      return Promise.resolve();
    }

    await api.patch(`/faculty/${id}/status`, { status: "inactive" });
  },

  /**
   * ==============================
   * ACTIVATE FACULTY
   * ==============================
   */
  activateFaculty: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      console.log("[MOCK API] activateFaculty", id);

      const faculty = mockFaculty.find((f) => f.id === id);
      if (faculty) faculty.status = "active";
      return Promise.resolve();
    }

    await api.patch(`/faculty/${id}/status`, { status: "active" });
  },

  /**
   * ==============================
   * HARD DELETE (PERMANENT)
   * ==============================
   */
  deleteFaculty: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      console.log("[MOCK API] deleteFaculty", id);

      const index = mockFaculty.findIndex((f) => f.id === id);
      if (index !== -1) mockFaculty.splice(index, 1);
      return Promise.resolve();
    }

    await api.delete(`/faculty/${id}`);
  },
};
