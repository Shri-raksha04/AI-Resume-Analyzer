const express = require("express");
const {
  uploadResume,
  getResumeHistory,
  getResumeById,
  updateResume,
  deleteResume
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume: uploadResumeMiddleware } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/upload", uploadResumeMiddleware.single("resume"), uploadResume);
router.get("/history", getResumeHistory);
router.get("/:id", getResumeById);
router.patch("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
