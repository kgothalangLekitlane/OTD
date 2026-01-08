const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const licenseRoutes = require("./routes/licenseRoutes");
const fineRoutes = require("./routes/fineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://<connection-string>");

app.use("/auth", authRoutes);
app.use("/license", licenseRoutes);
app.use("/fines", fineRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
