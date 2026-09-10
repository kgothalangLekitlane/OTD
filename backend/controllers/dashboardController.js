const User = require("../models/User");
const Fine = require("../models/Fine");
const Appointment = require("../models/Appointment");
const License = require("../models/License");

exports.getOperationsSummary = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      drivers,
      officers,
      admins,
      totalFines,
      unpaidFines,
      paidFines,
      fineAmounts,
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
      totalLicenses,
      validLicenses,
      expiredLicenses,
      suspendedLicenses
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "driver" }),
      User.countDocuments({ role: "officer" }),
      User.countDocuments({ role: "admin" }),
      Fine.countDocuments(),
      Fine.countDocuments({ status: "unpaid" }),
      Fine.countDocuments({ status: "paid" }),
      Fine.aggregate([
        { $group: {
          _id: "$status",
          total: { $sum: "$amount" }
        } }
      ]),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "scheduled" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      License.countDocuments(),
      License.countDocuments({ status: "valid" }),
      License.countDocuments({ status: "expired" }),
      License.countDocuments({ status: "suspended" })
    ]);

    const amounts = fineAmounts.reduce((result, item) => {
      result[item._id] = Number(item.total || 0);
      return result;
    }, {});

    const upcomingAppointments = await Appointment.countDocuments({
      status: "scheduled",
      date: { $gte: now }
    });

    res.json({
      users: { total: totalUsers, drivers, officers, admins },
      fines: {
        total: totalFines,
        unpaid: unpaidFines,
        paid: paidFines,
        unpaidAmount: amounts.unpaid || 0,
        paidAmount: amounts.paid || 0,
        totalAmount: (amounts.unpaid || 0) + (amounts.paid || 0)
      },
      appointments: {
        total: totalAppointments,
        scheduled: scheduledAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments
      },
      licenses: {
        total: totalLicenses,
        valid: validLicenses,
        expired: expiredLicenses,
        suspended: suspendedLicenses
      },
      generatedAt: now.toISOString()
    });
  } catch (err) {
    console.error("Operations summary error", err);
    res.status(500).json({ message: "Server error" });
  }
};
