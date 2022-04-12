const router = require("express").Router();
const bookCtrl = require("../controllers/bookController");
const auth = require("../middleware/auth");

router.post("/add-book", auth.verifyAdmin, bookCtrl.addBook);

router.get("/books", auth.verifyToken, bookCtrl.getBooks);

router.get("/:id", auth.verifyToken, bookCtrl.getBook);

router
  .route("/:id")
  .patch(auth.verifyAdmin, bookCtrl.updateBook)
  .delete(auth.verifyAdmin, bookCtrl.removeBook);

router.patch("/borrow/:id", auth.verifyToken, bookCtrl.borrowBook);

router.patch("/return/:id", auth.verifyToken, bookCtrl.returnBook);

module.exports = router;
