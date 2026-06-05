import { useEffect, useState } from "react";
import { FiTrash2, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role });

      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);

      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>

                <td className="px-4 py-3">
                  <span
                    className={
                      user.role === "admin"
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-3 flex gap-2">
                  {user.email !== "mdaakibmd2304@gmail.com" && (
                    <>
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            user.role === "admin"
                              ? "customer"
                              : "admin"
                          )
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="Change Role"
                      >
                        <FiShield size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete User"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;