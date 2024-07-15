const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Admin');
const sendPasswordResetEmail = require('../utils/email');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      message: 'Signup successful!',
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    const validPassword = await password;
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    const sanitizedUser = {
      username: user.username,
      email: user.email,
    };

    res.json({ message: 'Login successful!', token, user: sanitizedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour in milliseconds

    const newtoken = await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiration,
    });
    

    // const resetLink = `http://localhost:3000/api/reset-password/${resetToken}`;

    // await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent!' 
      , resetPasswordTokenis:{
        token:newtoken.resetPasswordToken
      }
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const emailforgot = async (req,res) =>{
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token
      } 
    });

    if (!user) {
      console.log('Invalid or expired token:', token);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    // Update user's password and clear reset token fields
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const changePassword = async (req, res) => {
  const { username, email, oldPassword, newPassword, confirmPassword } = req.body;
  let user;

  if (email) {
    user = await User.findOne({ where: { email } });
  } else if (username) {
    user = await User.findOne({ where: { username } });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  if (oldPassword !== user.password) {
    return res.status(401).json({ message: 'Invalid old password' });
  }

  try {
    await User.update(
      { password: newPassword },
      { where: { id: user.id } }
    );

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword,
  emailforgot
};
