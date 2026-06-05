import { FiAward, FiBriefcase, FiCheckCircle, FiTarget, FiTrendingUp, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScoreCard from "../components/ScoreCard";
import SkillBadge from "../components/SkillBadge";

const getLatest = () => {
  const analysis = JSON.parse(localStorage.getItem("latestAnalysis") || "null");
  if (!analysis || analysis.isFallback || String(analysis.id || "").startsWith("demo-")) {
    return null;
  }
  return analysis;
};

const Dashboard = () => {
  const analysis = getLatest();

  if (!analysis) {
    return (
      <div className="page-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">AI Resume Intelligence</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
            <p className="mt-2 text-slate-400">Resume insights will appear after your first real backend analysis.</p>
          </div>
          <span className="w-fit rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-200">
            Awaiting analysis
          </span>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card relative overflow-hidden p-10 text-center">
          <div className="absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold text-white">No analysis yet</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Upload a resume and run the analyzer to see ATS score, job match, skills found, missing keywords, strength level, and recommended roles.
          </p>
          <Link to="/upload" className="relative mt-7 inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95">
            Analyze Resume
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">AI Resume Intelligence</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">Resume insights focused on readiness, skill fit, and next steps.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
            {analysis.resumeStrength}
          </span>
          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
            {analysis.analysisSource === "gemini" ? "Gemini AI" : "Local ATS scoring"}
          </span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ScoreCard title="Latest ATS Score" value={analysis.atsScore} suffix="%" icon={FiTarget} tone="blue" />
        <ScoreCard title="Latest Job Match Score" value={analysis.jobMatchScore} suffix="%" icon={FiBriefcase} tone="purple" />
        <ScoreCard title="Resume Strength Level" value={analysis.resumeStrength} icon={FiAward} tone="green" />
        <ScoreCard title="Skills Found" value={analysis.skillsFound.length} icon={FiCheckCircle} tone="green" />
        <ScoreCard title="Missing Keywords" value={analysis.missingKeywords.length} icon={FiXCircle} tone="purple" />
        <ScoreCard title="Recommended Roles" value={analysis.recommendedRoles.length} icon={FiTrendingUp} tone="blue" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Skills Found</h2>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">{analysis.skillsFound.length} detected</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.skillsFound.map((skill) => <SkillBadge key={skill} tone="green">{skill}</SkillBadge>)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recommended Roles</h2>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">Role fit</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.recommendedRoles.map((role) => <SkillBadge key={role} tone="blue">{role}</SkillBadge>)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
