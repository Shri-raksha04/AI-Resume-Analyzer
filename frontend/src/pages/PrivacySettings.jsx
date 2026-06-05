import { useState } from "react";
import { FiDownload, FiFileMinus, FiLock, FiTrash2 } from "react-icons/fi";
import PrivacyNotice from "../components/PrivacyNotice";
import { deleteAnalysisHistory, deleteSavedResumeFiles } from "../services/api";

const PrivacySettings = () => {
  const [message, setMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const runAction = async (action) => {
    setMessage("");
    setLoadingAction(action);

    try {
      if (action === "history") {
        const confirmed = window.confirm("Delete all saved analysis history? This cannot be undone.");
        if (!confirmed) {
          setLoadingAction("");
          return;
        }
        await deleteAnalysisHistory();
        localStorage.removeItem("latestAnalysis");
        setMessage("Analysis history deleted successfully.");
      }

      if (action === "files") {
        const confirmed = window.confirm("Delete all saved resume files? Analysis records may remain without files.");
        if (!confirmed) {
          setLoadingAction("");
          return;
        }
        await deleteSavedResumeFiles();
        setMessage("Saved resume files deleted successfully.");
      }

      if (action === "export") {
        setMessage("Export is available through the report download button on the ATS Result page.");
      }

      if (action === "storage") {
        setMessage("Resume file storage is already disabled by default unless you choose to save analysis history.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Action failed. Please check backend and try again.");
    } finally {
      setLoadingAction("");
    }
  };

  const options = [
    { title: "Delete my analysis history", icon: FiTrash2, action: "Delete History", key: "history" },
    { title: "Delete saved resume files", icon: FiFileMinus, action: "Delete Files", key: "files" },
    { title: "Export my analysis data", icon: FiDownload, action: "Export Data", key: "export" },
    { title: "Disable resume file storage", icon: FiLock, action: "Disable Storage", key: "storage" }
  ];

  return (
    <div className="page-shell">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Security Controls</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Privacy Settings</h1>
      <p className="mt-2 text-slate-400">Control saved analysis data and resume storage preferences.</p>
      <div className="mt-6">
        <PrivacyNotice />
      </div>
      {message && (
        <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm font-semibold text-blue-100">
          {message}
        </div>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {options.map(({ title, icon: Icon, action, key }) => (
          <div key={title} className="card flex items-center justify-between gap-4 p-5 transition hover:-translate-y-1 hover:border-blue-400/30">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-3 text-blue-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-white">{title}</h2>
            </div>
            <button
              onClick={() => runAction(key)}
              disabled={loadingAction === key}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 disabled:opacity-60"
            >
              {loadingAction === key ? "Working..." : action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacySettings;
