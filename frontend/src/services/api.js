import axios from "axios";
import { dummyAnalysis, dummyHistory } from "../data/dummyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeAnalysis = (payload) => {
  const data = payload?.data || payload?.analysis || payload || {};
  const sectionScores = data.sectionScores || data.sectionWiseScore || {
    Skills: data.skillsScore || 0,
    Education: data.educationScore || 0,
    Experience: data.experienceScore || 0,
    Projects: data.projectsScore || 0,
    Certifications: data.certificationsScore || 0
  };

  return {
    id: data.id || data._id || data.analysisId || "latest-analysis",
    candidateName: data.candidateName || data.name || "Candidate",
    atsScore: Number(data.atsScore ?? data.overallAtsScore ?? 0),
    jobMatchScore: Number(data.jobMatchScore ?? data.matchScore ?? 0),
    resumeStrength: data.resumeStrength || data.strengthLevel || "Moderate",
    requiredSkills: data.requiredSkills || [],
    skillsFound: data.skillsFound || data.matchedSkills || data.detectedSkills || [],
    missingKeywords: data.missingKeywords || data.missingSkills || [],
    weakAreas: data.weakAreas || [],
    strongAreas: data.strongAreas || [],
    sectionScores,
    recommendedRoles: data.recommendedRoles || data.suitableJobRoles || [],
    recommendedSkills: data.recommendedSkills || [],
    suggestions: data.suggestions || { high: [], medium: [], low: [] },
    scoreJustification: data.scoreJustification || {},
    interviewQuestions: data.interviewQuestions || data.questions || null,
    analysisSource: data.analysisSource || "local-scoring",
    createdAt: data.createdAt || data.analyzedAt || new Date().toISOString()
  };
};

const markFallback = (fallback) => {
  if (Array.isArray(fallback)) {
    return fallback.map((item) => ({ ...item, isFallback: true }));
  }
  return { ...fallback, isFallback: true };
};

const withFallback = async (request, fallback) => {
  try {
    return await request();
  } catch (error) {
    console.warn("Backend unavailable or returned an error. Using fallback data.", error.message);
    return markFallback(fallback);
  }
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const token = response.data?.token || response.data?.data?.token;
  if (token) localStorage.setItem("token", token);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  const token = response.data?.token || response.data?.data?.token;
  if (token) localStorage.setItem("token", token);
  return response.data;
};

export const analyzeResume = async ({ file, candidateName, targetRole, jobDescription, saveToHistory }) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("candidateName", candidateName);
  formData.append("targetRole", targetRole);
  formData.append("jobDescription", jobDescription);
  formData.append("saveToHistory", String(Boolean(saveToHistory)));

  const response = await api.post("/analyze-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return normalizeAnalysis(response.data);
};

export const fetchAnalysisHistory = async () => {
  return withFallback(async () => {
    const response = await api.get("/analysis-history");
    const list = response.data?.data || response.data?.history || response.data || [];
    return Array.isArray(list) ? list.map(normalizeAnalysis) : [];
  }, dummyHistory);
};

export const fetchAnalysisById = async (id) => {
  return withFallback(async () => {
    const response = await api.get(`/analysis/${id}`);
    return normalizeAnalysis(response.data);
  }, dummyHistory.find((item) => item.id === id) || dummyAnalysis);
};

export const deleteAnalysis = async (id) => {
  return withFallback(async () => {
    const response = await api.delete(`/analysis/${id}`);
    return response.data;
  }, { success: true });
};

export const deleteAnalysisHistory = async () => {
  const response = await api.delete("/analysis-history");
  return response.data;
};

export const deleteSavedResumeFiles = async () => {
  const response = await api.delete("/resume-files");
  return response.data;
};

export const generateInterviewQuestions = async (analysisId) => {
  return withFallback(async () => {
    const response = await api.post("/generate-interview-questions", { analysisId });
    return response.data?.data || response.data?.questions || response.data;
  }, dummyAnalysis.interviewQuestions);
};
