// models/invitation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as per your project structure
const User = require('./user'); // Adjust the path as per your project structure

const Invitation = sequelize.define('Invitation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    inviterId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    inviteeId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: true,
});

User.hasMany(Invitation, { foreignKey: 'inviterId', as: 'invitationsSent' });
User.hasMany(Invitation, { foreignKey: 'inviteeId', as: 'invitationsReceived' });
Invitation.belongsTo(User, { foreignKey: 'inviterId', as: 'inviter' });
Invitation.belongsTo(User, { foreignKey: 'inviteeId', as: 'invitee' });

module.exports = Invitation;
