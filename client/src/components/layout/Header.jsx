import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
  to="/"
  className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
>
          ShopKart
        </Link>
{/* Search Bar */}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
            Products
          </Link>

          {user && (
            <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium">
              My Orders
            </Link>
          )}

          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <FiShoppingCart
  size={24}
  className="text-gray-700 hover:text-blue-600 transition"
/>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-gray-700">
                <FiUser size={22} />
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
                <FiLogOut size={22} />
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full hover:scale-105 transition duration-300 shadow-md">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <Link to="/products" className="block text-gray-700" onClick={() => setMenuOpen(false)}>Products</Link>
          {user && <Link to="/orders" className="block text-gray-700" onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user && user.role === "admin" && <Link to="/admin/dashboard" className="block text-gray-700" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <>
              <Link to="/cart" className="block text-gray-700" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
              <button onClick={handleLogout} className="block text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block text-blue-600" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
