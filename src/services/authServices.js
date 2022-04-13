const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const upload = require("../lib/upload.multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const authServices = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) {
        const err = new Error("Email is not correct");
        err.statusCode = 400;
        return next(err);
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const err = new Error("Password is not correct");
        err.statusCode = 400;
        return next(err);
      }

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

      return { accessToken, user: { ...user._doc, password: "" } };
    } catch (error) {
      next(error);
    }
  },

  addMember: async (req, next) => {
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

      const user_email = await Users.findOne({ email });
      if (user_email) {
        const err = new Error("Email is already exists");
        err.statusCode = 400;
        return next(err);
      }

      if (password.length < 6) {
        const err = new Error("Password must be at least 6 characters");
        err.statusCode = 400;
        return next(err);
      }

      const img = await cloudinary.uploader.upload(req.file.path);

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullname,
        email,
        password: passwordHash,
        avatar: img.secure_url,
      });
      return await newUser.save();
    } catch (error) {
      next(error);
    }
  },

  generateAccessToken: async (rf_token, next) => {
    try {
      if (!rf_token) {
        const err = new Error("Unauthenticated");
        err.statusCode = 401;
        return next(err);
      }
      let flag = {};
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
        if (err) {
          const err = new Error(err);
          err.statusCode = 400;
          return next(err);
        }
        //   const user = await Users.findById(result.id);
        //   if (!user) {
        //     const err = new Error("User not found");
        //     err.statusCode = 404;
        //     return next(err);
        //   }
        const accessToken = createAccessToken({
          id: result.id,
          isAdmin: result.isAdmin,
        });
        flag = { accessToken };
      });
      return flag;
    } catch (error) {
      return { msg: error.message };
    }
  },
};

const createAccessToken = ({ id, isAdmin }) => {
  return jwt.sign({ id, isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authServices;
