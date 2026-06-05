import { useEffect } from "react";
import api from "../utils/api";

const AdminTest = () => {
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/admin/stats");
        console.log("ADMIN STATS:", data);
      } catch (error) {
        console.log("ERROR:", error.response?.data);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Admin Test Page
      </h1>
    </div>
  );
};

export default AdminTest;