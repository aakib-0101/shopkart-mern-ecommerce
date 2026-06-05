import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/helpers";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product._id);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">

          {/* Bestseller Badge */}
          {product.rating >= 4.5 && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              Bestseller
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Product Details */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {product.category}
          </p>

          {/* Rating */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 text-sm">
              {"★".repeat(Math.floor(product.rating || 0))}
              {"☆".repeat(5 - Math.floor(product.rating || 0))}
            </span>

            <span className="text-xs text-gray-500 ml-2">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FiShoppingCart size={18} />
            </button>
          </div>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <span className="text-xs text-red-500 font-medium mt-2 block">
              Out of Stock
            </span>
          ) : (
            <span className="text-xs text-green-600 font-medium mt-2 block">
              In Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;