export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled API Error:", err.stack || err.message || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || "An unexpected internal server error occurred.",
    status: statusCode,
    timestamp: new Date().toISOString()
  });
};
