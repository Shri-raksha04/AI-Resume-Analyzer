const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    candidateName: {
      type: String,
      trim: true,
      default: "Candidate"
    },
    jobDescription: {
      type: String,
      trim: true,
      default: ""
    },
    targetRole: {
      type: String,
      trim: true,
      default: ""
    },
    jobMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    resumeStrength: {
      type: String,
      default: "Moderate"
    },
    analysisSource: {
      type: String,
      enum: ["gemini", "local-scoring"],
      default: "local-scoring"
    },
    skillsFound: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    weakAreas: {
      type: [String],
      default: []
    },
    strongAreas: {
      type: [String],
      default: []
    },
    recommendedRoles: {
      type: [String],
      default: []
    },
    recommendedSkills: {
      type: [String],
      default: []
    },
    sectionScores: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    detectedSkills: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    },
    suggestions: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    scoreJustification: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    interviewQuestions: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    keywordDensity: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
