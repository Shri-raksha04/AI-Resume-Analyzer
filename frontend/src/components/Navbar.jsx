import { FiBell, FiLogOut, FiMenu, FiMoon, FiSearch, FiShield } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenu }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("latestAnalysis");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1120]/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-slate-300 hover:bg-white/5 lg:hidden" onClick={onMenu} aria-label="Open menu">
            <FiMenu className="h-6 w-6" />
          </button>
          <Link to="/dashboard" className="hidden items-center gap-2 font-bold text-white sm:flex">
            <span className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 p-2.5 text-white shadow-lg shadow-blue-500/20">
              <FiShield className="h-4 w-4" />
            </span>
            AI Resume Analyzer
          </Link>
        </div>
        <div className="hidden max-w-xl flex-1 md:block">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-400">
            <FiSearch className="h-4 w-4" />
            <input className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0" placeholder="Search reports, skills, roles..." />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300 sm:inline-flex">
            <FiMoon className="h-4 w-4 text-blue-300" />
            Dark
          </span>
          <button className="relative rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 hover:bg-white/10" aria-label="Notifications">
            <FiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-extrabold text-white">
            U
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
