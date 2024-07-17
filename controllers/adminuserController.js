const { Op, where } = require("sequelize");
const User = require("../models/User");
const Admin = require("../models/Admin");

const addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminId = req.user.id; 

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "username already exists" });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" }); 
    }

    const newUser = await User.create({ username, email, password, adminId });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.id; 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    await User.destroy({
       where:{ 
          id: userId,
          adminId 
        }
      });
    if(!adminId){
    res.status(200).json({ message: "User deleted successfully" });}
    else{
      return res.status(400).json({ error: "You can't delete this user" }); 
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const getUsersByAdmin = async (req, res) => { 
  try {
    // const adminId = req.user.id;
    let { page, limit, sortBy, order } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "username";
    order = order && ["asc", "desc"].includes(order.toLowerCase()) ? order.toLowerCase() : "asc";

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      // where: { adminId },
      where: { },
      limit,
      offset,
      order: [[sortBy, order]],
    });

    if (users.rows.length === 0) {
      return res.status(404).json({ message: "No users found for this admin" });
    }

    const totalPages = Math.ceil(users.count / limit);

    res.status(200).json({
      users: users.rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.id; 
    const { username, email, password } = req.body;

    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.adminId !== adminId) {
      return res.status(404).json({ error: "You can't Upadte this user data" });
    }

    user.username = username;
    user.email = email;
    user.password = password; 

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const getUserById = async (req, res) => {
  try {
    const UserId = req.params.id;
    // const adminId = req.user.id; 
    const user = await User.findByPk(UserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // if (user.adminId !== adminId) {
    //   return res.status(404).json({ error: "You can't See this user data" });
    // }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch User" });
  }
};

const filterUsers = async (req, res) => {
  try {
    const otherFilters  = req.query;
    const whereCondition = {};

    for (const [key, value] of Object.entries(otherFilters)) {
      if (value) {
        whereCondition[key] = { [Op.like]: `%${value}%` };
      }
    }
    const users = await User.findAll({
      where: whereCondition,
      include: [{
        model: Admin,
        attributes: ['username','email']
      }],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found matching the database" });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error filtering users:", error);
    res.status(500).json({ error: "Failed to filter users" });
  }
};

const deleteall = async (req,res)  =>{
 try{ 
  const adminId = req.user.id; 
  await User.destroy({
    where : {adminId},
    truncate: false
  });
  res.status(200).json({ message: "All Users deleted successfully" });
} catch (error) {
  console.error("Error deleting user:", error);
  res.status(500).json({ error: "Failed to delete users" });
}
};


module.exports = {
  addUser,
  deleteUser,
  getUsersByAdmin,
  updateUser,
  getUserById,
  filterUsers,
  deleteall
};
