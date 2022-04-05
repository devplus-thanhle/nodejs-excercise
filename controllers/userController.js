const Users = require("../models/userModel");
const userServices = require("../services/userServices");

const userCtrl = {
  getMember: async (req, res, next) => {
    const ress = await userServices.getMember(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "User found", user: ress });
  },
  getAllMembers: async (req, res, next) => {
    const ress = await userServices.getAllMembers(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Users found", users: ress });
  },
  updateMember: async (req, res, next) => {
    const ress = await userServices.updateMember(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "User updated", user: ress });
  },
  isAdmin: async (req, res, next) => {
    const ress = await userServices.isAdmin(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "User is admin", user: ress });
  },
  isMember: async (req, res, next) => {
    const ress = await userServices.isMember(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "User is member", user: ress });
  },
  removeMember: async (req, res, next) => {
    const ress = await userServices.removeMember(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "User removed" });
  },
};

module.exports = userCtrl;
