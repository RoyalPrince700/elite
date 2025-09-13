const PricingFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EliteRetoucher</h3>
            <p className="text-gray-400">Professional photo retouching services for photographers and brands.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Portrait Retouching</a></li>
              <li><a href="#" className="hover:text-white">Product Retouching</a></li>
              <li><a href="#" className="hover:text-white">Creative Editing</a></li>
              <li><a href="#" className="hover:text-white">Subscription Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Portfolio</a></li>
              <li><a href="#" className="hover:text-white">Testimonials</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} EliteRetoucher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PricingFooter;
