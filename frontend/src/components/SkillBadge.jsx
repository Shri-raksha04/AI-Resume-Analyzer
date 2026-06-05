const SkillBadge = ({ children, tone = "blue" }) => {
  const tones = {
    blue: "border-blue-400/20 bg-blue-500/10 text-blue-200",
    green: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    red: "border-red-400/20 bg-red-500/10 text-red-200",
    purple: "border-violet-400/20 bg-violet-500/10 text-violet-200",
    slate: "border-white/10 bg-white/[0.04] text-slate-300"
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold shadow-sm backdrop-blur ${tones[tone]}`}>
      {children}
    </span>
  );
};

export default SkillBadge;
