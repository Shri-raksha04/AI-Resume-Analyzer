import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";
import { analyzeResume } from "../services/api";
import Loader from "../components/Loader";
import PrivacyNotice from "../components/PrivacyNotice";

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [saveToHistory, setSaveToHistory] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (selected) => {
    const nextFile = selected?.[0];
    if (!nextFile) return;
    if (!/\.(pdf|docx)$/i.test(nextFile.name)) return setError("Please upload a PDF or DOCX file.");
    setFile(nextFile);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!file) return setError("Resume file is required.");
    if (candidateName.trim().length < 2) return setError("Candidate name is required.");
    if (targetRole.trim().length < 2) return setError("Target role is required for accurate missing-skill analysis.");
    if (!localStorage.getItem("token")) {
      return setError("Please login first, then upload your resume.");
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeResume({ file, candidateName, targetRole, jobDescription, saveToHistory });
      localStorage.setItem("latestAnalysis", JSON.stringify(result));
      setLoading(false);
      navigate("/ats-result", { state: { analysis: result } });
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("latestAnalysis");
        setError("Your login token is invalid or expired. Please login again, then upload your resume.");
        navigate("/login");
        return;
      }
      setError(error.response?.data?.message || error.message || "Backend analysis failed. Please make sure backend is running and try again.");
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Secure AI Upload</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Upload Resume</h1>
        <p className="mt-2 text-slate-400">Send a PDF or DOCX resume to the backend for AI analysis.</p>
      </div>
      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              selectFile(event.dataTransfer.files);
            }}
            className={`flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition duration-300 ${
              dragging ? "border-blue-400 bg-blue-500/15 shadow-inner shadow-blue-500/10" : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-5 text-blue-200 shadow-2xl shadow-blue-950/20">
              <FiUploadCloud className="h-12 w-12" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">Drag and drop resume</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">PDF or DOCX only. The file is sent as FormData to the backend and analyzed securely.</p>
            <label className="mt-6 cursor-pointer rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95">
              Browse File
              <input className="hidden" type="file" accept=".pdf,.docx" onChange={(event) => selectFile(event.target.files)} />
            </label>
            {file && <p className="mt-4 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">{file.name}</p>}
          </div>
        </motion.div>
        <div className="space-y-5">
          <PrivacyNotice />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card space-y-4 p-5">
            <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Candidate name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Target role, e.g. Full Stack Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            <textarea className="focus-ring min-h-40 w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Paste job description for match scoring" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={saveToHistory} onChange={(e) => setSaveToHistory(e.target.checked)} className="h-4 w-4 rounded border-white/20 accent-blue-500" />
              Save this analysis to my history
            </label>
            {error && <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-semibold text-red-200">{error}</p>}
            <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:opacity-95">
              Analyze Resume
            </button>
          </motion.div>
        </div>
      </form>
      {loading && <div className="mt-6"><Loader /></div>}
    </div>
  );
};

export default UploadResume;
