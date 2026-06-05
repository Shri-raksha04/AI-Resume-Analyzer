import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import { dummyAnalysis } from "../data/dummyData";

const groups = [
  { key: "high", title: "High Priority", icon: FiAlertCircle, style: "border-red-400/20 bg-red-500/10 text-red-200" },
  { key: "medium", title: "Medium Priority", icon: FiInfo, style: "border-violet-400/20 bg-violet-500/10 text-violet-200" },
  { key: "low", title: "Low Priority", icon: FiCheckCircle, style: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" }
];

const AISuggestions = () => {
  const analysis = JSON.parse(localStorage.getItem("latestAnalysis") || "null") || dummyAnalysis;
  const suggestions = analysis.suggestions || dummyAnalysis.suggestions;

  return (
    <div className="page-shell">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Recommendation Engine</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">AI Suggestions</h1>
      <p className="mt-2 text-slate-400">Prioritized Gemini-style recommendations for stronger resume impact.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {groups.map(({ key, title, icon: Icon, style }) => (
          <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="card p-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold ${style}`}>
              <Icon className="h-4 w-4" />
              {title}
            </div>
            <div className="mt-4 space-y-3">
              {(suggestions[key] || []).map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300 transition hover:border-blue-400/30">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;
