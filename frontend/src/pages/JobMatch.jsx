import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import SkillBadge from "../components/SkillBadge";
import ChartCard from "../components/ChartCard";
import { dummyAnalysis } from "../data/dummyData";

const JobMatch = () => {
  const analysis = JSON.parse(localStorage.getItem("latestAnalysis") || "null") || dummyAnalysis;
  const matched = analysis.skillsFound.length;
  const missing = analysis.missingKeywords.length;
  const pieData = [
    { name: "Matched", value: matched },
    { name: "Missing", value: missing }
  ];
  const sectionData = Object.entries(analysis.sectionScores || {}).map(([name, score]) => ({ name, score }));

  return (
    <div className="page-shell">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">Role Fit Analytics</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Job Match</h1>
      <p className="mt-2 text-slate-400">Skill fit and role recommendations based on the target job description.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Matched vs Missing Skills">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                <Cell fill="#10b981" />
                <Cell fill="#f43f5e" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Section-wise Score">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <BadgePanel title="Required Skills Found" items={analysis.skillsFound} tone="green" />
        <BadgePanel title="Missing Skills" items={analysis.missingKeywords} tone="red" />
        <BadgePanel title="Recommended Skills To Learn" items={analysis.recommendedSkills} tone="purple" />
        <BadgePanel title="Suitable Job Roles" items={analysis.recommendedRoles} tone="blue" />
      </div>
    </div>
  );
};

const BadgePanel = ({ title, items, tone }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className="card p-5">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {(items || []).map((item) => <SkillBadge key={item} tone={tone}>{item}</SkillBadge>)}
    </div>
  </motion.div>
);

export default JobMatch;
