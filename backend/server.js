const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// load env and database
require('dotenv').config();
require('./config/db');

const authRoutes = require("./routes/authRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const fineRoutes = require("./routes/fineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
// Security & perf middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100 });
app.use(limiter);

app.use("/auth", authRoutes);
app.use("/license", licenseRoutes);
app.use("/fines", fineRoutes);
app.use("/appointments", appointmentRoutes);

// health check
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler (last middleware)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
