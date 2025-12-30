// ==============================
// TOKEN HELPERS
// ==============================

export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRole = (): "ADMIN" | "FACULTY" | null => {
  return localStorage.getItem("userRole") as any;
};

// ==============================
// JWT PAYLOAD TYPE
// ==============================

interface JwtPayload {
  sub: string; // email
  userId: number; // ✅ backend should include this
  name: string; // ✅ backend should include this
  role: "ADMIN" | "FACULTY";
  exp: number;
}

// ==============================
// DECODE USER FROM TOKEN
// ==============================

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) throw new Error("No token found");

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;

    return {
      id: payload.userId,
      name: payload.name,
      role: payload.role,
      email: payload.sub,
    };
  } catch (err) {
    console.error("Invalid token", err);
    logout();
    throw new Error("Invalid token");
  }
};

// ==============================
// JWT EXPIRY CHECK
// ==============================

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// ==============================
// AUTH CHECK
// ==============================

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    logout();
    return false;
  }

  return true;
};

// ==============================
// LOGOUT
// ==============================

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRole");
  window.location.href = "/login";
};
