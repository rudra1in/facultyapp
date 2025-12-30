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
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center border-b pb-6">
          <div className="relative">
            <img
              className="h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-indigo-100"
              src={profile.imageUrl}
              alt="profile"
            />

            {/* Change Photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 rounded-full transition"
            >
              <Edit className="h-6 w-6 text-white" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={onPhotoChange}
            />
          </div>

          <div className="ml-6">
            <h2 className="text-3xl font-extrabold">{profile.name}</h2>
            <p className="text-xl text-gray-600 flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
              {profile.role}, {profile.department}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <Mail className="inline h-4 w-4 mr-2" />
            {profile.email}
          </div>
          <div>
            <Phone className="inline h-4 w-4 mr-2" />
            {profile.phone}
          </div>
          <div>
            <MapPin className="inline h-4 w-4 mr-2" />
            {profile.office}
          </div>
          <div>
            <Clock className="inline h-4 w-4 mr-2" />
            {profile.officeHours}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
