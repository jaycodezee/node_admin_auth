const Event = require('../models/event');
const Admin = require('../models/admin')

const createEvent = async (req, res) => {
    try {
        const { eventName, category, startDate, endDate, adminId} = req.body;

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const existingEvent = await Event.findOne({ where: { eventName } });
        if (existingEvent) {
            return res.status(400).json({ error: 'Event with this name already exists' });
        }

        const today = new Date();
        if (new Date(startDate) < today) {
            return res.status(400).json({ error: 'Cannot add event that has already started' });
        }

            // Create new event
            const newEvent = await Event.create({
                eventName,
                category,
                startDate,
                endDate,
                createdBy: adminId,
            });
    
            // Prepare response object with admin details
            const eventResponse = {
                id: newEvent.id,
                eventName: newEvent.eventName,
                category: newEvent.category,
                startDate: newEvent.startDate,
                endDate: newEvent.endDate,
                createdBy: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                }   
            };
    
            res.status(201).json(eventResponse);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete the event
        await Event.destroy({ where: { id: eventId } });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { eventName, category, startDate, endDate } = req.body;

        // Check if the event exists
        let event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const existingEvent = await Event.findOne({ where: { eventName } });
        if (existingEvent) {
            return res.status(400).json({ error: 'Event with this name already exists' });
        }

        // Update the event
        event.eventName = eventName;
        event.category = category;
        event.startDate = startDate;
        event.endDate = endDate;
        await event.save();

        // Optionally, you can fetch updated event details and send them in the response
        event = await Event.findByPk(eventId);

        res.status(200).json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

const listEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        // Fetch events with pagination
        const events = await Event.findAndCountAll({
            offset,
            limit,
            order: [['createdAt']], 
        });

        const totalPages = Math.ceil(events.count / limit);

        // Prepare response object
        const response = {
            events: events.rows,
            currentPage: page,
            totalPages,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error listing events:', error);
        res.status(500).json({ error: 'Failed to list events' });
    }
};

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Fetch the event by its ID
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
}
module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    listEvents,
    getEventById
};
