const express = require('express');
const { addUser, deleteUser ,getUsersByAdmin,updateUser,getUserById, filterUsers , deleteall} = require('../controllers/adminuserController');
const authenticateAdmin = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-user',authenticateAdmin, addUser);
router.delete('/delete-user/:id',authenticateAdmin, deleteUser);
router.get('/user',authenticateAdmin, getUsersByAdmin);
router.put('/users/:id',authenticateAdmin, updateUser); 
router.get('/user/:id',authenticateAdmin, getUserById);

router.get('/filter',  filterUsers)
router.delete('/delete-all',authenticateAdmin, deleteall);
module.exports = router;