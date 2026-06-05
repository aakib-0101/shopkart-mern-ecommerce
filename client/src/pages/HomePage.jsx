import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products?limit=8");
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-28">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            Shop Smart. Live Better.
          </h1>

          <p className="text-lg md:text-2xl mb-8 text-blue-100">
            Premium gadgets, fashion and electronics delivered to your doorstep.
          </p>

          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>

          {/* Stats */}
          <div className="flex justify-center gap-16 mt-10 text-center flex-wrap">
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-blue-100">Products</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">1000+</h3>
              <p className="text-blue-100">Customers</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">4.8★</h3>
              <p className="text-blue-100">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-10 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[700px] px-5 py-3 rounded-full border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Trending Products
        </h2>

        {loading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No matching products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default HomePage;