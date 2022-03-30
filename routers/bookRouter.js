const router = require("express").Router();
const bookCtrl = require("../controllers/bookController");
const auth = require("../middleware/auth");

router.post("/add-book", bookCtrl.addBook);

router.get("/books", bookCtrl.getBooks);

router
  .route("/:id")
  .get(bookCtrl.getBook)
  .put(bookCtrl.updateBook)
  .delete(bookCtrl.removeBook);

router.patch("/borrow/:id", bookCtrl.borrowBook);

router.patch("/return/:id", bookCtrl.returnBook);

module.exports = router;
