const User = require("../models/userModel");
const logger = require("../utils/logger");

async function listUsers(queryParams) {
  try {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}, { password: 0 }) // Exclude password
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    return {
      status: 200,
      data: {
        message: "Users retrieved successfully",
        users,
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    };
  } catch (error) {
    logger.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findById(userId, { password: 0 }); // Exclude password

    if (!user) {
      return { status: 404, data: { message: "User not found" } };
    }

    return {
      status: 200,
      data: { message: "User retrieved successfully", user },
    };
  } catch (error) {
    logger.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
}

module.exports = {
  listUsers,
  getUserById,
};
