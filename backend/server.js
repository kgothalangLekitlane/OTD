const express = require("express");
const cors = require("cors");

// load env and database
require('dotenv').config();
require('./config/db');

const authRoutes = require("./routes/authRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const fineRoutes = require("./routes/fineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/license", licenseRoutes);
app.use("/fines", fineRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
