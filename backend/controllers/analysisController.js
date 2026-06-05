const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs/promises");
const { extractTextFromResume } = require("../services/resumeParserService");
const { analyzeResumeText } = require("../services/atsService");
const { analyzeResumeWithAI } = require("../services/geminiService");

const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.body;

  if (!resumeId) {
    throw new ApiError("resumeId is required", 400);
  }

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  const resumeText = await extractTextFromResume(resume.filePath);

  if (!resumeText || resumeText.trim().length < 20) {
    throw new ApiError("Could not extract enough text from this resume", 422);
  }

  const analysisResult = await analyzeResumeWithAI({ resumeText, jobDescription: "", targetRole: "" });

  const analysis = await Analysis.findOneAndUpdate(
    { resumeId: resume._id },
    {
      resumeId: resume._id,
      userId: req.user._id,
      ...analysisResult,
      analyzedAt: new Date()
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: "Resume analyzed successfully",
    data: analysis
  });
});

const analyzeResumeUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError("Resume file is required", 400);
  }

  const candidateName = req.body.candidateName || "Candidate";
  const jobDescription = req.body.jobDescription || "";
  const targetRole = req.body.targetRole || "";
  const saveToHistory = req.body.saveToHistory === "true" || req.body.saveToHistory === true;
  const fileType = req.file.originalname.split(".").pop().toLowerCase();

  const resumeText = await extractTextFromResume(req.file.path);

  if (!resumeText || resumeText.trim().length < 20) {
    await deleteUploadedFile(req.file.path);
    throw new ApiError("Could not extract enough text from this resume", 422);
  }

  const analysisResult = await analyzeResumeWithAI({ resumeText, jobDescription, targetRole });
  let resume = null;
  let analysis = null;

  if (saveToHistory) {
    resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType,
      title: `${candidateName} Resume`,
      notes: "Saved from one-step frontend analysis"
    });

    analysis = await Analysis.create({
      resumeId: resume._id,
      userId: req.user._id,
      candidateName,
      jobDescription,
      targetRole,
      ...analysisResult,
      analyzedAt: new Date()
    });
  } else {
    await deleteUploadedFile(req.file.path);
  }

  res.status(200).json({
    success: true,
    message: saveToHistory
      ? "Resume analyzed and saved successfully"
      : "Resume analyzed successfully. File deleted because saveToHistory was false.",
    data: {
      id: analysis?._id || "unsaved-analysis",
      resumeId: resume?._id || null,
      candidateName,
      jobDescription,
      targetRole,
      saveToHistory,
      ...analysisResult,
      analyzedAt: new Date()
    }
  });
});

const getAnalysisHistory = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ analyzedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: analyses.length,
    data: analyses.map(formatAnalysisForFrontend)
  });
});

const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id }).lean();

  if (!analysis) {
    throw new ApiError("Analysis not found", 404);
  }

  res.status(200).json({
    success: true,
    data: formatAnalysisForFrontend(analysis)
  });
});

const deleteAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id });

  if (!analysis) {
    throw new ApiError("Analysis not found", 404);
  }

  const resume = await Resume.findOne({ _id: analysis.resumeId, userId: req.user._id });
  await Analysis.deleteOne({ _id: analysis._id });

  if (resume) {
    await Resume.deleteOne({ _id: resume._id });
    await deleteUploadedFile(resume.filePath);
  }

  res.status(200).json({
    success: true,
    message: "Analysis deleted successfully"
  });
});

const deleteAnalysisHistory = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ userId: req.user._id }).select("resumeId");
  const resumeIds = analyses.map((analysis) => analysis.resumeId).filter(Boolean);
  const resumes = await Resume.find({ _id: { $in: resumeIds }, userId: req.user._id });

  await Analysis.deleteMany({ userId: req.user._id });
  await Resume.deleteMany({ _id: { $in: resumeIds }, userId: req.user._id });

  await Promise.all(resumes.map((resume) => deleteUploadedFile(resume.filePath)));

  res.status(200).json({
    success: true,
    message: "Analysis history deleted successfully",
    deletedAnalyses: analyses.length,
    deletedResumes: resumes.length
  });
});

const deleteSavedResumeFiles = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id });

  await Promise.all(resumes.map((resume) => deleteUploadedFile(resume.filePath)));
  await Resume.updateMany({ userId: req.user._id }, { $set: { filePath: "deleted-by-user" } });

  res.status(200).json({
    success: true,
    message: "Saved resume files deleted successfully",
    deletedFiles: resumes.length
  });
});

const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { analysisId } = req.body;
  let analysis = null;

  if (analysisId && analysisId !== "unsaved-analysis") {
    analysis = await Analysis.findOne({ _id: analysisId, userId: req.user._id });
  }

  const skills = analysis?.skillsFound || [];
  const weakAreas = analysis?.weakAreas || [];
  const questions = {
    technical: [
      {
        question: `Explain how you used ${skills[0] || "your main technology"} in a project.`,
        answer: "Start with the problem, then explain architecture, implementation, challenge, and final result."
      },
      {
        question: "How do you debug an API that is returning incorrect data?",
        answer: "Check request payload, route/controller logic, database query, response mapping, and logs step by step."
      },
      {
        question: "How would you improve resume project quality for a technical interview?",
        answer: "Add architecture, database schema, API details, testing, deployment, and measurable impact."
      }
    ],
    hr: [
      {
        question: "Tell me about yourself.",
        answer: "Give a concise answer covering education, core skills, strongest projects, and target role."
      },
      {
        question: "What are your strengths?",
        answer: "Mention strengths backed by project examples, such as problem-solving, consistency, or learning speed."
      }
    ],
    project: [
      {
        question: `How would you improve your ${weakAreas[0] || "weakest"} section?`,
        answer: "Explain specific changes such as adding keywords, measurable results, stronger bullets, and proof links."
      },
      {
        question: "Walk me through your best project end to end.",
        answer: "Cover requirement, UI, backend, database, authentication, testing, deployment, and one tradeoff."
      }
    ]
  };

  if (analysis) {
    analysis.interviewQuestions = questions;
    await analysis.save();
  }

  res.status(200).json({
    success: true,
    data: questions
  });
});

const getAnalysisByResumeId = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  const analysis = await Analysis.findOne({ resumeId: resume._id });

  if (!analysis) {
    throw new ApiError("Analysis not found for this resume. Run POST /api/analyze first.", 404);
  }

  res.status(200).json({
    success: true,
    data: analysis
  });
});

module.exports = {
  analyzeResume,
  getAnalysisByResumeId,
  analyzeResumeUpload,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysisById,
  deleteAnalysisHistory,
  deleteSavedResumeFiles,
  generateInterviewQuestions
};

const deleteUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not delete uploaded file ${filePath}: ${error.message}`);
    }
  }
};

const formatAnalysisForFrontend = (analysis) => ({
  id: analysis._id,
  resumeId: analysis.resumeId,
  candidateName: analysis.candidateName,
  targetRole: analysis.targetRole,
  atsScore: analysis.atsScore,
  jobMatchScore: analysis.jobMatchScore,
  resumeStrength: analysis.resumeStrength,
  requiredSkills: analysis.requiredSkills || [],
  skillsFound: analysis.skillsFound?.length ? analysis.skillsFound : analysis.detectedSkills,
  matchedSkills: analysis.skillsFound?.length ? analysis.skillsFound : analysis.detectedSkills,
  missingKeywords: analysis.missingKeywords?.length ? analysis.missingKeywords : analysis.missingSkills,
  weakAreas: analysis.weakAreas || [],
  strongAreas: analysis.strongAreas || [],
  sectionScores: analysis.sectionScores || {},
  recommendedRoles: analysis.recommendedRoles || [],
  recommendedSkills: analysis.recommendedSkills || [],
  suggestions: analysis.suggestions || {},
  scoreJustification: analysis.scoreJustification || {},
  interviewQuestions: analysis.interviewQuestions || {},
  analysisSource: analysis.analysisSource || "local-scoring",
  createdAt: analysis.createdAt,
  analyzedAt: analysis.analyzedAt
});
