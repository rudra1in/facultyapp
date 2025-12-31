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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { facultyService } from "../../services/faculty.service";

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
      setSuccess("Application transmitted. Awaiting administrative clearance.");

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
      {/* AMBIENT BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[5%] -right-[5%] w-[45%] h-[45%] bg-[var(--accent)] opacity-[0.07] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[5%] -left-[5%] w-[40%] h-[40%] bg-blue-500 opacity-[0.05] blur-[120px] rounded-full"
        />
      </div>

      {/* BACK BUTTON */}
      <motion.button
        whileHover={{ x: -5, backgroundColor: "var(--bg-card)" }}
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 p-3 rounded-2xl bg-transparent border border-[var(--border-main)] text-[var(--text-main)] z-50 transition-all backdrop-blur-md"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-[var(--bg-card)] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-[var(--border-main)] overflow-hidden transition-all duration-500"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* LEFT DECORATIVE PANEL - ANIMATED LOGO */}
          <div className="hidden lg:flex lg:w-[35%] bg-[var(--accent)] p-12 text-white flex-col justify-between relative overflow-hidden transition-colors duration-700">
            <div className="absolute inset-0 bg-black/10" />

            {/* Animated Background Shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* HEXAGONAL LOGO ANIMATION */}
              <div className="relative flex items-center justify-center w-20 h-20 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative z-10 text-white"
                >
                  <Hexagon size={64} strokeWidth={1.5} className="opacity-90" />
                </motion.div>
                <motion.div
                  animate={{ scale: [0.8, 1.1, 0.8] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute z-20 bg-white h-6 w-6 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Sparkles size={12} className="text-[var(--accent)]" />
                </motion.div>
              </div>

              <h2 className="text-3xl font-black leading-tight mb-4 tracking-tighter">
                FACULTY<span className="text-white/60">HUB</span>
              </h2>
              <p className="text-white/70 text-sm font-medium uppercase tracking-[0.2em] leading-relaxed">
                Elite Network Enrollment
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-xs font-medium leading-relaxed italic text-white/90">
                  "Become part of a global community dedicated to academic
                  excellence and streamlined management."
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Administrative verification active
              </div>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="flex-1 p-8 md:p-14 max-h-[90vh] overflow-y-auto no-scrollbar bg-[var(--bg-card)]">
            <header className="mb-10">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-block px-4 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-4"
              >
                Registration Protocol
              </motion.div>
              <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">
                Member Onboarding
              </h1>
              <p className="text-[var(--text-muted)] font-medium mt-2">
                Supply your professional credentials for system authentication.
              </p>
            </header>

            <AnimatePresence mode="wait">
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-5 rounded-[1.5rem] bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-4 font-bold text-sm"
                >
                  <div className="p-2 bg-green-500 rounded-full text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-5 rounded-[1.5rem] bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-4 font-bold text-sm"
                >
                  <div className="p-2 bg-red-500 rounded-full text-white">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    Identity Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    Contact Terminal
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="phone"
                      type="text"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 000 000"
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    System Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="node@institution.edu"
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    Security Key
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    Core Specialisation
                  </label>
                  <div className="relative group">
                    <Award
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="areaOfSpecialisation"
                      type="text"
                      required
                      value={form.areaOfSpecialisation}
                      onChange={handleChange}
                      placeholder="Cognitive Computing"
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                    Discipline Areas
                  </label>
                  <div className="relative group">
                    <BookOpen
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                      size={18}
                    />
                    <input
                      name="subjects"
                      type="text"
                      required
                      value={form.subjects}
                      onChange={handleChange}
                      placeholder="AI, Neural Nets..."
                      className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                  Terminal Address
                </label>
                <div className="relative group">
                  <MapPin
                    className="absolute left-4 top-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                    size={18}
                  />
                  <textarea
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Full professional or residential address"
                    className="w-full pl-12 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] font-bold transition-all placeholder-[var(--text-muted)]/40"
                  />
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] ml-1">
                  Identity Document (Aadhaar)
                </label>
                <label
                  className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-300 ${
                    form.aadhaar
                      ? "bg-[var(--accent)]/5 border-[var(--accent)]/50 shadow-inner"
                      : "bg-[var(--bg-main)] border-[var(--border-main)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    {form.aadhaar ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3 text-[var(--accent)] font-black uppercase tracking-tighter text-sm"
                      >
                        <CheckCircle size={24} /> {form.aadhaar.name}
                      </motion.div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-2 text-[var(--text-muted)] opacity-30" />
                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
                          <span className="text-[var(--accent)]">Upload</span>{" "}
                          Identity Module
                        </p>
                        <p className="text-[9px] text-[var(--text-muted)]/60 mt-1 uppercase">
                          PDF or high-res imagery
                        </p>
                      </>
                    )}
                  </div>
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || isSuccess}
                className={`w-full py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                  isSuccess
                    ? "bg-green-500 text-white"
                    : "bg-[var(--accent)] text-white shadow-indigo-500/20"
                } disabled:opacity-70`}
              >
                {loading ? (
                  isSuccess ? (
                    <>
                      Verified <CheckCircle size={18} />
                    </>
                  ) : (
                    <>
                      Transmitting{" "}
                      <Loader2 className="animate-spin" size={18} />
                    </>
                  )
                ) : (
                  <>
                    Submit Enrollment <ChevronRight size={18} />
                  </>
                )}
              </motion.button>

              <p className="text-[10px] font-black text-center text-[var(--text-muted)] uppercase tracking-[0.2em] pt-4">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="text-[var(--accent)] hover:underline ml-1"
                >
                  Access Portal
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterFacultyPage;
