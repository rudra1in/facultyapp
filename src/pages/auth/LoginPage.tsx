import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const ADMIN_EMAIL = "admin@facultyapp.com";
const ADMIN_PASSWORD = "admin123";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ⛔ ADMIN LOGIN (Hardcoded)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("role", "admin");
      setLoading(false);
      navigate("/admin");
      return;
    }

    // 👨‍🏫 FACULTY LOGIN (API – later backend will verify)
    try {
      /**
       * BACKEND WILL HANDLE:
       * - email + password
       * - check status (PENDING / ACTIVE)
       */
      // await authService.loginFaculty({ email, password });

      localStorage.setItem("role", "faculty");
      setLoading(false);
      navigate("/faculty");
    } catch (err) {
      setError("Invalid credentials or approval pending");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: LOGIN FORM */}
        <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10" />
              <h1 className="text-3xl font-bold">Faculty App</h1>
            </div>
            <p className="text-blue-100">
              Secure login for faculty members and administrators
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 text-red-100 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-semibold shadow-lg disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center text-blue-100">
              New faculty?{" "}
              <Link
                to="/register"
                className="underline font-medium hover:text-white"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT: ILLUSTRATION / INFO */}
        <div className="hidden md:flex items-center justify-center bg-blue-50 p-10">
          <div className="text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Faculty"
              className="w-64 mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Manage faculty profiles, approvals, and dashboards in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
