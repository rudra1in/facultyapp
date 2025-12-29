import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
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

  // ==============================
  // SUBMIT (API)
  // ==============================
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

      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
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
        {/* BACK */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-6 left-6 p-2 rounded-full bg-white shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-3xl font-semibold text-center mb-2">
          Faculty Registration
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Registration requires admin approval
        </p>

        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "phone", "email", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={field.toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded bg-white"
            />
          ))}

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-white"
          />

          <input
            name="subjects"
            placeholder="Subjects (comma separated)"
            value={form.subjects}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-white"
          />

          <input
            name="areaOfSpecialisation"
            placeholder="Area of Specialisation"
            value={form.areaOfSpecialisation}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded bg-white"
          />

          <label className="flex items-center gap-3 p-4 border-dashed border rounded cursor-pointer bg-white">
            <Upload className="w-5 h-5" />
            Upload Aadhaar
            <input type="file" hidden onChange={handleFileChange} />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit for Approval"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterFacultyPage;
