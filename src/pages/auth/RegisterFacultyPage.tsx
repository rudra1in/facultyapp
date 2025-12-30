import { useState } from "react";
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
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setSuccess(
        "Registration submitted successfully. Please wait for admin approval."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 p-3 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 z-50"
      >
        <ArrowLeft size={20} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Decorative Section */}
          <div className="hidden lg:flex lg:w-1/3 bg-indigo-600 p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16" />

            <div className="relative z-10">
              <Award className="w-12 h-12 mb-6 text-indigo-200" />
              <h2 className="text-3xl font-black leading-tight mb-4">
                Join Our Faculty
              </h2>
              <p className="text-indigo-100/80 text-sm">
                Become part of an elite academic network. Your application will
                be reviewed by our administration team.
              </p>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-widest">
                <CheckCircle size={14} /> Admin Verified
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="flex-1 p-8 md:p-12">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Faculty Registration
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please provide your details for verification.
              </p>
            </header>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 flex items-center font-bold text-sm"
                >
                  <CheckCircle className="mr-2 w-5 h-5" /> {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center font-bold text-sm"
                >
                  <AlertCircle className="mr-2 w-5 h-5" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="phone"
                      type="text"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@university.edu"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Specialisation
                  </label>
                  <div className="relative group">
                    <Award
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="areaOfSpecialisation"
                      type="text"
                      required
                      value={form.areaOfSpecialisation}
                      onChange={handleChange}
                      placeholder="PhD in AI"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                    Subjects
                  </label>
                  <div className="relative group">
                    <BookOpen
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                      size={18}
                    />
                    <input
                      name="subjects"
                      type="text"
                      required
                      value={form.subjects}
                      onChange={handleChange}
                      placeholder="Math, Physics..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                  Residential Address
                </label>
                <div className="relative group">
                  <MapPin
                    className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                    size={18}
                  />
                  <textarea
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Enter your full address"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">
                  Aadhaar Verification
                </label>
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                    form.aadhaar
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {form.aadhaar ? (
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                        <CheckCircle size={20} /> {form.aadhaar.name}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-bold">Click to upload</span>{" "}
                          Aadhaar PDF/Image
                        </p>
                      </>
                    )}
                  </div>
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-70"
              >
                {loading ? "Processing..." : "Submit Application"}
              </motion.button>

              <p className="text-sm text-center text-gray-500 dark:text-gray-400 font-medium">
                Already part of the faculty?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 dark:text-indigo-400 font-black hover:underline"
                >
                  Login here
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
