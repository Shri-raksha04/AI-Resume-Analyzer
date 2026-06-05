import { motion } from "framer-motion";

const ScoreCard = ({ title, value, icon: Icon, tone = "blue", suffix = "", description }) => {
  const tones = {
    blue: "from-blue-500 to-cyan-400 text-blue-300 bg-blue-500/10",
    purple: "from-violet-500 to-fuchsia-400 text-violet-300 bg-violet-500/10",
    green: "from-emerald-500 to-teal-400 text-emerald-300 bg-emerald-500/10"
  };
  const toneClass = tones[tone] || tones.blue;
  const [gradient, iconTone] = [toneClass.split(" ").slice(0, 2).join(" "), toneClass.split(" ").slice(2).join(" ")];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card group relative overflow-hidden p-5"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-violet-500/20" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-400">{title}</p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            {value}
            {suffix}
          </motion.p>
          {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
        </div>
        {Icon && (
          <div className={`rounded-2xl border border-white/10 p-3 ${iconTone}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScoreCard;
