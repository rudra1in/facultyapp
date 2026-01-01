import React, { useEffect, useState, useRef } from "react";
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
  AlertTriangle,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../../services/auth.service";

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
const AestheticSparkle = ({
  delay = 0,
  size = 12,
}: {
  delay?: number;
  size?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute pointer-events-none text-yellow-400 z-20"
  >
    <Sparkles size={size} fill="currentColor" />
  </motion.div>
);

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

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Transmission rejected."
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

  /* Variants for Staggered Animation */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen box-border flex items-center justify-center bg-[var(--bg-main)] p-4 overflow-hidden relative font-sans">
      {/* GLOBAL BACKGROUND CONSTELLATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[var(--accent)] opacity-[0.05] blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-500 opacity-[0.04] blur-[150px] rounded-full"
        />
        {[...Array(15)].map((_, i) => (
          <AestheticSparkle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 10 + 10}
          />
        ))}
      </div>

      <motion.button
        whileHover={{ x: -5, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 p-4 rounded-2xl bg-white/5 border border-[var(--border-main)] text-[var(--text-main)] z-50 backdrop-blur-xl shadow-2xl transition-all"
      >
        <ArrowLeft size={20} strokeWidth={3} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-6xl h-auto md:h-[750px] bg-[var(--bg-card)] rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row border border-white/10 relative z-10 transition-all backdrop-blur-sm"
      >
        {/* LEFT PANEL - NEURAL IDENTITY */}
        <div className="hidden md:flex w-5/12 relative items-center justify-center bg-[var(--accent)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10 border-[1px] border-dashed border-white rounded-full scale-150"
          />

          <div className="relative z-10 p-16 text-center text-white flex flex-col items-center">
            <div className="relative flex items-center justify-center w-32 h-32 mb-12">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative z-10 text-white"
              >
                <Hexagon size={100} strokeWidth={1} className="opacity-80" />
              </motion.div>
              <div className="absolute z-20 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles size={20} className="text-[var(--accent)]" />
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl font-black tracking-tighter mb-4 uppercase italic"
            >
              Faculty<span className="text-white/40">Hub</span>
            </motion.h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
              Institutional Management Terminal
            </p>

            <div className="relative mt-4 group">
              <div className="absolute inset-0 bg-white blur-[40px] opacity-10 rounded-full group-hover:opacity-30 transition-opacity" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                className="w-64 h-80 object-cover rounded-[3rem] border-4 border-white/20 relative z-10 grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
                alt="Institutional"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - PROTOCOL FORM */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-8 md:p-20 flex flex-col justify-center bg-[var(--bg-card)] relative"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] rotate-12 pointer-events-none">
            <Zap size={250} />
          </div>

          <div className="max-w-md mx-auto w-full relative z-10">
            <header className="mb-14">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[9px] font-black uppercase tracking-[0.3em] mb-6 border border-[var(--accent)]/20 shadow-inner"
              >
                <ShieldCheck size={12} fill="currentColor" /> Identity
                Validation
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-6xl font-black text-[var(--text-main)] mb-4 tracking-tighter uppercase leading-[0.9]"
              >
                Sign <span className="text-[var(--accent)] italic">In.</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-[var(--text-muted)] font-bold text-sm tracking-tight opacity-70"
              >
                Establish uplink with your institutional node.
              </motion.p>
            </header>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mb-8 p-5 bg-red-500/5 text-red-500 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-4 shadow-xl shadow-red-500/5"
                >
                  <div className="p-2 bg-red-500 rounded-lg text-white">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-10">
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="group relative">
                  <Mail
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all duration-300"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NODE IDENTIFIER (EMAIL)"
                    className="w-full pl-16 pr-6 py-6 bg-[var(--bg-main)] border-2 border-transparent rounded-[2.2rem] outline-none focus:border-[var(--accent)] text-[var(--text-main)] font-black text-xs uppercase tracking-widest transition-all shadow-inner"
                  />
                </div>

                <div className="group relative">
                  <Lock
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all duration-300"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="SECURITY KEY"
                    className="w-full pl-16 pr-16 py-6 bg-[var(--bg-main)] border-2 border-transparent rounded-[2.2rem] outline-none focus:border-[var(--accent)] text-[var(--text-main)] font-black text-xs uppercase tracking-widest transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2.5} />
                    ) : (
                      <Eye size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-end pr-4"
              >
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                >
                  Forgot Credentials?
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <AnimatePresence>
                  {isSuccess && <AestheticSparkle delay={0} size={40} />}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`w-full py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                    isSuccess
                      ? "bg-green-500 text-white shadow-green-500/30"
                      : "bg-[var(--accent)] text-white shadow-indigo-500/30 border border-white/20"
                  }`}
                >
                  {loading ? (
                    isSuccess ? (
                      <>
                        Verified{" "}
                        <CheckCircle2 className="animate-pulse" size={20} />
                      </>
                    ) : (
                      <>
                        Authenticating{" "}
                        <Loader2 className="animate-spin" size={20} />
                      </>
                    )
                  ) : (
                    <>
                      Establish Connection{" "}
                      <ChevronRight size={18} strokeWidth={4} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-16 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50">
                Network unregistered?{" "}
                <Link
                  to="/register"
                  className="text-[var(--accent)] hover:text-indigo-400 ml-2 underline underline-offset-[6px] decoration-2"
                >
                  Request Authorization
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* FORGOT PASSWORD MODAL (Aesthetic Overhaul) */}
      <AnimatePresence>
        {forgotOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-[var(--bg-card)] w-full max-w-md rounded-[3.5rem] p-14 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-45">
                <Star size={150} />
              </div>
              <h2 className="text-4xl font-black text-[var(--text-main)] mb-2 tracking-tighter uppercase italic">
                Recovery.
              </h2>
              <p className="text-[var(--text-muted)] mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Submit terminal email for recalibration link.
              </p>
              {forgotMsg && (
                <div className="mb-8 p-4 bg-green-500/5 text-green-500 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                  {forgotMsg}
                </div>
              )}
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-8 py-5 bg-[var(--bg-main)] border-2 border-transparent rounded-[2rem] outline-none focus:border-[var(--accent)] mb-10 text-[var(--text-main)] font-black text-xs uppercase tracking-widest shadow-inner"
                placeholder="IDENTIFIER"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-white/5 rounded-2xl transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="flex-[2] py-5 rounded-2xl bg-[var(--accent)] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
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
