import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Add background transparency when scrolled
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navigationItems = [
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Ideas", href: "#ideas", active: true },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-orange-500/95 backdrop-blur-sm shadow-lg"
          : "bg-orange-500"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">
              <span className="bg-white text-orange-500 px-2 py-1 rounded mr-2">
                S
              </span>
              uitmedia
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-white hover:text-orange-100 transition-colors duration-200 relative ${
                  item.active ? "font-medium" : ""
                }`}
              >
                {item.name}
                {item.active && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
