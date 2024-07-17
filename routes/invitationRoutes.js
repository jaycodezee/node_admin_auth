const express = require('express');
const { sendInvitation, getInvitationsByUser } = require('../controllers/invitationController');
const authenticateAdmin = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/invitations',authenticateAdmin, sendInvitation);
router.get('/invitations/:userId',authenticateAdmin, getInvitationsByUser);

module.exports = router;
