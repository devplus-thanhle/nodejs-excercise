const router = require("express").Router();
const authCtrl = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/login", authCtrl.login);

router.post("/add-member", auth.verifyAdmin, authCtrl.addMember);

router.post("/refresh-token", authCtrl.generateAccressToken);

module.exports = router;
