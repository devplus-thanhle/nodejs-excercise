const authServices = require("../services/authServices");

const authCtrl = {
  addMember: async (req, res, next) => {
    const ress = await authServices.addMember(req, next);
    if (!ress) return;
    res.status(200).json({ msg: "User created successfully", user: ress });
  },

  login: async (req, res, next) => {
    const ress = await authServices.login(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Login Successfully", ress });
  },

  logout: async (res) => {
    try {
      res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
      return res.json({ msg: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  generateAccressToken: async (req, res, next) => {
    const rf_token = req.cookies.refreshToken;
    const rs = await authServices.generateAccessToken(rf_token, next);
    if (!res) return;
    res.status(200).json(rs);
  },
};

module.exports = authCtrl;
