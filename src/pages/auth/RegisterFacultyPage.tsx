import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, GraduationCap } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /**
     * 🔜 API CALL (later)
     * facultyService.registerFaculty(form)
     */

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Faculty Registration</h1>
          </div>
          <p className="text-blue-100">
            Submit your details for admin approval
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Dr. John Doe"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="9876543210"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="faculty@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          {/* Aadhaar Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Aadhaar Card *
            </label>
            <label className="flex items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
              <Upload className="w-6 h-6 text-indigo-600" />
              <span className="text-sm text-gray-600">
                Upload Aadhaar (Image/PDF, max 5MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
              />
            </label>
            {form.aadhaar && (
              <p className="text-xs mt-2 text-green-600">
                Selected: {form.aadhaar.name}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Address *
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Subjects (comma separated) *
            </label>
            <input
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Maths, Physics, Chemistry"
              required
            />
          </div>

          {/* Specialisation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Area of Specialisation *
            </label>
            <input
              name="areaOfSpecialisation"
              value={form.areaOfSpecialisation}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Artificial Intelligence"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>

          {/* Login Link */}
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
