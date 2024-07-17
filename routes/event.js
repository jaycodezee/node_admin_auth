const express = require('express');
const{createEvent,deleteEvent , updateEvent , listEvents,getEventById , filterUsers} = require('../controllers/eventController');
const authenticateAdmin = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/events',authenticateAdmin,  createEvent);
router.delete('/delete-event/:id',authenticateAdmin,  deleteEvent);
router.put('/event/:id',authenticateAdmin, updateEvent);
router.get('/events',authenticateAdmin, listEvents)
router.get('/events/:id',authenticateAdmin, getEventById);

router.get('/filters',  filterUsers)
module.exports = router;
