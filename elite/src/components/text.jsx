

export const NavBar = () => {
  return (
    <header className="sticky top-0 z-20 bg-transparent backdrop-blur-sm">
      {/* Top Bar */}
      <div className="flex justify-center items-center gap-3 bg-black py-3 text-white text-sm">
        <p className="text-white/60 md:block hidden">
          Streamline workflow and boost your productivity
        </p>
        <div className="gap-1 items-center inline-flex">
          <p>Let's get started</p>
        </div>
        <img
          src={ArrowRight}
          alt="Arrow Right Icon"
          className="h-4 w-4 inline-flex justify-center items-center"
        />
      </div>

      {/* Header Main */}
      <div className="py-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img src={LOGO} alt="Saas Logo" className="h-10 w-10" />

            {/* Mobile Menu Icon */}
            <img src={MenuIcon} alt="Menu Icon" className="w-5 h-5 md:hidden" />

            {/* Navigation Links */}
            <nav className="hidden md:flex gap-6 text-white items-center">
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Customers</a>
              <a href="#">Updates</a>
              <a href="#">Help</a>
              <button className="btn btn-primary">Get For Free</button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
