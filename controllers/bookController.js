const Books = require("../models/bookModel");
const bookServices = require("../services/bookServices");

const bookCtrl = {
  addBook: async (req, res, next) => {
    const ress = await bookServices.addBook(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Book added successfully", book: ress });
  },
  getBooks: async (req, res, next) => {
    const ress = await bookServices.getBooks(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Books found", books: ress });
  },
  getBook: async (req, res, next) => {
    const ress = await bookServices.getBook(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Book found", book: ress });
  },
  updateBook: async (req, res, next) => {
    const ress = await bookServices.updateBook(req, res, next);
    if (!ress) return;
    console.log("ress", ress);
    res.status(200).json({ msg: "Book updated", book: ress });
  },
  removeBook: async (req, res, next) => {
    const ress = await bookServices.removeBook(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Book removed" });
  },
  borrowBook: async (req, res, next) => {
    const ress = await bookServices.borrowBook(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Book borrowed", book: ress });
  },
  returnBook: async (req, res, next) => {
    const ress = await bookServices.returnBook(req, res, next);
    if (!ress) return;
    res.status(200).json({ msg: "Book returned", book: ress });
  },
};

module.exports = bookCtrl;
