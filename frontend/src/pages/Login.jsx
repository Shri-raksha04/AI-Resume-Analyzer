import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await loginUser(form);
      navigate(location.state?.from || "/dashboard");
    } catch {
      setError("Login failed. Check credentials or backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_34rem),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_30rem)] px-4">
      <form onSubmit={submit} className="card w-full max-w-md p-7">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Secure Access</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-400">Access your resume analysis workspace.</p>
        <div className="mt-6 space-y-4">
          <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-semibold text-red-200">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 disabled:opacity-70">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          New here? <Link className="font-bold text-blue-300" to="/register">Create account</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
