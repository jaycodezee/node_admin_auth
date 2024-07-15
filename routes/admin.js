const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, changePassword ,emailforgot} = require('../controllers/adminController');
const authenticateAdmin = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password',authenticateAdmin, forgotPassword);
router.post('/change-password', authenticateAdmin,changePassword);
router.post('/reset-password/:token',authenticateAdmin, emailforgot);

module.exports = router;