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
  resume: "/241210049_Jitarth.pdf"
};

export const navItems = ["Home", "About", "Skills", "Projects", "Experience", "Contact"];

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
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Figma","Cursor","Devin"] }
];
import image from "./comingsoon.png";
export const projects = [
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
    title: "Smart Waste Management System",
    description:
      "A web Application where citizens can report waste issues and track collection status.",
    tech: ["Python Flask", "React.JS","SQL-Persistent","Fast-API","Docker"],
    github: "https://github.com/Jitarth-web/SwachhCity",
    live: image
  },
  {
    title: "SoundWave-AI",
    description:
      "An AI-powered music recommendation system that analyzes user preferences and generates personalized playlists.",
    tech: ["React.JS","Node.JS","MongoDB"],
    github: "https://github.com/ka0-0/Soundwave_AI",
    live: "https://soundwave-ai-ioik.vercel.app"
  }
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
