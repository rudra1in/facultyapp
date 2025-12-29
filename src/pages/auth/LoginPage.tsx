import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 Lock scrolling
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  // ==============================
  // LOGIN HANDLER (API)
  // ==============================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
      });

      // 🔐 Save token
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("userRole", response.role);

      // 🔁 ROLE BASED REDIRECT (FIXED)
      if (response.role === "ADMIN") {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (response.role === "FACULTY") {
        if (response.status === "ACTIVE") {
          navigate("/faculty", { replace: true });
        } else if (response.status === "PENDING") {
          setError("Your registration is pending admin approval. Please wait.");
        } else {
          setError("Your account is inactive. Contact admin.");
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login integration coming soon");
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/gray-paper.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundColor: "#f2f2f2",
      }}
    >
      {/* BACK ARROW */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20
          p-2 rounded-full
          bg-white/70 backdrop-blur
          shadow-md hover:bg-white transition"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* GLASS CARD */}
      <div
        className="w-full max-w-5xl min-h-[600px]
        bg-white/30 backdrop-blur-xl
        border border-white/30
        rounded-3xl shadow-2xl
        overflow-hidden
        grid grid-cols-1 md:grid-cols-2"
      >
        {/* LEFT IMAGE */}
        <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500/80 to-purple-600/80 p-6">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Login"
            className="w-full max-w-[320px] rounded-2xl shadow-xl"
          />
        </div>

        {/* LOGIN FORM */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white/40">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">LOGIN</h1>

          <p className="text-sm text-gray-600 mb-6">
            Sign in to access your account
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-white/70 border"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/70 border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg bg-white border text-gray-700"
          >
            Sign in with Google
          </button>

          <p className="text-sm text-gray-600 mt-6">
            New faculty member?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Request Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
