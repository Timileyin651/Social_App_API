const { mongo, default: mongoose } = require("mongoose");
const User = require("../models/users");
const AppError = require("../utils/AppError");

async function createUser(data) {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("User already exist", 409);
    }
    throw new AppError("Oops something went wrong", 404);
  }
}

async function getUser(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function getUserByUsername(username) {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function listUsers({ page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);
  return { users, total, page: Number(page), limit: Number(limit) };
}

async function updateUser(id, data) {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function followUser(currentUserId, targetUserId) {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new AppError("You cannot follow yourself", 400);
  }
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const user = await User.findById(currentUserId).session(session);
      const targetUser = await User.findById(targetUserId).session(session);

      if (!user) {
        throw new AppError("User not found", 404);
      }
      if (!targetUser) {
        throw new AppError("User to follow not found", 404);
      }
      if (user.following.some((id) => id.equals(targetUser._id))) {
        throw new AppError("You are already following this user", 400);
      }
      user.following.push(targetUser._id);
      targetUser.followers.push(user._id);

      await user.save({ session });
      await targetUser.save({ session });

      result = {
        message: "User followed successfully",
      };
    });
    return result;
  } finally {
    await session.endSession();
  }
}
module.exports = {
  createUser,
  getUser,
  getUserByUsername,
  listUsers,
  updateUser,
  deleteUser,
  followUser,
};


 