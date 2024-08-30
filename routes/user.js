const express = require("express");
const {
  addUser,
  deleteUser,
  getUsersByAdmin,
  updateUser,
  getUserById,
  filterUsers,
  deleteall,
} = require("../controllers/adminuserController");
const authenticateAdmin = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/Validator");
const { addschema, updateSchema } = require("../validators/user.validator");

const router = express.Router();

router.post(
  "/add-user",
  validateRequest(addschema),
  authenticateAdmin,
  addUser
);
router.delete("/delete-user/:id", authenticateAdmin, deleteUser);
router.get("/user", authenticateAdmin, getUsersByAdmin);
router.put(
  "/users/:id",
  validateRequest(updateSchema),
  authenticateAdmin,
  updateUser
);
router.get("/user/:id", authenticateAdmin, getUserById);

router.get("/filter", filterUsers);
router.delete("/delete-all", authenticateAdmin, deleteall);
module.exports = router;
