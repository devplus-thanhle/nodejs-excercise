const multer = require("multer");

var storage = multer.diskStorage({
  destination: this.none,
});

var fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
    cb(new Error("File is not supported"), false);
    return;
  }

  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;
