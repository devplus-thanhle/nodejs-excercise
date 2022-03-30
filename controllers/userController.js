const Users = require("../models/userModel");

const userCtrl = {
    getMember: async (req, res) => {
        try {
          const member = await Users.findById(req.params.id).select("-password");
          if (!member) return res.status(404).json({ msg: "User not found" });
          res.status(200).json({ msg: "User found", user: member });
        } catch (error) {
          return res.status(500).json({ msg: "User not found" });
        }
      },
      getAllMembers: async (req, res) => {
        try {
          const members = await Users.find().select("-password");
          if (!members) return res.status(404).json({ msg: "No users found" });
          res.status(200).json({ msg: "Users found", users: members });
        } catch (error) {
          return res.status(500).json({ msg: error.message });
        }
      },
      updateMember: async (req, res) => {
        try {
          const { fullname, email, password } = req.body;
          if (!fullname || !email || !password)
            return res.status(404).json({ msg: "Please fill all fields" });
          if (!validateEmail(email))
            return res.status(404).json({ msg: "Please enter a valid email" });
    
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
          res.status(200).json({ msg: "User updated successfully", user });
        } catch (error) {
          return res.status(500).json({ msg: error.message });
        }
      },
      isAdmin: async (req, res) => {
        try {
          const user = await Users.findOneAndUpdate(
            { _id: req.params.id },
            { isAdmin: true },
            { new: true }
          ).select("-password");
    
          if (!user) return res.status(404).json({ msg: "User not found" });
    
          res.status(200).json({ user });
        } catch (error) {
          return res.status(500).json({ msg: error.message });
        }
      },
      isMember: async (req, res) => {
        try {
          const user = await Users.findOneAndUpdate(
            { _id: req.params.id },
            { isAdmin: false },
            { new: true }
          ).select("-password");
    
          if (!user) return res.status(404).json({ msg: "User not found" });
    
          res.status(200).json({ user });
        } catch (error) {
          return res.status(500).json({ msg: error.message });
        }
      },
      removeMember: async (req, res) => {
        try {
          const user = await Users.findOneAndDelete({ _id: req.params.id });
          if (!user) return res.status(404).json({ msg: "User not found!" });
          res.status(200).json({ msg: "User deleted successfully" });
        } catch (error) {
          return res.status(500).json({ msg: "User not found!" });
        }
      },
}

module.exports = userCtrl;