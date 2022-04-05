const fs = require("fs");
fs.readFile("hehehe.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("faild to read file");
  } else {
    console.log("data", data);
  }
});
