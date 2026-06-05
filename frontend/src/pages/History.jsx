import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { deleteAnalysis, fetchAnalysisHistory } from "../services/api";

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysisHistory().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const remove = async (id) => {
    await deleteAnalysis(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Saved Reports</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Analysis History</h1>
          <p className="mt-2 text-slate-400">Only analyses saved by user choice appear here.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-400">
          <FiSearch className="h-4 w-4" />
          <input className="w-64 border-0 bg-transparent p-0 text-sm focus:ring-0" placeholder="Search saved analyses..." />
        </div>
      </div>
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-white/[0.03] text-sm text-slate-400">
              <tr>
                <th className="px-5 py-4">Candidate</th>
                <th className="px-5 py-4">ATS Score</th>
                <th className="px-5 py-4">Job Match</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td className="px-5 py-6 text-slate-500" colSpan="5">Loading history...</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-4 font-semibold text-slate-900">{item.candidateName}</td>
                  <td className="px-5 py-4">{item.atsScore}%</td>
                  <td className="px-5 py-4">{item.jobMatchScore}%</td>
                  <td className="px-5 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2 px-5 py-4">
                    <Link to="/ats-result" onClick={() => localStorage.setItem("latestAnalysis", JSON.stringify(item))} className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-bold text-blue-200">
                      View report
                    </Link>
                    <button onClick={() => remove(item.id)} className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
