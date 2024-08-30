const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  changePassword,
  emailforgot,
  logout,
} = require("../controllers/adminController");
const authenticateAdmin = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/Validator");
const {
  signupschema,
  loginSchema,
  ChangepasswordSchema,
  emailforgotSchema,
} = require("../validators/admin.validaator");
const router = express.Router();

router.post("/signup", validateRequest(signupschema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", authenticateAdmin, forgotPassword);
router.post(
  "/change-password",
  validateRequest(ChangepasswordSchema),
  changePassword
);
router.post(
  "/reset-password/:token",
  validateRequest(emailforgotSchema),
  authenticateAdmin,
  emailforgot
);

router.post("/logout", authenticateAdmin, logout);
module.exports = router;
