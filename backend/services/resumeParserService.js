const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ApiError = require("../utils/apiError");

const extractTextFromResume = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    const fileBuffer = await fs.readFile(filePath);
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text;
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new ApiError("Unsupported resume file type", 400);
};

module.exports = { extractTextFromResume };
