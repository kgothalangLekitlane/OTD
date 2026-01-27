import { Link } from "react-router-dom";

export default function DriverDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link to="/driver/license" className="p-6 bg-gray-100 rounded shadow">
          My License
        </Link>

        <Link to="/driver/fines" className="p-6 bg-gray-100 rounded shadow">
          My Fines
        </Link>

        <Link to="/driver/appointments" className="p-6 bg-gray-100 rounded shadow">
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
