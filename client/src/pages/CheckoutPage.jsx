import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helpers";
import api from "../utils/api";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const subtotal = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Please fill all address fields");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order in backend
      const { data: order } = await api.post("/api/orders", {
        shippingAddress: address,
        paymentMethod: "Razorpay",
      });

      // Step 2: Create Razorpay payment order
      const { data: razorpayOrder } = await api.post("/api/payment/create-order", {
        amount: total,
        orderId: order._id,
      });

      // Step 3: Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      // Step 4: Open Razorpay checkout
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  name: "ShopKart",
  description: "Order Payment",
  order_id: razorpayOrder.id,

  handler: async (response) => {
    try {
      await api.post("/api/payment/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: order._id,
      });

      await clearCart();
      toast.success("Payment successful! Order placed.");
      navigate("/orders");
    } catch (error) {
      toast.error("Payment verification failed");
    }
  },

  prefill: {
    name: "Customer",
    email: "customer@example.com",
    contact: "9999999999",
  },

  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },

  config: {
    display: {
      blocks: {
        upi: {
          name: "Pay via UPI",
          instruments: [{ method: "upi" }],
        },
      },
      sequence: ["block.upi"],
      preferences: {
        show_default_blocks: true,
      },
    },
  },

  theme: {
    color: "#2563EB",
  },
};

const razorpay = new window.Razorpay(options);
razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h3>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="123 Main Street"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Mumbai"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Maharashtra"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="400001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-4"
            >
              {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <div key={item.product?._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product?.name} x {item.quantity}</span>
                <span>{formatPrice(item.product?.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="space-y-2 mt-4 text-sm">
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
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
