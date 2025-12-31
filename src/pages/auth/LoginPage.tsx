import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronRight,
  Hexagon,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

      // Trigger Success Animation
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4 transition-colors duration-500 overflow-hidden relative">
      {/* BACKGROUND ANIMATION ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.08] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500 opacity-[0.05] blur-[120px] rounded-full"
        />
      </div>

      {/* BACK BUTTON */}
      <motion.button
        whileHover={{ x: -5, backgroundColor: "var(--bg-card)" }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 p-3 rounded-2xl bg-transparent border border-[var(--border-main)] text-[var(--text-main)] z-20 transition-all backdrop-blur-md"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl h-auto md:h-[750px] bg-[var(--bg-card)] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-[var(--border-main)] relative transition-all"
      >
        {/* LEFT PANEL - VISUAL & LOGO */}
        <div className="hidden md:flex w-5/12 relative items-center justify-center bg-[var(--accent)] overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 p-12 text-center text-white flex flex-col items-center">
            {/* ANIMATED DASHBOARD LOGO */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-10">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full blur-2xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="relative z-10 text-white"
              >
                <Hexagon size={80} strokeWidth={1} className="opacity-80" />
              </motion.div>
              <motion.div
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-20 bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Sparkles size={16} className="text-[var(--accent)]" />
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black tracking-tighter mb-4"
            >
              FACULTY<span className="text-white/60">HUB</span>
            </motion.h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs font-medium uppercase tracking-[0.2em] mb-8">
              Excellence in Academic Management
            </p>

            <div className="mt-4 p-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                className="w-64 h-72 object-cover rounded-[1.8rem] transition-transform duration-700 hover:scale-110"
                alt="Institutional"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="flex-1 p-8 md:p-20 flex flex-col justify-center bg-[var(--bg-card)]">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-12">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-6"
              >
                Identity Verification
              </motion.div>
              <h1 className="text-5xl font-black text-[var(--text-main)] mb-3 tracking-tighter transition-colors">
                Sign In
              </h1>
              <p className="text-[var(--text-muted)] font-medium tracking-tight">
                Access your personalized faculty node.
              </p>
            </header>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-8 p-4 bg-red-500/10 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-3"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-5">
                <div className="group relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-14 pr-6 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Security Key"
                    className="w-full pl-14 pr-14 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:opacity-70 transition-all"
                >
                  Forgot Access Key?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || isSuccess}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                  isSuccess
                    ? "bg-green-500 text-white"
                    : "bg-[var(--accent)] text-white shadow-indigo-500/20"
                }`}
              >
                {loading ? (
                  isSuccess ? (
                    <>
                      Verifying Session{" "}
                      <CheckCircle2 className="animate-bounce" size={18} />
                    </>
                  ) : (
                    <>
                      Authenticating{" "}
                      <Loader2 className="animate-spin" size={18} />
                    </>
                  )
                ) : (
                  <>
                    Establish Connection <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Unauthorized access is prohibited.{" "}
                <Link
                  to="/register"
                  className="text-[var(--accent)] hover:underline ml-2"
                >
                  Request Access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[var(--bg-card)] w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-[var(--border-main)]"
            >
              <h2 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tighter">
                Recovery
              </h2>
              <p className="text-[var(--text-muted)] mb-8 text-sm font-medium">
                Enter your terminal email for reset instructions.
              </p>

              {forgotMsg && (
                <div className="mb-6 p-4 bg-green-500/10 text-green-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  {forgotMsg}
                </div>
              )}

              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-6 py-5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] mb-8 text-[var(--text-main)] font-bold"
                placeholder="Terminal Email"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-xl transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="flex-[2] py-4 rounded-xl bg-[var(--accent)] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                >
                  {forgotLoading ? "Transmitting..." : "Send Request"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
