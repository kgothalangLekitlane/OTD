module.exports = (err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);

  const status = Number.isInteger(err?.status) && err.status >= 400 && err.status < 600
    ? err.status
    : 500;

  if (status >= 500) {
    return res.status(status).json({ message: "Internal server error" });
  }

  return res.status(status).json({
    message: err?.message || "Request failed"
  });
};
