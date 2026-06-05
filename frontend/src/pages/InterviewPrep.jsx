import { useState } from "react";
import { generateInterviewQuestions } from "../services/api";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { dummyAnalysis } from "../data/dummyData";

const InterviewPrep = () => {
  const analysis = JSON.parse(localStorage.getItem("latestAnalysis") || "null") || dummyAnalysis;
  const [questions, setQuestions] = useState(analysis.interviewQuestions || dummyAnalysis.interviewQuestions);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const result = await generateInterviewQuestions(analysis.id);
    setQuestions(result);
    setLoading(false);
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Interview Readiness</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Interview Prep</h1>
          <p className="mt-2 text-slate-400">Generate technical, HR, and project-based interview questions.</p>
        </div>
        <button onClick={generate} className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95">
          Generate Questions
        </button>
      </div>
      {loading ? <div className="mt-6"><Loader label="Generating interview questions..." /></div> : (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <QuestionGroup title="Technical Questions" items={questions?.technical} />
          <QuestionGroup title="HR Questions" items={questions?.hr} />
          <QuestionGroup title="Project-based Questions" items={questions?.project || questions?.projectBased} />
        </div>
      )}
    </div>
  );
};

const QuestionGroup = ({ title, items = [] }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    <div className="mt-4 space-y-4">
      {items.map((item, index) => (
        <details key={`${item.question}-${index}`} className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-blue-400/30">
          <summary className="cursor-pointer list-none font-bold text-white">
            {item.question || item}
          </summary>
          {item.answer && <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>}
        </details>
      ))}
    </div>
  </motion.div>
);

export default InterviewPrep;
