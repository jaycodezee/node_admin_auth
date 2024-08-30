const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Use your JWT secret
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: "login and then add ....." });
    }

    if (admin.accessToken !== token) {
      return res
        .status(401)
        .json({ error: "plz login if not then signup 1st" });
    }
    req.user = admin;
    next();
  } catch (error) {
    console.error("Error in authenticateAdmin middleware:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateAdmin;
