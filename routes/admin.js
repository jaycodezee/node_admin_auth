const express = require('express');
const { signup, login, forgotPassword, changePassword ,emailforgot , logout} = require('../controllers/adminController');
const authenticateAdmin = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/Validator')
const {  signupschema , loginSchema, ChangepasswordSchema} = require('../validators/admin.validaator');
const router = express.Router();

router.post('/signup',validateRequest(signupschema),signup);
router.post('/login',validateRequest(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password',validateRequest(ChangepasswordSchema),changePassword);
router.post('/reset-password/:token',authenticateAdmin, emailforgot);

router.post('/logout', authenticateAdmin , logout)
module.exports = router;