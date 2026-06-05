import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = async (productId, newQty) => {
    try {
      await updateQuantity(productId, newQty);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product?._id} className="bg-white p-4 rounded-xl shadow-md flex gap-4">
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
                <p className="text-blue-600 font-bold mt-1">{formatPrice(item.product?.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-gray-800">
                {formatPrice(item.product?.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
