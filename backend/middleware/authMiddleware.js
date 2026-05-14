const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract token
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Get user from DB
      req.user = await User.findById(decoded.id).select("-password");

      next(); // go to next function
    } catch (error) {
        // console.log(error);
      return res.status(401).json({ message: "Token failed" });
    }
  }

  if (!token) {
  
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protect };
