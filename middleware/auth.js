const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const auth = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header("Authorization");

      if (!token)
        return res.status(401).json({ msg: "Invalid Authentication." });

      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decode)
        return res.status(403).json({ msg: "Invalid Authentication." });

      const user = await Users.findOne({ _id: decode.id });

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  verifyRole: async (req, res, next) => {
    auth.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ msg: "You are not allowed to do that" });
      }
    });
  },
  verifyAdmin: async (req, res, next) => {
    auth.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ msg: "You are not allowed to do that" });
      }
    });
  },
};

module.exports = auth;
