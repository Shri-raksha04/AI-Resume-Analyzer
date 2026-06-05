const ProgressCircle = ({ value = 0, size = 132, label = "Score", color = "#3B82F6" }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${label} ${safeValue}%`}>
        <defs>
          <linearGradient id={`score-gradient-${label.replace(/\s+/g, "-")}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id={`glow-${label.replace(/\s+/g, "-")}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="rgba(15, 23, 42, 0.72)" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#score-gradient-${label.replace(/\s+/g, "-")})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          filter={`url(#glow-${label.replace(/\s+/g, "-")})`}
        />
        <text x="60" y="57" textAnchor="middle" className="fill-white text-2xl font-bold">
          {safeValue}
        </text>
        <text x="60" y="76" textAnchor="middle" className="fill-slate-400 text-xs font-semibold">
          %
        </text>
      </svg>
      <span className="text-sm font-semibold text-slate-300">{label}</span>
    </div>
  );
};

export default ProgressCircle;
