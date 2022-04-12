const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userController");
const upload = require("../lib/upload.multer");

router.patch(
  "/update/:id",
  upload.single("recfile"),
  auth.verifyAdmin,
  userCtrl.updateMember
);

router.get("/get-all-member", auth.verifyAdmin, userCtrl.getAllMembers);

router.get("/get-member/:id", auth.verifyAdmin, userCtrl.getMember);

router.delete("/:id", auth.verifyRole, userCtrl.removeMember);

router.post("/is-admin/:id", auth.verifyAdmin, userCtrl.isAdmin);

router.post("/member/:id", auth.verifyAdmin, userCtrl.isMember);

module.exports = router;
