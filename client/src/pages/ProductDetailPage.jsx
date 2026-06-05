import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/helpers";
import Loader from "../components/common/Loader";
import ProductCard from "../components/product/ProductCard";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);

        const related = await api.get("/api/products?limit=4");

        setRelatedProducts(
          related.data.products.filter(
            (item) => item._id !== data._id
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product._id, quantity);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      await addToCart(product._id, quantity);

      toast.success("Proceeding to checkout...");

      navigate("/checkout");
    } catch (error) {
      toast.error("Failed to proceed");
    }
  };
  const handleReviewSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post(`/api/products/${id}/reviews`, {
      rating,
      comment,
    });

    toast.success("Review submitted!");

    setRating(5);
    setComment("");

    const { data } = await api.get(`/api/products/${id}`);
    setProduct(data);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to submit review"
    );
  }
};

  if (loading) return <Loader />;

  if (!product) {
    return (
      <p className="text-center py-10">
        Product not found
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[550px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* Product Details */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Brand:
            <span className="font-medium ml-1">
              {product.brand}
            </span>
          </p>

          {/* Rating */}
          <div className="flex items-center mt-4">
            <span className="text-yellow-400 text-2xl drop-shadow">
              {"★".repeat(Math.floor(product.ratings || 0))}
              {"☆".repeat(
                5 - Math.floor(product.ratings || 0)
              )}
            </span>

            <span className="ml-3 text-gray-500">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-4xl font-bold text-blue-600 mt-6">
            {formatPrice(product.price)}
          </p>

          {/* Stock */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Product Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center border rounded-xl overflow-hidden">

                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>

                  <span className="px-6 font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stock,
                          quantity + 1
                        )
                      )
                    }
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">

                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-black transition font-semibold"
                >
                  Buy Now
                </button>

              </div>
            </>
          )}

          {/* Delivery */}
          <div className="mt-10 p-5 bg-gray-50 rounded-xl border">
            <p className="font-medium">
              🚚 Free Delivery within 3-5 days
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Secure payment • Easy returns • 24/7 support
            </p>
          </div>

        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">

        <h2 className="text-3xl font-bold mb-8">
          Customer Reviews
        </h2>

        {user && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-xl shadow-md mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">
              Write a Review
            </h3>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="border rounded-lg px-4 py-2 mb-4 w-full"
            >
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review..."
              rows="4"
              className="w-full border rounded-lg p-3 mb-4"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Submit Review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h4 className="font-semibold">
                  {review.name}
                </h4>

                <div className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <p className="text-gray-600 mt-2">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          )}
        </div>

      </section>

      {/* Related Products */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Related Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((item) => (
            <ProductCard
              key={item._id}
              product={item}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetailPage;