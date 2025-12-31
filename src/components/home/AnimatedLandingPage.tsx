import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  Users,
  Zap,
  BarChart,
  Heart,
  ChevronUp,
  ChevronDown,
  Quote,
  Hexagon,
  Sparkles,
  ShieldCheck,
  Globe,
  Star,
} from "lucide-react";

// Asset imports
import landingPhoto from "../../assets/images/landingphoto.png";
import photo1 from "../../assets/images/photo1.png";
import photo2 from "../../assets/images/photo2.png";
import photo3 from "../../assets/images/photo3.png";
import photo4 from "../../assets/images/photo4.png";
import photo5 from "../../assets/images/photo5.png";
import LoginPage from "../../pages/auth/LoginPage";
import FeedbackWidget from "../../components/ui/FeedbackWidget";

/* ===============================
   1. ANIMATED BRAND LOGO
================================ */
const AnimatedLogo: React.FC<{ size?: number; showText?: boolean }> = ({
  size = 32,
  showText = true,
}) => (
  <div className="flex items-center space-x-3 group cursor-pointer">
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-blue-500 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative z-10 text-blue-600"
      >
        <Hexagon size={size + 10} strokeWidth={1.5} />
      </motion.div>
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute z-20 text-blue-400"
          animate={{ rotate: [angle, angle + 360], scale: [0.8, 1.2, 0.8] }}
          transition={{
            rotate: { duration: 5 + i, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ width: size + 20, height: size + 20 }}
        >
          <Sparkles
            size={10}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          />
        </motion.div>
      ))}
      <motion.div
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-30 bg-blue-600 h-4 w-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)] flex items-center justify-center"
      >
        <Star size={8} className="text-white fill-white" />
      </motion.div>
    </div>
    {showText && (
      <span className="text-2xl font-black tracking-tighter text-gray-800">
        FACULTY<span className="text-blue-600">HUB</span>
      </span>
    )}
  </div>
);

/* ===============================
   2. WAVE DIVIDER
================================ */
const WaveDivider: React.FC<{ fillColor: string; flip?: boolean }> = ({
  fillColor,
  flip = false,
}) => (
  <div
    className={`relative w-full overflow-hidden leading-[0] ${
      flip ? "rotate-180" : ""
    }`}
  >
    <svg
      className={`block w-full h-16 ${fillColor}`}
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0,50 C240,150 480,0 720,50 C960,100 1200,50 1440,50 L1440,100 L0,100 Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

/* ===============================
   3. QUICK STATS COMPONENTS
================================ */
const Counter: React.FC<{
  value: number;
  suffix: string;
  trigger: boolean;
}> = ({ value, suffix, trigger }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (trigger) {
      animate(0, value, {
        duration: 2,
        onUpdate: (v) => setCount(Math.floor(v)),
      });
    }
  }, [trigger, value]);
  return (
    <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
      {count.toLocaleString()}
      {suffix}
    </h3>
  );
};

const QuickStats: React.FC = () => {
  const stats = [
    {
      label: "Faculty Members",
      val: 2500,
      icon: Users,
      color: "text-blue-600",
      suffix: "+",
    },
    {
      label: "Sessions Conducted",
      val: 15000,
      icon: BookOpen,
      color: "text-teal-600",
      suffix: "+",
    },
    {
      label: "Satisfaction Rate",
      val: 98,
      icon: Heart,
      color: "text-red-600",
      suffix: "%",
    },
  ];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="bg-white py-24 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="group p-10 rounded-[3rem] bg-gray-50 border border-gray-100 text-center hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-white shadow-lg text-blue-600 group-hover:scale-110 transition-transform">
                <stat.icon size={32} />
              </div>
              <Counter
                value={stat.val}
                suffix={stat.suffix}
                trigger={isInView}
              />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <WaveDivider fillColor="fill-blue-50" />
    </div>
  );
};

/* ===============================
   4. TESTIMONIALS SECTION
================================ */
const testimonials = [
  {
    quote:
      "The Faculty Portal has simplified my academic responsibilities significantly.",
    name: "Dr. Sandeep Sharma",
    title: "Professor of CS",
    image: photo1,
  },
  {
    quote:
      "Detailed analytics in one platform has transformed our departmental decision-making.",
    name: "Mr. Sudeep Patra",
    title: "Head of Math",
    image: photo2,
  },
  {
    quote:
      "As a parent, this platform gives me clarity about my child’s progress.",
    name: "Father of Manav",
    title: "Parent",
    image: photo3,
  },
  {
    quote:
      "Accessing notes and assignments in one place has made studies easier.",
    name: "Harshita",
    title: "Student, Class 7",
    image: photo4,
  },
  {
    quote: "Collaboration is now quick and hassle-free. Best tool ever.",
    name: "Atharv",
    title: "Student, Class 12",
    image: photo5,
  },
];

const TestimonialsSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((p) => (p + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gray-50 py-24" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2 className="text-5xl font-black tracking-tighter mb-16 text-gray-900">
          Community <span className="text-blue-600">Voice</span>
        </motion.h2>
        <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[400px] flex flex-col justify-center">
          <Quote className="absolute top-10 left-10 w-12 h-12 text-blue-100" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              <p className="text-2xl font-medium text-gray-700 italic leading-relaxed">
                "{testimonials[index].quote}"
              </p>
              <div className="mt-10 flex items-center justify-center space-x-4">
                <img
                  src={testimonials[index].image}
                  className="w-16 h-16 rounded-full border-4 border-blue-50 object-cover"
                  alt=""
                />
                <div className="text-left">
                  <h4 className="font-black text-gray-900 text-lg">
                    {testimonials[index].name}
                  </h4>
                  <p className="text-blue-600 font-bold text-sm">
                    {testimonials[index].title}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <WaveDivider fillColor="fill-white" />
    </section>
  );
};

/* ===============================
   5. ABOUT SECTION
================================ */
const AboutUsSection: React.FC = () => {
  const features = [
    {
      title: "Curriculum Management",
      desc: "Plan course materials effortlessly.",
      icon: BookOpen,
      color: "bg-blue-600",
    },
    {
      title: "Student Engagement",
      desc: "Foster collaborative environments.",
      icon: Users,
      color: "bg-teal-600",
    },
    {
      title: "Performance Analytics",
      desc: "Track progress visually.",
      icon: BarChart,
      color: "bg-purple-600",
    },
    {
      title: "Workload Automation",
      desc: "Automate grading workflows.",
      icon: Zap,
      color: "bg-orange-500",
    },
  ];

  return (
    <section id="about" className="bg-blue-50/50 py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-black text-center mb-20 tracking-tighter">
          Core Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 transition-all"
            >
              <div
                className={`p-4 rounded-2xl ${f.color} text-white mb-6 w-fit shadow-lg`}
              >
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 text-gray-900">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <WaveDivider fillColor="fill-white" />
    </section>
  );
};

/* ===============================
   6. MAIN LANDING PAGE
================================ */
const AnimatedLandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const handleLearnMore = () => {
    setShowContent(true);
    setTimeout(
      () => contentRef.current?.scrollIntoView({ behavior: "smooth" }),
      300
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden flex flex-col font-sans">
      {/* PARALLAX BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          style={{ y: yParallax }}
          className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-50 rounded-full blur-[120px] opacity-60"
        />
        <motion.div
          style={{ y: yParallax }}
          className="absolute bottom-[5%] left-[-10%] w-[35rem] h-[35rem] bg-indigo-50 rounded-full blur-[120px] opacity-40"
        />
      </div>

      <div className="relative z-10">
        {/* NAV HEADER */}
        <header className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-white/70 border-b border-gray-100/50 h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
            <AnimatedLogo />
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm font-black uppercase tracking-widest text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-48 pb-20 px-6 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-full text-blue-600 mb-8 border border-blue-100">
                <ShieldCheck size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  ISO Secure Platform
                </span>
              </div>
              <h1 className="text-7xl lg:text-8xl font-black text-gray-900 leading-[0.85] tracking-tighter mb-10">
                Orchestrate <br />
                <span className="text-blue-600">Education.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-12 font-medium leading-relaxed max-w-lg">
                A high-performance workspace for faculty and students. Manage
                schedules and data in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center"
                >
                  Join The Hub <ArrowRight className="ml-2" size={18} />
                </button>
                <button
                  onClick={handleLearnMore}
                  className="px-10 py-5 border-2 border-gray-200 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-blue-400 transition-all flex items-center justify-center"
                >
                  Explore Hub
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white group">
                <img
                  src={landingPhoto}
                  alt="Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SCROLLABLE CONTENT */}
        <div ref={contentRef}>
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <AboutUsSection />
                <TestimonialsSection />
                <QuickStats />

                {/* MAP SECTION */}
                <section className="bg-blue-50 py-32">
                  <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-5xl font-black text-center mb-16 tracking-tighter">
                      Campus Terminal
                    </h2>
                    <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white aspect-video bg-white">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.123!2d85.8!3d20.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDE4JzAwLjAiTiA4NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1630000000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        title="Map"
                      />
                    </div>
                  </div>
                </section>

                <div className="text-center py-20 bg-white">
                  <motion.button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    whileHover={{ scale: 1.1 }}
                    className="p-5 bg-blue-600 text-white rounded-2xl shadow-xl"
                  >
                    <ChevronUp />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-24 px-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-400" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <AnimatedLogo size={24} />
              <p className="text-gray-400 text-sm font-medium opacity-70 leading-relaxed">
                Pioneering academic synchronization through real-time management
                protocols.
              </p>
              <div className="flex space-x-4">
                <Facebook className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-blue-500 mb-8 text-left">
                Navigate
              </h4>
              <ul className="space-y-4 text-sm text-gray-400 font-bold text-left">
                <li className="hover:text-white cursor-pointer">
                  Network Status
                </li>
                <li className="hover:text-white cursor-pointer">
                  Security Protocol
                </li>
                <li className="hover:text-white cursor-pointer">
                  Privacy Terminals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-blue-500 mb-8 text-left">
                Access
              </h4>
              <ul className="space-y-4 text-sm text-gray-400 font-bold text-left">
                <li className="flex items-center gap-3">
                  <MapPin size={18} /> Terminal One, Knowledge City
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} /> system@facultyhub.edu
                </li>
              </ul>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-center flex flex-col items-center">
              <ShieldCheck className="mb-4 text-green-400" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                System Secure
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 md:p-10"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl max-h-full overflow-y-auto rounded-[3rem] shadow-3xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center z-[210] hover:scale-110 transition-transform"
              >
                <X className="text-gray-900" size={28} />
              </button>
              <LoginPage />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FeedbackWidget />
    </div>
  );
};

export default AnimatedLandingPage;
