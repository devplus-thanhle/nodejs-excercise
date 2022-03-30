const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userController");

router.patch("/update/:id", auth.verifyAdmin, userCtrl.updateMember);

router.get("/get-all-member", auth.verifyAdmin, userCtrl.getAllMembers);

router.get("/get-member/:id", auth.verifyAdmin, userCtrl.getMember);

router.delete("/:id", auth.verifyRole, userCtrl.removeMember);

router.post("/is-admin/:id", auth.verifyAdmin, userCtrl.isAdmin);

router.post("/is-member/:id", auth.verifyAdmin, userCtrl.isMember);

module.exports = router;