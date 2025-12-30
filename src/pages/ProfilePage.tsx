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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header/Cover Placeholder Area */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500" />

          <div className="px-6 md:px-10 pb-10">
            {/* Profile Avatar Section */}
            <div className="relative -mt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
              <div className="relative group">
                <img
                  className="h-36 w-36 rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-700"
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

              <div className="flex-1 text-center md:text-left mt-4 md:mt-10">
                <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                  {profile.name || "User Name"}
                </h2>
                <p className="text-xl text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center md:justify-start mt-1">
                  <GraduationCap className="h-6 w-6 mr-2" />
                  {profile.role}, {profile.department}
                </p>
              </div>

              <div className="mt-4 md:mt-10">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Information Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-gray-700 pb-2">
                  Contact Information
                </h3>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Email Address
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
                      {profile.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Phone Extension
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-gray-700 pb-2">
                  Office Logistics
                </h3>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Office Location
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
                      {profile.office || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Availability / Office Hours
                    </p>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">
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
