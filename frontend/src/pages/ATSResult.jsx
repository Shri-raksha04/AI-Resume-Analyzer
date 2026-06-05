import { Link, useLocation } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import ProgressCircle from "../components/ProgressCircle";
import SkillBadge from "../components/SkillBadge";
import ChartCard from "../components/ChartCard";
import { downloadAnalysisReport } from "../utils/downloadReport";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const isDemoOrFallback = (analysis) => {
  if (!analysis) return false;
  return analysis.isFallback || String(analysis.id || "").startsWith("demo-") || analysis.candidateName === "Demo Candidate";
};

const getAnalysis = (state) => {
  if (state?.analysis && !isDemoOrFallback(state.analysis)) return state.analysis;

  const savedAnalysis = JSON.parse(localStorage.getItem("latestAnalysis") || "null");
  if (isDemoOrFallback(savedAnalysis)) {
    localStorage.removeItem("latestAnalysis");
    return null;
  }

  return savedAnalysis;
};

const ATSResult = () => {
  const { state } = useLocation();
  const analysis = getAnalysis(state);

  if (!analysis || isDemoOrFallback(analysis)) {
    localStorage.removeItem("latestAnalysis");
    return (
      <div className="page-shell">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-extrabold text-white">No real analysis found</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Upload and analyze your resume first. This page will only show matched skills after the backend returns a real analysis for your CV.
          </p>
          <Link to="/upload" className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95">
            Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  const sectionData = Object.entries(analysis.sectionScores || {}).map(([name, score]) => ({ name, score }));

  return (
    <div className="page-shell">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Resume Intelligence Report</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">ATS Result</h1>
          <p className="mt-2 text-slate-400">Detailed resume readiness report for {analysis.candidateName}.</p>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Analysis engine: {analysis.analysisSource === "gemini" ? "Gemini AI" : "Local ATS scoring"}
          </p>
        </div>
        <button onClick={() => downloadAnalysisReport(analysis)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95">
          <FiDownload className="h-4 w-4" />
          Download Report
        </button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card relative flex flex-col items-center justify-center gap-6 overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_60%)]" />
          <div className="relative flex flex-col items-center gap-6">
          <ProgressCircle value={analysis.atsScore} label="Overall ATS Score" color="#2563eb" />
          <ProgressCircle value={analysis.jobMatchScore} label="Job Match Score" color="#7c3aed" />
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
            Strength: {analysis.resumeStrength}
          </div>
          </div>
        </motion.div>
        <ChartCard title="Section-wise Score">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card mt-6 p-5">
        <h2 className="text-lg font-bold text-white">Score Justification</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <JustificationItem title="ATS Score" text={analysis.scoreJustification?.atsScore} />
          <JustificationItem title="Job Match Score" text={analysis.scoreJustification?.jobMatchScore} />
          <JustificationItem title="Missing Skills" text={analysis.scoreJustification?.missingSkills} />
          <JustificationItem title="Needed Improvements" text={analysis.scoreJustification?.improvements} />
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-bold text-white">Section-wise Reasoning</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {Object.entries(analysis.scoreJustification?.sectionScores || {}).map(([section, reason]) => (
              <p key={section}>
                <span className="font-bold text-slate-800">{section}:</span> {reason}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ListCard title="Required Skills for This Role" items={analysis.requiredSkills} tone="purple" emptyText="Paste a job description during upload to see required role skills." />
        <ListCard title="Matched Skills" items={analysis.skillsFound} tone="green" emptyText="No matched skills returned." />
        <ListCard title="Missing Keywords" items={analysis.missingKeywords} tone="red" emptyText="No missing keywords returned." />
        <ListCard title="Strong Areas" items={analysis.strongAreas} tone="blue" emptyText="No strong areas returned." />
        <ListCard title="Weak Areas" items={analysis.weakAreas} tone="purple" emptyText="No weak areas returned." />
      </div>
    </div>
  );
};

const ListCard = ({ title, items, tone, emptyText }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className="card p-5">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {(items || []).length > 0
        ? items.map((item) => <SkillBadge key={item} tone={tone}>{item}</SkillBadge>)
        : <p className="text-sm font-medium text-slate-500">{emptyText}</p>}
    </div>
  </motion.div>
);

const JustificationItem = ({ title, text }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <h3 className="font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600">{text || "No explanation returned for this score."}</p>
  </div>
);

export default ATSResult;
