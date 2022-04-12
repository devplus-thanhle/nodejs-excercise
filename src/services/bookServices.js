const Books = require("../models/bookModel");
const APIFeatures = require("../lib/feature");

const bookServices = {
  addBook: async (req, next) => {
    try {
      const { title, author, description, image } = req.body;
      if (!title || !author || !description) {
        const err = new Error("Please fill all fields");
        err.statusCode = 400;
        return next(err);
      }

      const newBook = new Books({
        title,
        author,
        description,
      });

      return await newBook.save();
    } catch (error) {
      next(error);
    }
  },
  getBooks: async (req, next) => {
    try {
      const features = new APIFeatures(Books.find(), req.query).paginating();
      // const books = features.query;
      // if (books.length === 0) {
      //   const err = new Error("No books found");
      //   err.statusCode = 200;
      //   return next(err);
      // }
      const result = await Promise.allSettled([
        features.query,
        Books.countDocuments(),
      ]);

      const books = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;

      return {
        books,
        count,
      };
    } catch (error) {
      next(error);
    }
  },
  getBook: async (req, next) => {
    try {
      const id = req.params.id;
      const book = await Books.findById(id);
      if (!book) {
        const err = new Error("Book not found");
        err.statusCode = 404;
        return next(err);
      }
      return book;
    } catch (error) {
      next(error);
    }
  },
  updateBook: async (req, next) => {
    try {
      const { title, author, description, image } = req.body;

      if (!title || !author || !description || !image) {
        const err = new Error("Please fill all fields");
        err.statusCode = 400;
        return next(err);
      }

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
      return book;
    } catch (error) {
      next(error);
    }
  },
  removeBook: async (req, next) => {
    try {
      const book = await Books.findByIdAndDelete(req.params.id);
      return book;
    } catch (error) {
      next(error);
    }
  },
  borrowBook: async (req, next) => {
    try {
      const book = await Books.findById(req.params.id);

      if (book.status === "borrowed") {
        const err = new Error("Book is already borrowed");
        err.statusCode = 400;
        return next(err);
      }
      const newBook = await Books.findByIdAndUpdate(
        req.params.id,
        {
          status: "borrowed",
        },
        { new: true }
      );

      return newBook;
    } catch (error) {
      next(error);
    }
  },
  returnBook: async (req, next) => {
    try {
      const book = await Books.findById(req.params.id);
      if (book.status === "available") {
        const err = new Error("Book is already available");
        err.statusCode = 400;
        return next(err);
      }
      const newBook = await Books.findByIdAndUpdate(
        req.params.id,
        {
          status: "available",
        },
        { new: true }
      );
      return newBook;
    } catch (error) {
      next(error);
    }
  },
};

module.exports = bookServices;
