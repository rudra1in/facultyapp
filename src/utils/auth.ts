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
// JWT EXPIRY CHECK
// ==============================

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // invalid token → treat as expired
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

  // hard redirect (clears memory + state)
  window.location.href = "/login";
};
