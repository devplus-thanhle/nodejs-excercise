const router = require("express").Router();
const authCtrl = require("../controllers/authController");
const auth = require("../middleware/auth");
const upload = require("../lib/upload.multer");

router.post("/login", authCtrl.login);

router.post(
  "/add-member",
  upload.single("recfile"),
  auth.verifyAdmin,
  authCtrl.addMember
);

router.post("/refresh-token", authCtrl.generateAccressToken);

module.exports = router;
