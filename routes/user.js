const express = require('express');
const router = express.Router();
const { addUser, deleteUser ,getUsersByAdmin,updateUser,getUserById} = require('../controllers/adminuserController');
const authenticateAdmin = require('../middleware/authMiddleware');

router.post('/add-user',authenticateAdmin, addUser);
router.delete('/delete-user/:id',authenticateAdmin, deleteUser);
router.get('/users/:adminId',authenticateAdmin, getUsersByAdmin);
router.put('/users/:id',authenticateAdmin, updateUser);
router.get('/user/:id',authenticateAdmin, getUserById);

module.exports = router;