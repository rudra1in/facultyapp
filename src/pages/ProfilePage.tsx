import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Edit, GraduationCap } from "lucide-react";
import { profileService } from "../services/profile.service";

interface ProfileData {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  officeHours: string;
  imageUrl: string;
}

const emptyProfile: ProfileData = {
  name: "",
  role: "",
  department: "",
  email: "",
  phone: "",
  office: "",
  officeHours: "Mon–Fri: 10:00 AM – 4:00 PM",
  imageUrl: "/default-avatar.png",
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 Load logged-in user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getMyProfile();
        setProfile({
          name: data.name,
          role: data.role,
          department: data.department,
          email: data.email,
          phone: data.phone || "",
          office: data.office || "",
          officeHours: "Mon–Fri: 10:00 AM – 4:00 PM",
          imageUrl: data.profileImage
            ? `http://localhost:8080/uploads/profile/${data.profileImage}`
            : "/default-avatar.png",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  // 🔥 Upload profile photo
  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      await profileService.uploadProfilePhoto(e.target.files[0]);
      const updated = await profileService.getMyProfile();

      setProfile((prev) => ({
        ...prev,
        imageUrl: updated.profileImage
          ? `http://localhost:8080/uploads/profile/${updated.profileImage}`
          : prev.imageUrl,
      }));
    } catch (err) {
      console.error("Photo upload failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border-main)]">
          {/* Header/Cover Placeholder Area - Adaptive Gradient */}
          <div className="h-40 bg-gradient-to-r from-[var(--accent)] to-purple-600 opacity-90" />

          <div className="px-6 md:px-10 pb-10">
            {/* Profile Avatar Section */}
            <div className="relative -mt-20 flex flex-col md:flex-row items-end md:items-center gap-6">
              <div className="relative group">
                <img
                  className="h-40 w-40 rounded-full object-cover shadow-2xl ring-4 ring-[var(--bg-card)] bg-[var(--bg-main)] border border-[var(--border-main)]"
                  src={profile.imageUrl}
                  alt="profile"
                />

                {/* Change Photo Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 backdrop-blur-sm"
                  title="Change Photo"
                >
                  <Edit className="h-8 w-8 text-white" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={onPhotoChange}
                />
              </div>

              <div className="flex-1 text-center md:text-left mt-4 md:mt-12">
                <h2 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
                  {profile.name || "User Name"}
                </h2>
                <p className="text-xl text-[var(--accent)] font-bold flex items-center justify-center md:justify-start mt-2">
                  <GraduationCap className="h-6 w-6 mr-2" />
                  {profile.role}, {profile.department}
                </p>
              </div>

              <div className="mt-4 md:mt-12">
                <button className="px-8 py-3 bg-[var(--accent)] hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 transition-all">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Information Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--border-main)] pb-3">
                  Contact Information
                </h3>

                <div className="flex items-center p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-main)] transition-all">
                  <div className="p-3 bg-blue-500/10 rounded-xl mr-5">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">
                      Email Address
                    </p>
                    <p className="text-[var(--text-main)] font-bold">
                      {profile.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-main)] transition-all">
                  <div className="p-3 bg-green-500/10 rounded-xl mr-5">
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">
                      Phone Extension
                    </p>
                    <p className="text-[var(--text-main)] font-bold">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--border-main)] pb-3">
                  Office Logistics
                </h3>

                <div className="flex items-center p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-main)] transition-all">
                  <div className="p-3 bg-purple-500/10 rounded-xl mr-5">
                    <MapPin className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">
                      Office Location
                    </p>
                    <p className="text-[var(--text-main)] font-bold">
                      {profile.office || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-main)] transition-all">
                  <div className="p-3 bg-orange-500/10 rounded-xl mr-5">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">
                      Availability / Office Hours
                    </p>
                    <p className="text-[var(--text-main)] font-bold">
                      {profile.officeHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
