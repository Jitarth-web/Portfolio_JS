import cert1 from "../pages/cert1.png";
import cert2 from "../pages/cert2.png";
import cert3 from "../pages/cert3.png";
import cert4 from "../pages/cert4.png";
import cert5 from "../pages/cert5.png";
import cert6 from "../pages/cert6.png";
import cert7 from "../pages/cert7.png";
import cert8 from "../pages/cert8.png";
import cert9 from "../pages/cert9.png";
import campus from "../pages/campus.png"
import image from "./comingsoon.png";

export const profile = {
  name: "Jitarth Singh",
  title: "FULL STACK AI WEB DEVELOPER",
  education:
    "B.Tech Computer Science and Engineering, National Institute of Technology Delhi (NIT Delhi)",
  description:
    "CSE student at National Institute of Technology Delhi passionate about Web Development, Software Engineering, Artificial Intelligence, and Problem Solving. I enjoy building modern digital experiences and solving real-world problems through technology.",
  email: "jitarthsingh@gmail.com",
  github: "https://github.com/Jitarth-web/",
  linkedin: "https://in.linkedin.com/in/jitarth-singh-25560b369/",
  resume: "/241210049_Jitarth_NEW.pdf"
};

export const navItems = ["Home", "About", "Skills", "Projects", "Experience", "Certifications", "Contact"];

export const orbitSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "GitHub",
  "Git",
  "Figma",
  "VS Code"
];

export const skills = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "React","Shery.JS","GSAP"] },
  { group: "Backend", items: ["Python", "Flask", "Node.js","FastAPI"] },
  { group: "AI", items: ["Prompt Engineering", "LLMs", "Machine Learning", "Data Analysis"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Figma","Cursor","Devin"] }
];

export const projects = [
  {
    title: "Shagun Fashions",
    description:
      "A modern and premium tailoring website for school uniforms, custom stitching, and bulk garment manufacturing. Features a cinematic UI, responsive design, smooth animations, and an elegant user experience.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    github: "https://github.com/yash062988-glitch/shagun_fashion",
    live: "https://shagun-fashion.vercel.app/",
    image: image,
  },
  {
    title: "Student Management System",
    description:
      "A web application for tracking Student attendance, Social Dashboard, and Obtaining Notes.",
    tech: ["Python Flask", "Fast-API","SQLite"],
    github: "https://github.com/Jitarth-web/ClassClan",
    live: image
  },
  {
    title: "AgriSort",
    description:
      "A Platform where Farmers can see real-time crop prices and market trends.",
    tech: ["Python Flask", "Fast-API","SQLite"],
    github: "https://github.com/",
    live: image
  },
  {
    title: "Smart Waste Management System (SwachhCity)",
    description:
      "A web Application where citizens can report waste issues and track collection status.",
    tech: ["Python Flask", "React.JS","SQL-Persistent","Fast-API","Docker"],
    github: "https://github.com/Jitarth-web/SwachhCity",
    live: "https://swachh-city-16db.vercel.app/"
  },
  {
    title: "SoundWave-AI",
    description:
      "An AI-powered music recommendation system that analyzes user preferences and generates personalized playlists.",
    tech: ["React.JS","Node.JS","MongoDB"],
    github: "https://github.com/ka0-0/Soundwave_AI",
    live: "https://soundwave-ai-ioik.vercel.app"
  },
  {
    title: "Domiq AI",
    description:
      "A modern AI-powered platform that analyzes floor plans, recommends personalized interior designs, generates smart room layouts, estimates construction costs, and creates immersive 3D visualizations using Gemini AI.",
    tech: ["React.JS", "Node.JS", "MongoDB", "Gemini AI"],
    github: "https://github.com/",
    live: image
  },
];

export const experience = [
  {
    title: "Computer Science Engineering",
    meta: "NIT Delhi",
    detail:
      "Building a strong foundation in software development, data structures, problem solving, and engineering principles."
  },
  {
    title: "Web Development",
    meta: "Projects & Practice",
    detail:
      "Creating responsive interfaces, reusable components, and modern frontend experiences with React and CSS."
  },
  {
    title: "AI & Software Engineering",
    meta: "Learning Path",
    detail:
      "Exploring artificial intelligence, backend systems, and practical solutions for real-world technical problems."
  }
];

export const certifications = [
  {
    title: "AWS Solutions Architecture",
    issuer: "AWS × Forage",
    date: "Jul 2025",
    image: cert1,
    credentialUrl: "#"
  },
  {
    title: "Data Analytics Simulation",
    issuer: "Deloitte × Forage",
    date: "Jul 2025",
    image: cert2,
    credentialUrl: "#"
  },
  {
    title: "Data Visualization",
    issuer: "Tata × Forage",
    date: "Jul 2025",
    image: cert3,
    credentialUrl: "#"
  },
  {
    title: "AI Foundations",
    issuer: "HP LIFE",
    date: "Jul 2025",
    image: cert4,
    credentialUrl: "#"
  },
  {
    title: "Introduction to AI",
    issuer: "Google × Coursera",
    date: "Jun 2026",
    image: cert9,
    credentialUrl: "#"
  },
  {
    title: "Excel Fundamentals",
    issuer: "Coursera",
    date: "Jul 2025",
    image: cert6,
    credentialUrl: "#"
  },
  {
    title: "Azure Computer Vision",
    issuer: "Microsoft × Coursera",
    date: "Jul 2025",
    image: cert7,
    credentialUrl: "#"
  },
  {
    title: "Resume & Interview Skills",
    issuer: "HP LIFE",
    date: "Jul 2025",
    image: cert5,
    credentialUrl: "#"
  },
  {
    title: "Writing Prompts",
    issuer: "Google × Coursera",
    date: "Jun 2026",
    image: cert8,
    credentialUrl: "#"
  },
  {
    title: "Campus Crew",
    issuer: "Founder",
    date: "Jun 2026",
    image: campus,
    credentialUrl: "#"
  }

];