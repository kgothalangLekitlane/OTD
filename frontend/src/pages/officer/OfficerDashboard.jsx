import { Link } from "react-router-dom";

export default function OfficerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Officer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link to="/officer/lookup" className="p-6 bg-gray-100 rounded shadow">
          License Lookup
        </Link>

        <Link to="/officer/issue-fine" className="p-6 bg-gray-100 rounded shadow">
          Issue Fine
        </Link>
      </div>
    </div>
  );
}
