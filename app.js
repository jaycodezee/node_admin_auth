const express = require('express');
const sequelize = require('./config/database');
const Admin = require('./models/Admin');
const User = require('./models/user');
const invitation = require('./models/invitation');
const authRoutes = require('./routes/admin');
const adminRoutes = require('./routes/user');
const event = require('./routes/event');
const invitationRoutes = require('./routes/invitationRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', event);
app.use('/admin', invitationRoutes);

const PORT = 3000;


sequelize.sync(/*{ force: true }*/).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});