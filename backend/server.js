const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const fineRoutes = require("./routes/fineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const configuredOrigins = (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";
if (isProduction && configuredOrigins.length === 0) console.warn("CORS_ORIGINS is not configured; cross-origin browser requests will be blocked in production.");

app.use(cors({
  origin: configuredOrigins.length
    ? (origin, callback) => configuredOrigins.includes(origin) || !origin ? callback(null, true) : callback(new Error("CORS origin not allowed"))
    : (origin, callback) => !isProduction || !origin ? callback(null, true) : callback(new Error("CORS origin not allowed")),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
}));

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const rateLimitMax = Number.parseInt(process.env.RATE_LIMIT_MAX || "100", 10);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.isFinite(rateLimitMax) && rateLimitMax > 0 ? rateLimitMax : 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" }
});
app.use(limiter);

app.use("/auth", authRoutes);
app.use("/license", licenseRoutes);
app.use("/fines", fineRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);
app.use("/audit", auditRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get(/^\/(?!auth|license|fines|appointments|dashboard|users|audit|health).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
