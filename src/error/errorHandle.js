exports.errorHandle = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  //Dupicate key error
  if (err.code === 11000) {
    err.statusCode = 400;
    for (let p in err.keyValue) {
      err.message = `${p} have to be uique`;
    }
  }

  //ObjectId: not found
  if (err.kind == "ObjectId") {
    err.statusCode = 404;
    err.message = `Id not found`;
  }

  //Jwt expired
  // if (err.message === "jwt expired") {
  //   err.statusCode = 401;
  //   err.message = "Your token is expired, please login again";
  // }
  return res.status(err.statusCode).json({ msg: err.message });
};
