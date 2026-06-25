export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Something went wrong";
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({ message: err.message });
};
