// routes/invitationRoutes.js

const express = require('express');
const router = express.Router();
const { sendInvitation, getInvitationsByUser } = require('../controllers/invitationController');
const authenticateAdmin = require('../middleware/authMiddleware');

router.post('/invitations',authenticateAdmin, sendInvitation);
router.get('/invitations/:userId',authenticateAdmin, getInvitationsByUser);

module.exports = router;
