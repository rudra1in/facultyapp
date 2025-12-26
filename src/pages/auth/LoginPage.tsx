import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔒 Lock scrolling
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.includes("admin")) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/faculty", { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked");
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
        aria-label="Go back to landing page"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* GLASS CARD */}
      <div
        className="
        w-full max-w-5xl min-h-[600px]
        bg-white/30 backdrop-blur-xl
        border border-white/30
        rounded-3xl shadow-2xl
        overflow-hidden
        grid grid-cols-1 md:grid-cols-2
      "
      >
        {/* LEFT – IMAGE */}
        <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500/80 to-purple-600/80 relative p-6">
          <div className="absolute top-6 left-6 w-16 h-16 bg-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/20 rounded-full" />

          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Login Illustration"
            className="
              w-full max-w-[280px] md:max-w-[340px]
              h-auto object-contain
              rounded-2xl shadow-xl
            "
          />
        </div>

        {/* RIGHT – LOGIN FORM */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white/40 backdrop-blur-lg">
          <h1
            className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4 tracking-tight drop-shadow-sm"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            LOGIN
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Sign in to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or Email"
              className="
                w-full px-4 py-3 rounded-lg
                bg-white/70 backdrop-blur
                border border-white/40
                focus:ring-2 focus:ring-indigo-500
                focus:outline-none
              "
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="
                w-full px-4 py-3 rounded-lg
                bg-white/70 backdrop-blur
                border border-white/40
                focus:ring-2 focus:ring-indigo-500
                focus:outline-none
              "
            />

            <button
              type="submit"
              className="
                w-full py-3 rounded-lg
                bg-indigo-600/90 text-white font-semibold
                hover:bg-indigo-700 transition
              "
            >
              Login Now
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-white/40" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-white/40" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="
              w-full flex items-center justify-center gap-3 py-3 rounded-lg
              bg-white/70 backdrop-blur
              border border-white/40
              text-gray-700 font-medium
              hover:bg-white/90 transition
              shadow-sm
            "
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              className="w-5 h-5"
            />
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
