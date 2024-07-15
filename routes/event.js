const express = require('express');
const router = express.Router();
const{createEvent,deleteEvent , updateEvent , listEvents,getEventById} = require('../controllers/eventController');
const authenticateAdmin = require('../middleware/authMiddleware');

router.post('/events',authenticateAdmin,  createEvent);
router.delete('/delete-event/:id',authenticateAdmin,  deleteEvent);
router.put('/event/:id',authenticateAdmin, updateEvent);
router.get('/events',authenticateAdmin, listEvents)
router.get('/events/:id',authenticateAdmin, getEventById);

module.exports = router;
