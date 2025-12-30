import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("accessToken", response.token!);
      localStorage.setItem("userRole", response.role);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setForgotMsg(res.message);
    } catch (err: any) {
      setForgotMsg(err?.response?.data?.message || "Failed to send reset link");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 p-3 rounded-xl bg-white dark:bg-gray-900 shadow-lg dark:shadow-none border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 z-20"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <div className="w-full max-w-6xl h-[700px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl dark:shadow-indigo-500/5 overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800 relative">
        {/* LEFT PANEL - Decorative Art */}
        <div className="hidden md:flex w-5/12 relative items-center justify-center bg-indigo-600 overflow-hidden">
          {/* Mesh Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-purple-500 rounded-full blur-[120px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-400 rounded-full blur-[120px] opacity-40 animate-pulse" />

          <div className="relative z-10 p-12 text-center text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 flex justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                className="w-72 h-80 object-cover rounded-3xl shadow-2xl rotate-3"
                alt="Login"
              />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Empowering Education
            </h2>
            <p className="text-indigo-100/80 text-sm leading-relaxed max-w-xs mx-auto">
              Join our dedicated community of faculty members and streamline
              your academic management.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-gray-900">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-10 text-center md:text-left">
              <motion.h1
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight"
              >
                Welcome Back
              </motion.h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Sign in to manage your faculty portal
              </p>
            </header>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/30 flex items-center"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                  />
                </div>

                {/* Password Field */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline underline-offset-4"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Login Now <ChevronRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                New faculty member?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 dark:text-indigo-400 font-black hover:underline underline-offset-4"
                >
                  Request Registration
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Reset Password
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Enter your registered email to receive a secure reset link.
              </p>

              {forgotMsg && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold border border-green-100 dark:border-green-900/30">
                  {forgotMsg}
                </div>
              )}

              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 mb-6 dark:text-white transition-all"
                placeholder="Email address"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="flex-[2] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  {forgotLoading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export default LoginPage;
