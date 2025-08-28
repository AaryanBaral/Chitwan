const errorMiddleWare = (err, req, res, next) => {
  console.log(err)
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  if(err.code === 11000){
    const error = Object.keys(err.keyPattern).join(",")
    err.message = `Duplicate field -${error}`
    err.statusCode = 400
  }
  if(err.name === "CastError"){
    const errorPath = err.path
    err.message = `Invalid Format of ${errorPath}`
    err.statusCode = 400
  }
  if(err.code === "LIMIT_FILE_SIZE"){
    console.log("multer")
    err.message = `File Tooo larg`
    err.statusCode = 400
  }
  res.status(err.statusCode).json({
    sucess: false,
    message: process.env.NODE_ENV === "DEVELOPMENT" ? err : err.message,
  });
};

const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (err) {
    console.log(err)
    return next(err);
  }
};

class ErrorHandler extends Error {
  constructor(message, statusCode=500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { errorMiddleWare, TryCatch, ErrorHandler };