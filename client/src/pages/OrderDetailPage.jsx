import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/common/Loader";
import { formatPrice } from "../utils/helpers";

const OrderDetailPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      {/* Order Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Order #{order._id}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {order.isDelivered ? (
                <span className="text-green-600">Delivered</span>
              ) : (
                <span className="text-yellow-600">Processing</span>
              )}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Payment:</span>{" "}
              {order.isPaid ? (
                <span className="text-green-600">Paid</span>
              ) : (
                <span className="text-red-500">Unpaid</span>
              )}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Placed On:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">
              Shipping Address
            </h3>

            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">
          Ordered Products
        </h2>

        <div className="space-y-5">
          {order.items.map((item) => (
            <div
              key={item._id || item.product}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <p className="font-bold text-blue-600">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <h2 className="text-2xl font-bold text-blue-600">
            Total: {formatPrice(order.totalPrice)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;