const Event = require("../models/event");
const Admin = require("../models/Admin");
const { Op } = require("sequelize");

const createEvent = async (req, res) => {
  try {
    const { eventName, category, startDate, endDate } = req.body;
    const adminId = req.user.id;
    const admin = await Admin.findByPk(adminId);
    // if (!admin) {
    //     return res.status(404).json({status:404, error: 'Admin not found' });
    // }

    const existingEvent = await Event.findOne({ where: { eventName } });
    if (existingEvent) {
      return res
        .status(400)
        .json({ status: 400, error: "Event with this name already exists" });
    }

    const today = new Date();
    if (new Date(startDate) < today) {
      return res.status(400).json({
        status: 400,
        error: "Cannot add event that has already started",
      });
    }

    // Create new event
    const newEvent = await Event.create({
      eventName,
      category,
      startDate,
      endDate,
      createdBy: adminId,
    });

    const eventResponse = {
      id: newEvent.id,
      eventName: newEvent.eventName,
      category: newEvent.category,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      createdBy: admin.username,
    };

    res.status(201).json({ status: 201, eventResponse });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ status: 500, error: "Failed to create event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ status: 404, error: "Event not found" });
    }

    // Delete the event
    await Event.destroy({ where: { id: eventId } });

    res
      .status(200)
      .json({ status: 200, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ status: 500, error: "Failed to delete event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { eventName, category, startDate, endDate } = req.body;

    // Check if the event exists
    let event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ status: 404, error: "Event not found" });
    }

    const existingEvent = await Event.findOne({ where: { eventName } });
    if (existingEvent) {
      return res
        .status(400)
        .json({ status: 400, error: "Event with this name already exists" });
    }

    // Update the event
    event.eventName = eventName;
    event.category = category;
    event.startDate = startDate;
    event.endDate = endDate;
    await event.save();

    // Optionally, you can fetch updated event details and send them in the response
    event = await Event.findByPk(eventId);

    res.status(200).json({ status: 200, event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ status: 500, error: "Failed to update event" });
  }
};

const listEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const events = await Event.findAndCountAll({
      include: [
        {
          model: Admin,
          attributes: ["username"],
        },
      ],
      offset,
      limit,
      order: [["createdAt"]],
    });

    const totalPages = Math.ceil(events.count / limit);

    // Prepare response object
    const response = {
      events: events.rows,
      currentPage: page,
      totalPages,
    };

    res.status(200).json({ status: 200, response });
  } catch (error) {
    console.error("Error listing events:", error);
    res.status(500).json({ status: 500, error: "Failed to list events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const adminId = req.user.id;
    const admin = await Admin.findByPk(adminId);
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ status: 404, error: "Event not found" });
    }
    const eventdata = {
      id: event.id,
      eventName: event.eventName,
      category: event.category,
      startDate: event.startDate,
      endDate: event.endDate,
      createdBy: admin.username,
    };
    res.status(200).json({ status: 200, eventdata });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ status: 500, error: "Failed to fetch event" });
  }
};

const filterUsers = async (req, res) => {
  try {
    const { searchKey, searchValue } = req.query;
    const whereCondition = {};
    //   console.log('searchKey, searchValue :>> ', searchKey, searchValue);

    if (searchKey && searchValue) {
      whereCondition[searchKey] = { [Op.like]: `%${searchValue}%` };
    }

    const users = await Event.findAll({
      where: whereCondition,
      include: [
        {
          model: Admin,
          attributes: ["username"],
        },
      ],
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No event found matching the database" });
    }

    res.status(200).json({ status: 200, users });
  } catch (error) {
    console.error("Error filtering users:", error);
    res.status(500).json({ status: 500, error: "Failed to filter event" });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  listEvents,
  getEventById,
  filterUsers,
};
