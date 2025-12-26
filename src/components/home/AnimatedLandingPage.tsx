import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
  Variants,
} from "framer-motion";
import {
  GraduationCap,
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
  FileText,
  Heart,
  ChevronUp,
  ChevronDown,
  Quote,
  ChevronLeft, // Import for Left Arrow
  ChevronRight, // Import for Right Arrow
} from "lucide-react";
import landingPhoto from "../../assets/images/landingphoto.png";
import photo1 from "../../assets/images/photo1.png";
import photo2 from "../../assets/images/photo2.png";
import photo3 from "../../assets/images/photo3.png";
import photo4 from "../../assets/images/photo4.png";
import photo5 from "../../assets/images/photo5.png";
import LoginPage from "../../pages/auth/LoginPage";
import FeedbackWidget from "../../components/ui/FeedbackWidget";

// --- NEW WAVE DIVIDER COMPONENT ---
// This component uses a responsive SVG to create a wave-like separation.
// It sits at the BOTTOM of a section and its 'fill' color should match the NEXT section's background.
interface WaveDividerProps {
  fillColor: string; // Tailwind class for fill color (e.g., 'fill-white', 'fill-blue-50')
  flip?: boolean; // Optional: To flip the wave vertically for different transitions
}

const WaveDivider: React.FC<WaveDividerProps> = ({
  fillColor,
  flip = false,
}) => (
  <div
    className={`relative w-full overflow-hidden ${
      flip ? "transform rotate-180" : ""
    }`}
  >
    <svg
      className={`block w-full h-16 ${fillColor}`} // h-16 is a good height for a smooth transition
      viewBox="0 0 1440 100" // Define the original viewBox
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,50 C240,150 480,0 720,50 C960,100 1200,50 1440,50 L1440,100 L0,100 Z"
        className={fillColor}
        fill="currentColor" // Use currentColor to inherit from fillColor class on the SVG
      ></path>
    </svg>
  </div>
);
// --- END WAVE DIVIDER COMPONENT ---

// --- QuickStats Component with Counter Animation (UPDATED background) ---
interface StatItem {
  value: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  endValue: number;
  format: (val: number) => string;
}

const QuickStats: React.FC = () => {
  const stats: StatItem[] = [
    {
      value: "2,500+",
      label: "Faculty Members",
      icon: Users,
      color: "text-blue-600",
      endValue: 2500,
      format: (val: number) => Math.round(val / 10) * 10 + "+",
    },
    {
      value: "15,000+",
      label: "Sessions Conducted",
      icon: BookOpen, // 📘 changed here
      color: "text-teal-600",
      endValue: 15000,
      format: (val: number) =>
        (Math.round(val / 100) * 100).toLocaleString() + "+",
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: Heart,
      color: "text-red-600",
      endValue: 98,
      format: (val: number) => Math.round(val) + "%",
    },
  ];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const Counter: React.FC<{ stat: StatItem }> = ({ stat }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
      if (isInView) {
        const controls = {
          start: 0,
          end: stat.endValue,
          duration: 2,
        };

        const animation = animate(controls.start, controls.end, {
          duration: controls.duration,
          onUpdate: (latest) => {
            setCurrentValue(latest);
          },
        });

        return () => animation.stop();
      }
    }, [isInView, stat.endValue]);

    return (
      <motion.div
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {stat.format(currentValue)}
      </motion.div>
    );
  };

  return (
    // Keep QuickStats as bg-white for now to contrast with the preceding Testimonials' bg-gray-50
    <div className="bg-white py-16 md:py-24 shadow-inner-top" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-teal-500">
            Our Impact at a Glance
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              className="bg-gray-50 p-6 rounded-2xl shadow-2xl ring-1 ring-black/5
flex flex-col items-center text-center space-y-3 transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.15, // VERY fast
                delay: index * 0.05, // almost instant stagger
                type: "tween", // faster than spring
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 45px rgba(0,0,0,0.18)",
              }}
            >
              <div
                className={`p-4 rounded-full bg-opacity-10 ${stat.color.replace(
                  "text",
                  "bg"
                )} bg-blue-100`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <Counter stat={stat} />
              <p className="text-lg font-medium text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* ADD WAVE DIVIDER HERE to separate QuickStats (bg-white) from LocationMap (bg-blue-50) */}
      <WaveDivider fillColor="fill-blue-50" />
    </div>
  );
};
// --- End QuickStats Component ---

// --- Testimonials Section (UPDATED) ---
// (Testimonials data and TestimonialCard component remain unchanged)
const testimonials = [
  {
    quote:
      "The Faculty Portal has simplified my academic responsibilities significantly. Managing course materials, announcements, and student interactions is now seamless, allowing me to focus more on teaching and research.",
    name: "Dr. Sandeep Sharma",
    title: "Professor of Computer Science",
    image: photo1,
  },
  {
    quote:
      "Having access to detailed analytics and performance reports in one centralized platform has transformed departmental decision-making. It helps us monitor progress, identify gaps, and improve academic outcomes effectively.",
    name: "Mr. Sudeep Patra",
    title: "Head of the Mathematics Department",
    image: photo2,
  },
  {
    quote:
      "As a parent, this platform gives me clarity and confidence about my child’s academic progress. Regular updates, communication, and transparency make it easier to stay involved and supportive.",
    name: "Father of Manav",
    title: "Parent, Class 9 | Bangalore",
    image: photo3,
  },
  {
    quote:
      "The portal makes learning more organized and interactive. Accessing notes, assignments, and clarifications in one place has made my studies easier and more enjoyable.",
    name: "Harshita",
    title: "Student, Class 7 | Mumbai",
    image: photo4,
  },
  {
    quote:
      "This platform has improved collaboration between students and teachers. Submitting assignments, receiving feedback, and staying updated on academics is now quick and hassle-free.",
    name: "Atharv",
    title: "Student, Class 12 | Kolkata",
    image: photo5,
  },
];

const TestimonialCard: React.FC<{ testimonial: (typeof testimonials)[0] }> = ({
  testimonial,
}) => (
  <motion.div
    key={testimonial.name}
    className="bg-white p-6 rounded-3xl
             shadow-[0_20px_40px_rgba(0,0,0,0.12)]
             h-full flex flex-col justify-between"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
  >
    <Quote className="w-6 h-6 text-blue-500 mb-4" />
    <p className="text-gray-600 text-base italic mb-6 flex-grow">
      "{testimonial.quote}"
    </p>

    <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
      <div className="relative">
        {/* Testimonial Image Circle */}
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        {/* Role badge overlay (Existing feature) */}
        <div className="absolute -bottom-1 -right-1 bg-teal-500 p-1 rounded-full border-2 border-white">
          {testimonial.title.includes("Professor") ||
          testimonial.title.includes("Head") ? (
            <GraduationCap className="w-3 h-3 text-white" />
          ) : (
            <Users className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
        <p className="text-sm text-blue-600">{testimonial.title}</p>
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalTestimonials = testimonials.length;
  const autoSlideInterval = useRef<number | null>(null);

  // Function to move to the next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  }, [totalTestimonials]);

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials
    );
    resetAutoSlide();
  };

  // Function to reset and restart the auto-slide timer
  const resetAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
    // Set a new interval for auto-sliding every 7 seconds
    autoSlideInterval.current = setInterval(
      nextSlide,
      7000
    ) as unknown as number;
  };

  // Start the auto-slide on mount
  useEffect(() => {
    resetAutoSlide();
    // Clear the interval when the component unmounts
    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [nextSlide]);

  // Manually clicking the arrows will reset the auto-slide timer
  const handleManualSlide = (direction: "prev" | "next") => {
    if (direction === "next") {
      nextSlide();
    } else {
      prevSlide(); // prevSlide already calls resetAutoSlide inside it
    }
    resetAutoSlide();
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section id="testimonials" className="bg-gray-50 pt-16 md:pt-24" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Our{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-teal-500">
            Community's Voice
          </span>
        </motion.h2>

        <div className="relative w-full max-w-lg mx-auto">
          {/* Testimonial Card Display */}
          <div className="relative h-96">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white p-6 rounded-3xl shadow-[0_18px_40px_rgba(0,0,0,0.15)] h-full flex flex-col justify-between"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.5, type: "tween" }}
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3"
            onClick={() => handleManualSlide("prev")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 " />
          </motion.button>
          <motion.button
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3"
            onClick={() => handleManualSlide("next")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center space-x-2 mt-12 mb-16">
          {" "}
          {/* Increased bottom margin for section end */}
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetAutoSlide(); // Reset timer on dot click
              }}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 scale-125 shadow-md"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
      {/* ADD WAVE DIVIDER HERE to separate Testimonials (bg-gray-50) from QuickStats (bg-white) */}
      <WaveDivider fillColor="fill-white" />
    </section>
  );
};
// --- End Testimonials Section ---

// --- AboutUs Section (UPDATED to add Wave Divider at the end) ---
const AboutUsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const featureVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Comprehensive Curriculum Management",
      description:
        "Easily plan, organize, and update course materials and syllabi.",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Enhanced Student Engagement",
      description: "Foster a collaborative learning environment.",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Robust Performance Analytics",
      description: "Track performance using visual dashboards.",
      icon: BarChart,
      color: "from-purple-500 to-fuchsia-600",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Seamless Administrative Workflow",
      description: "Automate grading and attendance.",
      icon: Zap,
      color: "from-orange-500 to-amber-600",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section id="about" className="bg-blue-50 pt-16 md:pt-24" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          About{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-teal-500">
            Faculty Portal
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We are committed to building the future of higher education by
          providing an intuitive and powerful platform for academic excellence.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" // Added mb-16 to give space before the wave
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="
    bg-white dark:bg-gray-900
    p-8 shadow-lg border border-gray-100 dark:border-gray-800
    transition-all duration-300 hover:shadow-2xl
    text-gray-800 dark:text-gray-200
  "
              style={{
                borderRadius: "40px 6px 40px 6px",
              }}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 6, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }} // <-- controls speed
                className={`w-14 h-14 mb-6 flex items-center justify-center
              rounded-2xl bg-gradient-to-br ${feature.color}
              shadow-md`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* ADD WAVE DIVIDER HERE to separate AboutUs (bg-blue-50) from Testimonials (bg-gray-50) */}
      <WaveDivider fillColor="fill-gray-50" />
    </section>
  );
};
// --- End AboutUs Section ---

// --- LocationMap Section (UPDATED background and Wave Divider) ---
const LocationMap: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  // Placeholder Google Maps Embed URL for a university (e.g., Stanford University)
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.3147817454254!2d-122.1748286846985!3d37.42747427982269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbb2c552554e9%3A0x628e9b6a71e89b25!2sStanford%20University!5e0!3m2!1sen!2sin!4v1633512000000!5m2!1sen!2sin";

  return (
    // CHANGED: From bg-white to bg-blue-50 for better integration with the site's palette
    <section id="map" className="bg-blue-50 pt-16 md:pt-24" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Our{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-teal-500">
            Campus Location
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Visit us at our main campus to experience our vibrant academic
          community first-hand.
        </motion.p>
        <motion.div
          className="aspect-video w-full h-96 lg:h-[600px] rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Campus Location Map"
          ></iframe>
        </motion.div>
      </div>
      {/* ADD WAVE DIVIDER HERE to separate LocationMap (bg-blue-50) from Footer (dark blue/indigo) */}
      {/* We use 'fill-white' for the wave and flip it so the white "wave" comes up from the bottom */}
      {/* This creates a clean line between the map section and the "Back to Top" section which is now inside the Conditional Content block. */}
      {/* Note: I'll update AnimatedLandingPage to make the "Back to Top" area part of the map section, or the overall Conditional Content, to make the wave transition correctly. */}

      {/* Since the Footer is dark and the Map is light, let's keep the map background light blue and add a custom visual break.
      The Footer's gradient start color is 'blue-700', which is dark. We will use a wave here. */}
      <WaveDivider fillColor="fill-blue-700" flip={true} />
    </section>
  );
};
// --- End LocationMap Section ---

// --- AnimatedLandingPage (UPDATED to integrate Wave Dividers) ---

const AnimatedLandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    setShowLogin(false);
  };

  const handleLearnMore = () => {
    setShowContent(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const floatVariants: Variants = {
    initial: { y: 0, rotate: 0 },
    animate: (i: number) => ({
      y: [0, -15 - i * 5, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8 + i * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.5,
      },
    }),
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-x-hidden flex flex-col">
      <div className="relative z-10 flex-grow flex flex-col">
        {/* Header (unchanged) */}
        <header className="flex justify-between items-center p-6 md:px-12 md:py-8 w-full max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                },
              }}
            >
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </motion.div>
            <span className="text-2xl font-bold text-gray-800">
              Faculty Portal
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex space-x-4"
          >
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
            </button>
            <motion.button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </header>

        {/* Hero Section (unchanged) */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-[calc(100vh-100px)]">
          <div className="max-w-screen-2xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.2, delayChildren: 0.3 },
                },
              }}
              className="space-y-8 lg:space-y-10"
            >
              <div className="space-y-6">
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight"
                >
                  Empowering{" "}
                  <span className="text-blue-600 drop-shadow-md">
                    Education
                  </span>
                  <br className="hidden md:block" />
                  for Faculty & Students
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-gray-600 max-w-md lg:max-w-lg"
                >
                  A modern portal to connect{" "}
                  <span className="font-semibold text-blue-600">
                    faculty, students, and admin
                  </span>
                  . Manage classes, track progress, and collaborate — all in one
                  place.
                </motion.p>
              </div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.button
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 group shadow-lg"
                  whileHover={{
                    y: -3,
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
                  }}
                  whileTap={{ y: 0, scale: 0.98 }}
                >
                  <span>Join Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={handleLearnMore}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-400 hover:text-blue-700 transition-colors shadow-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Learn More</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Section with Image and Floating Icons (unchanged) */}
            <div className="relative flex justify-center items-center lg:h-[600px] mt-8 lg:mt-0">
              <motion.div
                className="w-full max-w-xl lg:max-w-none h-auto lg:h-5/6 relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-300/50 border-4 border-white/50 cursor-pointer"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                whileHover={{ opacity: 0.95 }}
              >
                <img
                  src={landingPhoto}
                  alt="Faculty Portal Dashboard"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Icons around the image */}
              <motion.div
                className="absolute -top-10 left-1/4 transform -translate-x-1/2"
                variants={floatVariants}
                custom={0}
                animate="animate"
              >
                <div className="p-3 bg-white rounded-full shadow-lg border border-blue-100">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
              </motion.div>
              <motion.div
                className="absolute top-1/4 -right-10"
                variants={floatVariants}
                custom={1}
                animate="animate"
              >
                <div className="p-3 bg-white rounded-full shadow-lg border border-teal-100">
                  <Users className="w-6 h-6 text-teal-500" />
                </div>
              </motion.div>
              <motion.div
                className="absolute bottom-1/3 -left-10"
                variants={floatVariants}
                custom={2}
                animate="animate"
              >
                <div className="p-3 bg-white rounded-full shadow-lg border border-purple-100">
                  <BarChart className="w-6 h-6 text-purple-500" />
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-10 right-1/4 transform translate-x-1/2"
                variants={floatVariants}
                custom={3}
                animate="animate"
              >
                <div className="p-3 bg-white rounded-full shadow-lg border border-orange-100">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
                variants={floatVariants}
                custom={4}
                animate="animate"
              >
                <div className="p-3 bg-white rounded-full shadow-lg border border-green-100">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {/* Scroll Indicator (unchanged) */}
      {!showContent && (
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer p-3 rounded-full bg-blue-600/10 text-blue-600 animate-bounce"
          onClick={handleLearnMore}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      )}

      {/* CONDITIONAL CONTENT SECTIONS */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0"
            ref={contentRef}
          >
            {/* About Us section now includes the WaveDivider */}
            <AboutUsSection />
            {/* Testimonials section now includes the WaveDivider */}
            <TestimonialsSection />
            {/* Quick Stats section now includes the WaveDivider */}
            <QuickStats />
            {/* Location Map section now includes the WaveDivider */}
            <LocationMap />

            {/* Back to Top Button is moved after the map and before the footer */}
            {/* Since LocationMap now has a bg-blue-50 and ends with a dark-blue wave, 
                        I'm placing the "Back to Top" button just before the footer without a separate container, 
                        or we can keep it in its own white section for maximum visibility before the dark footer. 
                        Let's put it back to its own bg-white div for clarity. */}
            <div className="text-center py-10 bg-white">
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-8 py-3 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition-colors flex items-center space-x-2 mx-auto shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronUp className="w-5 h-5" />
                <span>Back to Top</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal (unchanged) */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <LoginPage onLogin={handleLogin} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FeedbackWidget />

      <Footer />
    </div>
  );
};

// Modernized Footer Component (unchanged)
const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and Tagline */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-200" />
            <span className="text-2xl font-bold">Faculty Portal</span>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            Revolutionizing academic management to foster growth and
            collaboration.
          </p>
          <div className="flex space-x-4 mt-6">
            <a
              href="#"
              aria-label="Facebook"
              className="text-blue-200 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-blue-200 hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-blue-200 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-blue-50">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#about"
                className="text-blue-100 hover:text-white transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                Academics
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                Research
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                Admissions
              </a>
            </li>
          </ul>
        </div>
        {/* Contact Info */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mb-5 text-blue-50">
            Contact Information
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-teal-400 mt-1 flex-shrink-0" />
              <p className="text-blue-100">
                123 University Drive, Knowledge City, State, 12345
              </p>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-teal-400 flex-shrink-0" />
              <a
                href="mailto:info@facultyportal.edu"
                className="text-blue-100 hover:text-white transition-colors"
              >
                info@facultyportal.edu
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-teal-400 flex-shrink-0" />
              <a
                href="tel:+15551234567"
                className="text-blue-100 hover:text-white transition-colors"
              >
                (555) 123-4567
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-blue-600 text-center text-sm text-blue-200 px-6">
        <p>
          &copy; {new Date().getFullYear()} Faculty Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AnimatedLandingPage;
