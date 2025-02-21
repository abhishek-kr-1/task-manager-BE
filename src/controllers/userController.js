const User = require("../models/userModel");

async function listUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // exclude passwords
    const users = await User.find({}, { password: 0 })
      .skip(skip)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
}

module.exports = {
  listUsers,
};
