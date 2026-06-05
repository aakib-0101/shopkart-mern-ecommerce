import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";
import api from "../../utils/api";
import { formatPrice } from "../../utils/helpers";

const DashboardPage = () => {
  const [stats, setStats] = useState({ orders: [], products: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/api/orders/all"),
          api.get("/api/products"),
        ]);
        setStats({
          orders: ordersRes.data,
          products: productsRes.data.totalProducts,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const totalRevenue = stats.orders.reduce((acc, order) => (order.isPaid ? acc + order.totalPrice : acc), 0);
  const totalOrders = stats.orders.length;
  const pendingOrders = stats.orders.filter((o) => o.status === "Processing").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiDollarSign size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiShoppingBag size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiPackage size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-xl font-bold">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiPackage size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-bold">{stats.products}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Products</h3>
          <p className="text-gray-500 text-sm">Add, edit, or delete products from your catalog</p>
        </Link>
        <Link to="/admin/orders" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Orders</h3>
          <p className="text-gray-500 text-sm">View and update order statuses</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
