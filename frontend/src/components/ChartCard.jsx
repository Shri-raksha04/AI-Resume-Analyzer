const ChartCard = ({ title, children }) => (
  <div className="card p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
    </div>
    <div className="mt-4 h-72">{children}</div>
  </div>
);

export default ChartCard;
