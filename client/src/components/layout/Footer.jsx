const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">ShopKart</h3>
            <p className="text-sm">Your one-stop destination for quality products at the best prices.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white">All Products</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
              <li><a href="/orders" className="hover:text-white">Orders</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@shopkart.com</li>
              <li>Phone: +91-8319049218</li>
              <li>Mohali, Punjab, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; 2025 ShopKart. Built by Mohd Aakib.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
