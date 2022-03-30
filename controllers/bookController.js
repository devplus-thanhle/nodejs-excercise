const Books = require("../models/bookModel");

const bookCtrl = {
  addBook: async (req, res) => {
    try {
      const { title, author, description, image } = req.body;
      if (!title || !author || !description || !image) {
        return res.status(400).json({ msg: "Please fill all fields" });
      }

      const newBook = new Books({
        title,
        author,
        description,
        image,
      });

      await newBook.save();
      res.json({ msg: "Book added successfully", book: newBook });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBooks: async (req, res) => {
    try {
      const books = await Books.find();
      res.json({ msg: "Books found", books });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBook: async (req, res) => {
    try {
      const book = await Books.findById(req.params.id);
      if (!book) return res.status(400).json({ msg: "Book not found" });
      res.json({ msg: "Book found", book });
    } catch (error) {
      return res.status(500).json({ msg: "Book not found" });
    }
  },
  updateBook: async (req, res) => {
    const { title, author, description, image } = req.body;

    const book = await Books.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        description,
        image,
      },
      { new: true }
    );

    if (!book) return res.status(400).json({ msg: "Book not found" });

    res.json({ msg: "Book updated successfully", book });
  },
  removeBook: async (req, res) => {
    try {
      const book = await Books.findByIdAndDelete(req.params.id);
      if (!book) return res.status(400).json({ msg: "Book not found" });
      res.json({ msg: "Book deleted successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  borrowBook: async (req, res) => {
    try {
      const book = await Books.findByIdAndUpdate(
        req.params.id,
        {
          status: "borrowed",
        },
        {
          new: true,
        }
      );

      res.json({ msg: "Successfully", book });
    } catch (error) {
      return res.status(500).json({ msg: "Book not found" });
    }
  },
  returnBook: async (req, res) => {
    try {
      const book = await Books.findByIdAndUpdate(
        req.params.id,
        {
          status: "available",
        },
        {
          new: true,
        }
      );

      res.json({ msg: "Successfully", book });
    } catch (error) {
      return res.status(500).json({ msg: "Book not found" });
    }
  },
};

module.exports = bookCtrl;
