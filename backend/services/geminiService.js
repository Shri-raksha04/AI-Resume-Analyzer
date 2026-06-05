const ApiError = require("../utils/apiError");
const { analyzeResumeText } = require("./atsService");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const extractJson = (text) => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini did not return JSON");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
};

const normalizeScore = (value) => {
  const score = Number(value);
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
};

const normalizeSuggestions = (suggestions) => ({
  high: normalizeArray(suggestions?.high),
  medium: normalizeArray(suggestions?.medium),
  low: normalizeArray(suggestions?.low)
});

const normalizeQuestions = (questions) => ({
  technical: Array.isArray(questions?.technical) ? questions.technical : [],
  hr: Array.isArray(questions?.hr) ? questions.hr : [],
  project: Array.isArray(questions?.project) ? questions.project : []
});

const normalizeJustification = (justification, fallbackAnalysis) => ({
  atsScore: justification?.atsScore || fallbackAnalysis.scoreJustification?.atsScore || "",
  jobMatchScore: justification?.jobMatchScore || fallbackAnalysis.scoreJustification?.jobMatchScore || "",
  sectionScores: {
    Skills: justification?.sectionScores?.Skills || fallbackAnalysis.scoreJustification?.sectionScores?.Skills || "",
    Education: justification?.sectionScores?.Education || fallbackAnalysis.scoreJustification?.sectionScores?.Education || "",
    Experience: justification?.sectionScores?.Experience || fallbackAnalysis.scoreJustification?.sectionScores?.Experience || "",
    Projects: justification?.sectionScores?.Projects || fallbackAnalysis.scoreJustification?.sectionScores?.Projects || "",
    Certifications: justification?.sectionScores?.Certifications || fallbackAnalysis.scoreJustification?.sectionScores?.Certifications || ""
  },
  missingSkills: justification?.missingSkills || fallbackAnalysis.scoreJustification?.missingSkills || "",
  strengths: justification?.strengths || fallbackAnalysis.scoreJustification?.strengths || "",
  improvements: justification?.improvements || fallbackAnalysis.scoreJustification?.improvements || ""
});

const normalizeGeminiAnalysis = (aiAnalysis, fallbackAnalysis) => {
  const sectionScores = {
    Skills: normalizeScore(aiAnalysis.sectionScores?.Skills ?? fallbackAnalysis.sectionScores.Skills),
    Education: normalizeScore(aiAnalysis.sectionScores?.Education ?? fallbackAnalysis.sectionScores.Education),
    Experience: normalizeScore(aiAnalysis.sectionScores?.Experience ?? fallbackAnalysis.sectionScores.Experience),
    Projects: normalizeScore(aiAnalysis.sectionScores?.Projects ?? fallbackAnalysis.sectionScores.Projects),
    Certifications: normalizeScore(aiAnalysis.sectionScores?.Certifications ?? fallbackAnalysis.sectionScores.Certifications)
  };

  return {
    ...fallbackAnalysis,
    atsScore: normalizeScore(aiAnalysis.atsScore ?? fallbackAnalysis.atsScore),
    jobMatchScore: normalizeScore(aiAnalysis.jobMatchScore ?? fallbackAnalysis.jobMatchScore),
    resumeStrength: aiAnalysis.resumeStrength || fallbackAnalysis.resumeStrength,
    requiredSkills: normalizeArray(aiAnalysis.requiredSkills).length ? normalizeArray(aiAnalysis.requiredSkills) : fallbackAnalysis.requiredSkills,
    skillsFound: normalizeArray(aiAnalysis.skillsFound).length ? normalizeArray(aiAnalysis.skillsFound) : fallbackAnalysis.skillsFound,
    matchedSkills: normalizeArray(aiAnalysis.skillsFound).length ? normalizeArray(aiAnalysis.skillsFound) : fallbackAnalysis.skillsFound,
    detectedSkills: normalizeArray(aiAnalysis.skillsFound).length ? normalizeArray(aiAnalysis.skillsFound) : fallbackAnalysis.detectedSkills,
    missingKeywords: normalizeArray(aiAnalysis.missingKeywords).length ? normalizeArray(aiAnalysis.missingKeywords) : fallbackAnalysis.missingKeywords,
    weakAreas: normalizeArray(aiAnalysis.weakAreas),
    strongAreas: normalizeArray(aiAnalysis.strongAreas),
    sectionScores,
    recommendedRoles: normalizeArray(aiAnalysis.recommendedRoles).length ? normalizeArray(aiAnalysis.recommendedRoles) : fallbackAnalysis.recommendedRoles,
    recommendedSkills: normalizeArray(aiAnalysis.recommendedSkills).length ? normalizeArray(aiAnalysis.recommendedSkills) : fallbackAnalysis.recommendedSkills,
    suggestions: normalizeSuggestions(aiAnalysis.suggestions),
    scoreJustification: normalizeJustification(aiAnalysis.scoreJustification, fallbackAnalysis),
    interviewQuestions: normalizeQuestions(aiAnalysis.interviewQuestions),
    analysisSource: "gemini"
  };
};

const buildPrompt = ({ resumeText, jobDescription, targetRole, fallbackAnalysis }) => `
You are a strict senior technical recruiter and ATS evaluator.
Analyze this resume against the target job description.

Rules:
- Return ONLY valid JSON. No markdown.
- Do not invent skills, projects, experience, certifications, links, or achievements.
- A skill is "found" only if it appears in the resume text or an unmistakable alias appears.
- Scores must be honest. Do not give 100 unless the section is excellent with clear evidence.
- Certifications should score high only when real certificate/course names, issuer/platform, and date/year are present.
- Experience should score high only when it has role/internship details, dates, responsibilities, impact, and tools.
- Projects should score high only when it has enough description, technologies, implementation detail, and proof/links.

Local pre-analysis for reference:
${JSON.stringify(fallbackAnalysis, null, 2)}

Return this exact JSON shape:
{
  "atsScore": 0,
  "jobMatchScore": 0,
  "resumeStrength": "Needs Improvement | Moderate | Strong",
  "requiredSkills": [],
  "skillsFound": [],
  "missingKeywords": [],
  "weakAreas": [],
  "strongAreas": [],
  "sectionScores": {
    "Skills": 0,
    "Education": 0,
    "Experience": 0,
    "Projects": 0,
    "Certifications": 0
  },
  "recommendedRoles": [],
  "recommendedSkills": [],
  "scoreJustification": {
    "atsScore": "Explain why this ATS score was assigned and what is needed to improve it.",
    "jobMatchScore": "Explain why this job match score was assigned, including matched and missing job skills.",
    "sectionScores": {
      "Skills": "Explain the skills score.",
      "Education": "Explain the education score.",
      "Experience": "Explain the experience score.",
      "Projects": "Explain the projects score.",
      "Certifications": "Explain the certifications score."
    },
    "missingSkills": "List missed skills if any and explain what should be added truthfully.",
    "strengths": "Explain strongest evidence in the resume.",
    "improvements": "Explain what is needed next."
  },
  "suggestions": {
    "high": [],
    "medium": [],
    "low": []
  },
  "interviewQuestions": {
    "technical": [{ "question": "", "answer": "" }],
    "hr": [{ "question": "", "answer": "" }],
    "project": [{ "question": "", "answer": "" }]
  }
}

Target job description:
${jobDescription || "No specific job description provided."}

Target role:
${targetRole || "No target role provided."}

Resume text:
${resumeText.slice(0, 18000)}
`;

const analyzeResumeWithAI = async ({ resumeText, jobDescription, targetRole }) => {
  const fallbackAnalysis = {
    ...analyzeResumeText(resumeText, jobDescription, targetRole),
    analysisSource: "local-scoring"
  };

  if (!process.env.GEMINI_API_KEY) {
    return fallbackAnalysis;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt({ resumeText, jobDescription, targetRole, fallbackAnalysis }) }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn(`Gemini analysis failed: ${response.status} ${body}`);
    return fallbackAnalysis;
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new ApiError("Gemini returned an empty analysis", 502);
  }

  try {
    return normalizeGeminiAnalysis(extractJson(text), fallbackAnalysis);
  } catch (error) {
    console.warn(`Gemini JSON parsing failed: ${error.message}`);
    return fallbackAnalysis;
  }
};

module.exports = { analyzeResumeWithAI };
