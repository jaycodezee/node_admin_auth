const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Admin");
const sendPasswordResetEmail = require('../utils/email')

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({status:409, message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({status:409, message: "Username already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "Signup successful!",
      status:201,
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({status:500, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;
  let user;

  try {
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { username } });
    }

    if (!user) {
      return res.status(401).json({status:401, message: "Invalid username or email" });
    }

    if (password !== user.password) {
      return res.status(401).json({ status:401,message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
     user.accessToken = token;
     await user.save();
     
    const sanitizedUser = {
      username: user.username,
      email: user.email,
    };

    res.status(201).json({ status:201, message: "Login successful!", token, user: sanitizedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status:500,message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({status:404, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour in milliseconds

    const newtoken = await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiration,
    });

    const resetLink = `http://localhost:3000/api/reset-password/${resetToken}`;

    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      message: "Password reset email sent!",
      status:200,
      resetPasswordTokenis: {
        token: newtoken.resetPasswordToken,
      },
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ status:500,message: "Internal server error" });
  }
};

const emailforgot = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      console.log("Invalid or expired token:", token);
      return res.status(400).json({ status:400, message: "Invalid or expired token" });
    }
    // Update user's password and clear reset token fields
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({status:200, message: "Password updated successfully"  });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ status:500,message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const { username, email, oldpassword, newPassword, confirmPassword } =req.body;
  let user;

  if (email) {
    user = await User.findOne({ where: { email } });
  } else if (username) {
    user = await User.findOne({ where: { username } });
  }

  if (!user) {
    return res.status(404).json({status:404, message: "User not found" });
  }

  // if (newPassword !== confirmPassword) {
  //   return res
  //     .status(400)
  //     .json({ message: "New password and confirm password do not match" });
  // }

  if (oldpassword !== user.password) {
    return res.status(401).json({status:401, message: "Invalid old password" });
  }

  try {
    await User.update({ password: newPassword }, { where: { id: user.id } });

    res.status(200).json({status:200, message: "Password changed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({status:500, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({status:404, message: 'User not found' });
    }

    user.accessToken = null; 
    await user.save();

    res.status(200).json({ status:200,message: 'Logout successful!' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ status:500,message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword,
  emailforgot,
  logout,
};
