// controller/adminController.js
const User = require('../models/user.js');

const addUser = async (req, res) => {
    try {
        const { username, email, password, adminId } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user with adminId
        const newUser = await User.create({ username, email, password, adminId });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await User.destroy({ where: { id: userId } });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const getUsersByAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        let { page, limit } = req.query;
        
        // Set default values for page and limit if not provided
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;  // Default limit to 10 users per page

        // Validate adminId
        if (!adminId) {
            return res.status(400).json({ error: 'Invalid admin ID' });
        }

        // Calculate offset based on page and limit
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            where: { adminId },
            limit,
            offset,
        });

        if (users.rows.length === 0) {
            return res.status(404).json({ message: 'No users found for this admin' });
        }

        const totalPages = Math.ceil(users.count / limit);

        res.status(200).json({
            users: users.rows,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        // Check if the user exists
        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        user.username = username;
        user.email = email;
        user.password = password; // Note: In a real-world scenario, handle password hashing properly

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const getUserById = async (req, res) => {
    try {
        const UserId = req.params.id;
        const user = await User.findByPk(UserId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch User' });
    }
}



module.exports = {
    addUser,
    deleteUser,
    getUsersByAdmin,
    updateUser,
    getUserById
};