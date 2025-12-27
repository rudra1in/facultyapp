import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100"
    >
      <div
        className="relative w-full max-w-3xl
        bg-white/40 backdrop-blur-xl
        border border-white/40
        rounded-2xl shadow-2xl p-8"
      >
        {/* BACK ARROW */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6
            p-2 rounded-full
            bg-white/60 hover:bg-white
            shadow-md transition"
          aria-label="Go back to login"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Register Here
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Faculty registration for admin approval
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "phone", placeholder: "Phone Number" },
            { name: "email", placeholder: "Email Address", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type || "text"}
              name={field.name}
              value={(form as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-lg
                bg-white/70 backdrop-blur
                border border-white/50
                focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          ))}

          {/* Aadhaar Upload */}
          <label
            className="flex items-center justify-center gap-3
            border-2 border-dashed border-white/50
            rounded-xl p-5 cursor-pointer
            bg-white/50 backdrop-blur
            hover:border-indigo-500 transition"
          >
            <Upload className="w-6 h-6 text-indigo-600" />
            <span className="text-gray-700">Upload Aadhaar (Image / PDF)</span>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              required
            />
          </label>

          {form.aadhaar && (
            <p className="text-xs text-green-700">
              Selected: {form.aadhaar.name}
            </p>
          )}

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            placeholder="Full Address"
            className="w-full px-4 py-3 rounded-lg
              bg-white/70 backdrop-blur
              border border-white/50
              focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            name="subjects"
            value={form.subjects}
            onChange={handleChange}
            placeholder="Subjects (comma separated)"
            className="w-full px-4 py-3 rounded-lg
              bg-white/70 backdrop-blur
              border border-white/50
              focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            name="areaOfSpecialisation"
            value={form.areaOfSpecialisation}
            onChange={handleChange}
            placeholder="Area of Specialisation"
            className="w-full px-4 py-3 rounded-lg
              bg-white/70 backdrop-blur
              border border-white/50
              focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg
              bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 transition
              shadow-lg disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterFacultyPage;
