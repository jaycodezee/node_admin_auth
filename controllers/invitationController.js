const { Op } = require("sequelize");
const Invitation = require("../models/invitation");
const User = require("../models/user");
const Event = require("../models/event");

const sendInvitation = async (req, res) => {
  try {
    const { inviterId, eventId, inviteeIds, message } = req.body;

    const inviter = await User.findByPk(inviterId);
    if (!inviter) {
      return res.status(404).json({ error: "Inviter not found" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (!Array.isArray(inviteeIds) || inviteeIds.length === 0) {
      return res.status(400).json({ error: "Invalid inviteeIds format" });
    }

    const invitees = await User.findAll({
      where: {
        id: inviteeIds,
      },
    });

    if (invitees.length !== inviteeIds.length) {
        return res.status(400).json({ error: "One  invitees not found" });
      }
      
      //   if (inviteeIds.id == inviteeIds.id) {
      //   return res.status(400).json({ error: "you can invitees other not you" });
      // }
    

    const invitations = await Promise.all(
      invitees.map(async (invitee) => {
        const invitation = await Invitation.create({
          inviterId,
          inviteeId: invitee.id,
          eventId,
          message,
          
        });
        return invitation;
      })
    );

    res.status(201).json(invitations);
  } catch (error) {
    console.error("Error sending invitations:", error);
    res.status(500).json({ error: "Failed to send invitations" });
  }
};

const getInvitationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const invitations = await Invitation.findAll({
      where: {
        [Op.or]: [{ inviterId: userId }],
      },
      include: [
        // { model: User, as: 'inviter', attributes: ['id', 'username', 'email'] },
        { model: User, as: "invitee", attributes: ["id", "username", "email"] },
      ],
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
};

module.exports = {
  sendInvitation,
  getInvitationsByUser,
};
