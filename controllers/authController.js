const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const authCtrl = {
  addMember: async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
      if (!fullname || !email || !password) {
        return res.status(404).json({
          msg: "Please fill all fields",
        });
      }
      if (!validateEmail(email)) {
        return res.status(404).json({ msg: "Please enter a valid email" });
      }
      const user_email = await Users.findOne({ email });
      if (user_email)
        return res.status(404).json({ msg: "Email already exists" });
      if (password.length < 6)
        return res
          .status(404)
          .json({ msg: "Password must be at least 6 characters" });

      const passwordHash = await bcrypt.hash(password, 12);

      const newuUser = new Users({
        fullname,
        email,
        password: passwordHash,
      });
      await newuUser.save();
      res.status(200).json({
        msg: "User created successfully",
        user: { ...newuUser._doc, password: "" },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(404).json({ msg: "Email not found" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(404).json({ msg: "Invalid password" });

      const accessToken = createAccessToken({
        id: user._id,
        isAdmin: user.isAdmin,
      });
      const refreshToken = createRefreshToken({
        id: user._id,
        isAdmin: user.isAdmin,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/auth/refresh-token",
      });

      res.status(200).json({
        msg: "Login successful",
        accessToken,
        user: {
          ...user._doc,
          password: "",
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
      return res.json({ msg: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  generateAccressToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token) return res.status(401).json({ msg: "Please login" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: err });
          const user = await Users.findById(result.id).select("-password");

          if (!user) return res.status(404).json({ msg: "User not found" });

          const accessToken = createAccessToken({
            id: result.id,
          });
          res.json({
            accessToken,
            user,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = ({ id, isAdmin }) => {
  return jwt.sign({ id, isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = authCtrl;
