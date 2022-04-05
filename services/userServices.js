const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const userServices = {
  getMember: async (req, res, next) => {
    try {
      const id = req.params.id;
      const member = await Users.findById(id).select("-password");

      return member;
    } catch (error) {
      next(error);
    }
  },
  getAllMembers: async (req, res, next) => {
    try {
      const members = await Users.find().select("-password");
      if (!members) {
        const err = new Error("No users found");
        err.statusCode = 404;
        return next(err);
      }

      return members;
    } catch (error) {
      return { msg: error.message };
    }
  },
  updateMember: async (req, res, next) => {
    try {
      const { fullname, email, password } = req.body;
      if (!fullname || !email || !password) {
        const err = new Error("Please fill all fields");
        err.statusCode = 400;
        return next(err);
      }

      if (!validateEmail(email)) {
        const err = new Error("Please enter a valid email");
        err.statusCode = 400;
        return next(err);
      }

      if (password.length < 6) {
        const err = new Error("Password must be at least 6 characters");
        err.statusCode = 400;
        return next(err);
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          fullname,
          email,
          password: passwordHash,
        },
        { new: true }
      ).select("-password");

      return user;
    } catch (error) {
      next(error);
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      const id = req.params.id;

      const member = await Users.findById(id).select("-password");

      if (member.isAdmin) {
        const err = new Error("User is already admin");
        err.statusCode = 400;
        return next(err);
      }

      const user = await Users.findOneAndUpdate(
        { _id: id },
        { isAdmin: true },
        { new: true }
      ).select("-password");

      return user;
    } catch (error) {
      next(error);
    }
  },
  isMember: async (req, res, next) => {
    try {
      const member = await Users.findById(req.params.id).select("-password");
      if (member.isAdmin === false) {
        const err = new Error("User is already member");
        err.statusCode = 400;
        return next(err);
      }
      const user = await Users.findOneAndUpdate(
        { _id: req.params.id },
        { isAdmin: false },
        { new: true }
      ).select("-password");

      return user;
    } catch (error) {
      next(error);
    }
  },
  removeMember: async (req, res, next) => {
    try {
      const user = await Users.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        return next(err);
      }

      return user;
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userServices;
