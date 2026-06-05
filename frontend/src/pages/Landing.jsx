import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBarChart2, FiBriefcase, FiCheckCircle, FiLock, FiMessageCircle, FiZap } from "react-icons/fi";
import PrivacyNotice from "../components/PrivacyNotice";

const features = [
  { title: "ATS Score", icon: FiBarChart2, text: "Understand how well your resume passes screening systems." },
  { title: "Job Match", icon: FiBriefcase, text: "Compare your resume against a target job description." },
  { title: "Skill Gap Analysis", icon: FiCheckCircle, text: "See matched skills and missing keywords clearly." },
  { title: "AI Suggestions", icon: FiZap, text: "Get prioritized improvements for stronger applications." },
  { title: "Interview Prep", icon: FiMessageCircle, text: "Generate technical, HR, and project-based questions." },
  { title: "Privacy First", icon: FiLock, text: "Choose when analysis should be saved to your history." }
];

const Landing = () => (
  <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(180deg,#ffffff,#f7f9fc)]">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <div className="text-xl font-extrabold text-slate-950">AI Resume Analyzer</div>
      <Link to="/login" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
        Login
      </Link>
    </nav>
    <section className="page-shell grid min-h-[calc(100vh-88px)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Portfolio-ready resume intelligence</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
          AI Resume Analyzer
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Analyze resumes for ATS readiness, job fit, missing skills, AI improvements, and interview preparation in one clean dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/upload" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
            Analyze Resume
          </Link>
          <Link to="/login" className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
            Login
          </Link>
        </div>
        <div className="mt-8 max-w-2xl">
          <PrivacyNotice />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="grid gap-4 sm:grid-cols-2">
        {features.map(({ title, icon: Icon, text }) => (
          <div key={title} className="card p-5">
            <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </motion.div>
    </section>
  </main>
);

export default Landing;
