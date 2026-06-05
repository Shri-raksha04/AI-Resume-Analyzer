import jsPDF from "jspdf";

const asList = (value) => (Array.isArray(value) ? value : []);

export const downloadAnalysisReport = (analysis) => {
  const doc = new jsPDF();
  const left = 16;
  let y = 18;

  const addSection = (title, lines = []) => {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, left, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    asList(lines).forEach((line) => {
      y += 7;
      const wrapped = doc.splitTextToSize(String(line), 178);
      doc.text(wrapped, left, y);
      y += Math.max(0, wrapped.length - 1) * 5;
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
    });
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Resume Analyzer Report", left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 10;
  doc.text(`Candidate: ${analysis.candidateName || "Candidate"}`, left, y);
  y += 7;
  doc.text(`ATS Score: ${analysis.atsScore ?? 0}%`, left, y);
  y += 7;
  doc.text(`Job Match Score: ${analysis.jobMatchScore ?? 0}%`, left, y);

  addSection("Skills Found", asList(analysis.skillsFound));
  addSection("Missing Skills", asList(analysis.missingKeywords));
  addSection("AI Suggestions", [
    ...asList(analysis.suggestions?.high),
    ...asList(analysis.suggestions?.medium),
    ...asList(analysis.suggestions?.low)
  ]);
  addSection("Recommended Roles", asList(analysis.recommendedRoles));

  doc.save(`${analysis.candidateName || "resume"}-analysis-report.pdf`);
};
