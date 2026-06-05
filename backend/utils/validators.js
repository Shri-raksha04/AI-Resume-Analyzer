const ApiError = require("./apiError");

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required", 400);
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError("Please provide a valid email address", 400);
  }

  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters long", 400);
  }
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }
};

const validateResumeMetadata = ({ title, notes }) => {
  if (title && title.length > 120) {
    throw new ApiError("Title cannot exceed 120 characters", 400);
  }

  if (notes && notes.length > 500) {
    throw new ApiError("Notes cannot exceed 500 characters", 400);
  }
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateResumeMetadata
};
