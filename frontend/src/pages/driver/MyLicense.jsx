import { useEffect, useState } from "react";
import api from "../../api";

export default function MyLicense() {
  const [license, setLicense] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/license/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLicense(res.data);
    };
    load();
  }, []);

  if (!license) return <p className="p-6">Loading License...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My License</h2>

      <div className="bg-gray-100 p-6 rounded shadow">
        <p><strong>License Number:</strong> {license.licenseNumber}</p>
        <p><strong>Status:</strong> {license.status}</p>
        <p><strong>Expiry Date:</strong> {new Date(license.expiryDate).toLocaleDateString()}</p>
        <p><strong>Vehicle Classes:</strong> {license.vehicleClasses.join(", ")}</p>
      </div>
    </div>
  );
}
