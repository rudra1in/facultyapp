import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
  GraduationCap,
  Sparkles,
  Star,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ---------------- SPARKLE ANIMATION COMPONENT ---------------- */
const ProfileSparkle = ({ delay = 0, size = 20, style }: any) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.2, 0],
      opacity: [0, 0.8, 0],
      rotate: [0, 90],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className="absolute pointer-events-none text-yellow-400"
    style={style}
  >
    <Sparkles size={size} fill="currentColor" />
  </motion.div>
);

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 transition-all duration-500 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--border-main)] relative">
          {/* Header/Cover with Dynamic Animation */}
          <div className="h-56 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-[var(--accent)]">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
            />
            {/* Status Badge */}
            <div className="absolute top-6 right-8 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Node Active
              </span>
            </div>
          </div>

          <div className="px-6 md:px-12 pb-12">
            {/* Profile Avatar Section */}
            <div className="relative -mt-24 flex flex-col md:flex-row items-end md:items-center gap-8">
              <div className="relative group">
                {/* Sparkle Constellation */}
                <ProfileSparkle
                  delay={0}
                  size={18}
                  style={{ top: "-10%", left: "80%" }}
                />
                <ProfileSparkle
                  delay={1.5}
                  size={14}
                  style={{ top: "80%", left: "-10%" }}
                />
                <ProfileSparkle
                  delay={0.8}
                  size={22}
                  style={{ top: "20%", left: "-15%" }}
                />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative p-2 bg-[var(--bg-card)] rounded-full shadow-2xl"
                >
                  <img
                    className="h-44 w-44 rounded-full object-cover border-4 border-transparent bg-gradient-to-tr from-[var(--accent)] to-purple-500 shadow-inner"
                    src={profile.imageUrl}
                    alt="profile"
                  />

                  {/* Change Photo Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-2 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-500 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="h-8 w-8 text-white" />
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">
                        Update
                      </span>
                    </div>
                  </button>
                </motion.div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={onPhotoChange}
                />
              </div>

              <div className="flex-1 text-center md:text-left mt-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2 className="text-5xl font-black tracking-tighter text-[var(--text-main)]">
                      {profile.name || "Accessing..."}
                    </h2>
                    <ShieldCheck className="text-blue-500 h-8 w-8" />
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                    <span className="px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-black uppercase tracking-widest border border-[var(--accent)]/20 flex items-center">
                      <Star className="h-3 w-3 mr-2 fill-current" />
                      {profile.role}
                    </span>
                    <span className="text-[var(--text-muted)] font-bold text-sm uppercase tracking-widest">
                      {profile.department}
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl transition-all"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>

            {/* Information Bento Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    Identity Uplink
                  </h3>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      icon: Mail,
                      label: "Neural Network Address",
                      value: profile.email,
                      color: "text-blue-500",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: Phone,
                      label: "Voice Frequency",
                      value: profile.phone,
                      color: "text-emerald-500",
                      bg: "bg-emerald-500/10",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="flex items-center p-6 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-main)] shadow-sm hover:shadow-md transition-all group"
                    >
                      <div
                        className={`p-4 ${item.bg} rounded-2xl mr-6 group-hover:scale-110 transition-transform`}
                      >
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">
                          {item.label}
                        </p>
                        <p className="text-[var(--text-main)] font-bold text-lg">
                          {item.value || "PENDING_SYNC"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Logistics Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-1 w-8 bg-purple-500 rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    Geospatial Data
                  </h3>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      icon: MapPin,
                      label: "Strategic Office Node",
                      value: profile.office,
                      color: "text-purple-500",
                      bg: "bg-purple-500/10",
                    },
                    {
                      icon: Clock,
                      label: "Operational Window",
                      value: profile.officeHours,
                      color: "text-orange-500",
                      bg: "bg-orange-500/10",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="flex items-center p-6 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-main)] shadow-sm hover:shadow-md transition-all group"
                    >
                      <div
                        className={`p-4 ${item.bg} rounded-2xl mr-6 group-hover:scale-110 transition-transform`}
                      >
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">
                          {item.label}
                        </p>
                        <p className="text-[var(--text-main)] font-bold text-lg">
                          {item.value || "UNASSIGNED"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="bg-[var(--bg-main)]/50 py-4 px-12 border-t border-[var(--border-main)] text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-40">
              Institutional Management Protocol v4.0.2
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
