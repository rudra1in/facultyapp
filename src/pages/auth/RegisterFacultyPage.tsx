import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle,
  Hexagon,
  Sparkles,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { facultyService } from "../../services/faculty.service";

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
    transition={{ duration: 2, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute pointer-events-none text-yellow-400 z-20"
  >
    <Sparkles size={size} fill="currentColor" />
  </motion.div>
);

const RegisterFacultyPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    subjects: "",
    areaOfSpecialisation: "",
    aadhaar: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, aadhaar: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("address", form.address);
      formData.append(
        "subjects",
        form.subjects
          .split(",")
          .map((s) => s.trim())
          .join(",")
      );
      formData.append("areaOfSpecialisation", form.areaOfSpecialisation);

      if (form.aadhaar) {
        formData.append("aadhaarFile", form.aadhaar);
      }

      await facultyService.registerFacultyMultipart(formData);

      setIsSuccess(true);
      setSuccess("Protocol Initialized. Awaiting Clearance.");
      setTimeout(() => navigate("/login"), 3500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Transmission failure"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[var(--bg-main)] transition-colors duration-500 overflow-hidden relative">
      {/* BACKGROUND NEURAL MESH */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] bg-[var(--accent)] opacity-[0.05] blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-blue-500 opacity-[0.04] blur-[150px] rounded-full"
        />
        {/* Particle Stars */}
        {[...Array(20)].map((_, i) => (
          <AestheticSparkle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 10 + 5}
          />
        ))}
      </div>

      {/* BACK BUTTON (Tactile) */}
      <motion.button
        whileHover={{ x: -5, backgroundColor: "var(--bg-card)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 p-4 rounded-2xl bg-transparent border border-[var(--border-main)] text-[var(--text-main)] z-50 transition-all backdrop-blur-xl shadow-lg"
      >
        <ArrowLeft size={20} strokeWidth={3} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-6xl bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-[var(--border-main)] overflow-hidden transition-all duration-500 z-10"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* LEFT DECORATIVE PANEL - QUANTUM IDENTITY */}
          <div className="hidden lg:flex lg:w-[38%] bg-[var(--accent)] p-16 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

            {/* Animated Ghost Icons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] rotate-12">
              <ShieldCheck size={200} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* BRAND GALAXY */}
              <div className="relative flex items-center justify-center w-28 h-28 mb-10">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative z-10 text-white"
                >
                  <Hexagon size={80} strokeWidth={1.2} />
                </motion.div>
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute z-20 bg-white h-8 w-8 rounded-full flex items-center justify-center shadow-[0_0_20px_white]"
                >
                  <Sparkles size={16} className="text-[var(--accent)]" />
                </motion.div>
                {/* Orbiting Star */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-30"
                >
                  <Star
                    size={12}
                    fill="white"
                    className="absolute top-0 left-1/2 -translate-x-1/2 shadow-lg"
                  />
                </motion.div>
              </div>

              <h2 className="text-4xl font-black leading-tight mb-4 tracking-tighter uppercase italic">
                Faculty<span className="text-white/40">Hub</span>
              </h2>
              <div className="h-1 w-12 bg-white/30 rounded-full mb-6" />
              <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em] leading-relaxed">
                Academic Node Enrollment
              </p>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl">
                <p className="text-sm font-medium leading-relaxed italic text-white/80">
                  "Initiate your professional integration into our
                  high-performance academic ecosystem."
                </p>
              </div>
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                  Institutional Guard Active
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="flex-1 p-8 md:p-16 max-h-[90vh] overflow-y-auto no-scrollbar bg-[var(--bg-card)] relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 pointer-events-none">
              <Zap size={200} />
            </div>

            <header className="mb-14 relative z-10">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[9px] font-black uppercase tracking-[0.2em] border border-[var(--accent)]/20"
              >
                <Zap size={12} fill="currentColor" /> Protocol Selection
              </motion.div>
              <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tighter mt-4 uppercase italic">
                Member <span className="text-[var(--accent)]">Onboarding.</span>
              </h1>
              <p className="text-[var(--text-muted)] font-medium mt-4 text-sm max-w-md">
                Supply your institutional credentials for multi-layer
                authentication.
              </p>
            </header>

            <AnimatePresence mode="wait">
              {(success || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mb-10 p-6 rounded-[2rem] border-2 flex items-center gap-5 font-black text-xs uppercase tracking-widest ${
                    success
                      ? "bg-green-500/5 text-green-500 border-green-500/20"
                      : "bg-red-500/5 text-red-500 border-red-500/20"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-white shadow-xl ${
                      success ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {success ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  {success || error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  {
                    name: "name",
                    label: "Identity Title",
                    icon: User,
                    type: "text",
                    ph: "Dr. Jane Smith",
                  },
                  {
                    name: "phone",
                    label: "Neural Frequency",
                    icon: Phone,
                    type: "text",
                    ph: "+1 000 000",
                  },
                  {
                    name: "email",
                    label: "Uplink Node",
                    icon: Mail,
                    type: "email",
                    ph: "jane@academy.edu",
                  },
                  {
                    name: "password",
                    label: "Security Key",
                    icon: Lock,
                    type: "password",
                    ph: "••••••••",
                  },
                  {
                    name: "areaOfSpecialisation",
                    label: "Core Expertise",
                    icon: Award,
                    type: "text",
                    ph: "Quantum Logic",
                  },
                  {
                    name: "subjects",
                    label: "Discipline Hubs",
                    icon: BookOpen,
                    type: "text",
                    ph: "AI, Bio-Tech...",
                  },
                ].map((input, idx) => (
                  <motion.div
                    key={input.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-3"
                  >
                    <label className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-[0.4em] ml-4 opacity-50">
                      {input.label}
                    </label>
                    <div className="relative group">
                      <input.icon
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all duration-300"
                        size={18}
                      />
                      <input
                        name={input.name}
                        type={input.type}
                        required
                        value={(form as any)[input.name]}
                        onChange={handleChange}
                        placeholder={input.ph}
                        className="w-full pl-14 pr-6 py-5 bg-[var(--bg-main)] border-2 border-transparent rounded-3xl outline-none focus:border-[var(--accent)] text-[var(--text-main)] font-bold transition-all shadow-inner placeholder:opacity-20"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-[0.4em] ml-4 opacity-50">
                  Terminal Domicile
                </label>
                <div className="relative group">
                  <MapPin
                    className="absolute left-5 top-6 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all"
                    size={18}
                  />
                  <textarea
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Institutional or Residential Address"
                    className="w-full pl-14 pr-6 py-5 bg-[var(--bg-main)] border-2 border-transparent rounded-3xl outline-none focus:border-[var(--accent)] text-[var(--text-main)] font-bold transition-all shadow-inner placeholder:opacity-20"
                  />
                </div>
              </div>

              {/* DOCUMENT UPLOAD (Upgraded) */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-[0.4em] ml-4 opacity-50">
                  Identity Module (Aadhaar)
                </label>
                <label
                  className={`group flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[3rem] cursor-pointer transition-all duration-500 relative overflow-hidden ${
                    form.aadhaar
                      ? "bg-green-500/5 border-green-500/30"
                      : "bg-[var(--bg-main)] border-[var(--border-main)] hover:border-[var(--accent)]"
                  }`}
                >
                  {form.aadhaar && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-green-500 opacity-5 pointer-events-none"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center p-6 text-center relative z-10">
                    {form.aadhaar ? (
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="p-4 bg-green-500 rounded-[1.5rem] text-white shadow-2xl shadow-green-500/40">
                          <CheckCircle size={32} />
                        </div>
                        <p className="text-xs font-black text-green-500 uppercase tracking-tighter">
                          {form.aadhaar.name}
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="p-4 bg-[var(--bg-card)] rounded-[1.5rem] shadow-xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Upload
                            className="w-8 h-8 text-[var(--accent)]"
                            strokeWidth={2.5}
                          />
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                          Transmit{" "}
                          <span className="text-[var(--accent)]">
                            Digital Node
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              </div>

              <div className="relative pt-6">
                <AnimatePresence>
                  {isSuccess && <AestheticSparkle size={40} />}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`w-full py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                    isSuccess
                      ? "bg-green-500 text-white shadow-green-500/30"
                      : "bg-[var(--accent)] text-white shadow-indigo-500/40 border border-white/20"
                  }`}
                >
                  {loading ? (
                    isSuccess ? (
                      <>
                        Synchronized <CheckCircle size={20} />
                      </>
                    ) : (
                      <Loader2 className="animate-spin" size={20} />
                    )
                  ) : (
                    <>
                      Submit Credentials{" "}
                      <ChevronRight size={18} strokeWidth={3} />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="text-center pt-6">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
                  Registered Node?{" "}
                  <Link
                    to="/login"
                    className="text-[var(--accent)] hover:text-indigo-400 ml-2 underline underline-offset-8 decoration-2"
                  >
                    Re-Uplink
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterFacultyPage;
