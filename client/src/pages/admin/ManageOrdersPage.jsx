import { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatPrice } from "../../utils/helpers";
import toast from "react-hot-toast";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders/all");
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                  <span className="font-bold text-blue-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-wrap gap-2 mb-4">
                {order.items.map((item, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-3 border-t pt-4">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
