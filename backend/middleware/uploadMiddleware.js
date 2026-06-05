const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/apiError");

const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeOriginalName}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedExtension = [".pdf", ".docx"].includes(extension);

  if (allowedMimeTypes.includes(file.mimetype) && isAllowedExtension) {
    cb(null, true);
    return;
  }

  cb(new ApiError("Only PDF and DOCX resume files are allowed", 400));
};

const maxFileSize = Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024;

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

module.exports = { uploadResume };
