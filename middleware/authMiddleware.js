const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authenticateAdmin = async (req, res, next) => {
    try {
      const authorizationHeader = req.header('Authorization');
      if (!authorizationHeader) {
        return res.status(401).send({ error: 'Authorization header is missing' });
      }
  
      const token = authorizationHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const admin = await Admin.findByPk(decoded.id);
  
      if (!admin) {
        throw new Error();
      }
  
      req.admin = admin;
      next();
    } catch (e) {
      res.status(401).send({ error: 'Please authenticate' });
    }
  };
  
  module.exports = authenticateAdmin;