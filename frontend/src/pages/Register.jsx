import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await registerUser(form);
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Try a different email or check backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30rem)] px-4">
      <form onSubmit={submit} className="card w-full max-w-md p-7">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">Secure Onboarding</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-400">Start analyzing resumes securely.</p>
        <div className="mt-6 space-y-4">
          <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="focus-ring w-full rounded-xl border border-white/10 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-semibold text-red-200">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 disabled:opacity-70">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered? <Link className="font-bold text-blue-300" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
