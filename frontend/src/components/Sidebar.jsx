import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiClock,
  FiFileText,
  FiLock,
  FiMessageSquare,
  FiUser,
  FiUploadCloud,
  FiX,
  FiZap
} from "react-icons/fi";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiActivity },
  { to: "/upload", label: "Upload Resume", icon: FiUploadCloud },
  { to: "/ats-result", label: "ATS Result", icon: FiBarChart2 },
  { to: "/job-match", label: "Job Match", icon: FiBriefcase },
  { to: "/ai-suggestions", label: "AI Suggestions", icon: FiZap },
  { to: "/interview-prep", label: "Interview Prep", icon: FiMessageSquare },
  { to: "/history", label: "History", icon: FiClock },
  { to: "/privacy", label: "Privacy Settings", icon: FiLock }
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={onClose} />}
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0b1120]/95 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3 text-lg font-bold text-white">
          <span className="rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 p-2.5 shadow-lg shadow-blue-500/20">
            <FiFileText className="h-5 w-5 text-white" />
          </span>
          <div>
            <p>Resume AI</p>
            <p className="text-xs font-semibold text-slate-400">Analyzer Suite</p>
          </div>
        </div>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden" onClick={onClose} aria-label="Close menu">
          <FiX className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-semibold transition duration-200 ${
                isActive ? "bg-blue-500/15 text-white shadow-lg shadow-blue-950/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="sidebar-active" className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-blue-400" />}
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-300" : "text-slate-500 group-hover:text-blue-300"}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 text-white">
            <FiUser className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">User Profile</p>
            <p className="truncate text-xs text-slate-400">Secure workspace</p>
          </div>
        </div>
      </div>
    </aside>
  </>
);

export default Sidebar;
