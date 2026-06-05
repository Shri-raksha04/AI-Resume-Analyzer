const fs = require("fs/promises");
const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { validateResumeMetadata } = require("../utils/validators");

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError("Resume file is required", 400);
  }

  validateResumeMetadata(req.body);

  const fileType = req.file.originalname.split(".").pop().toLowerCase();
  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileType,
    title: req.body.title,
    notes: req.body.notes
  });

  res.status(201).json({
    success: true,
    message: "Resume uploaded successfully",
    data: resume
  });
});

const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .sort({ uploadedAt: -1 })
    .lean();

  const resumeIds = resumes.map((resume) => resume._id);
  const analyses = await Analysis.find({ resumeId: { $in: resumeIds } }).lean();
  const analysisByResumeId = new Map(analyses.map((analysis) => [analysis.resumeId.toString(), analysis]));

  const data = resumes.map((resume) => ({
    ...resume,
    analysis: analysisByResumeId.get(resume._id.toString()) || null
  }));

  res.status(200).json({
    success: true,
    count: data.length,
    data
  });
});

const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  res.status(200).json({
    success: true,
    data: resume
  });
});

const updateResume = asyncHandler(async (req, res) => {
  validateResumeMetadata(req.body);

  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      title: req.body.title,
      notes: req.body.notes
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Resume metadata updated successfully",
    data: resume
  });
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  await Analysis.deleteOne({ resumeId: resume._id });
  await Resume.deleteOne({ _id: resume._id });

  try {
    await fs.unlink(resume.filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not delete uploaded file ${resume.filePath}: ${error.message}`);
    }
  }

  res.status(200).json({
    success: true,
    message: "Resume and related analysis deleted successfully"
  });
});

module.exports = {
  uploadResume,
  getResumeHistory,
  getResumeById,
  updateResume,
  deleteResume
};
