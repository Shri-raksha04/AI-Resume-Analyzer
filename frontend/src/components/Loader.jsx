import { motion } from "framer-motion";

const Loader = ({ label = "Analyzing resume..." }) => (
  <div className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-blue-400/30 bg-blue-500/10 p-8 shadow-2xl shadow-blue-950/20 backdrop-blur">
    <div className="flex gap-2">
      {[0, 1, 2].map((item) => (
        <motion.span
          key={item}
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: item * 0.12 }}
          className="h-3 w-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/30"
        />
      ))}
    </div>
    <p className="text-sm font-semibold text-blue-100">{label}</p>
  </div>
);

export default Loader;
