const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/token");
const { validateRegisterInput, validateLoginInput } = require("../utils/validators");

const registerUser = asyncHandler(async (req, res) => {
  validateRegisterInput(req.body);

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError("Email is already registered", 409);
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

const loginUser = asyncHandler(async (req, res) => {
  validateLoginInput(req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

module.exports = {
  registerUser,
  loginUser
};
