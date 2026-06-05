const express = require("express");
const {
  analyzeResume,
  getAnalysisByResumeId,
  analyzeResumeUpload,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysisById,
  deleteAnalysisHistory,
  deleteSavedResumeFiles,
  generateInterviewQuestions
} = require("../controllers/analysisController");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/analyze-resume", uploadResume.single("resume"), analyzeResumeUpload);
router.get("/analysis-history", getAnalysisHistory);
router.delete("/analysis-history", deleteAnalysisHistory);
router.delete("/resume-files", deleteSavedResumeFiles);
router.post("/generate-interview-questions", generateInterviewQuestions);
router.get("/analysis/:id", getAnalysisById);
router.delete("/analysis/:id", deleteAnalysisById);
router.post("/", analyzeResume);
router.get("/:id", getAnalysisByResumeId);

module.exports = router;
