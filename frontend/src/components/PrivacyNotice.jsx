import { FiShield } from "react-icons/fi";

const PrivacyNotice = ({ compact = false }) => (
  <div className={`rounded-2xl border border-emerald-400/20 bg-emerald-500/10 shadow-lg shadow-emerald-950/10 backdrop-blur ${compact ? "p-3" : "p-4"}`}>
    <div className="flex items-start gap-3">
      <FiShield className="mt-0.5 h-5 w-5 flex-none text-emerald-300" />
      <p className={`${compact ? "text-sm" : "text-base"} font-medium text-emerald-100`}>
        Your resume is used only for analysis. Uploaded files are deleted after analysis unless you choose to save them.
      </p>
    </div>
  </div>
);

export default PrivacyNotice;
