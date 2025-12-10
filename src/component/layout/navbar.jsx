 "use client";
import React from "react";
import { MapPin, Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        
        {/* LEFT SIDE */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-purple-600">zepto</h1>

          {/* Delivery Time + Location */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">⚡ 7 minutes</span>

            <button className="flex items-center text-gray-700 text-sm hover:text-purple-600">
              <MapPin size={16} className="mr-1" />
              Narasimhaswamy Layout – 32nd Cross
              <span className="ml-1 text-purple-600 font-bold">▼</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden md:flex items-center w-1/3 bg-gray-100 px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder='Search for "chocolate box"'
            className="bg-transparent outline-none px-2 w-full text-sm"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-700 hover:text-purple-600 font-medium">
            Login
          </button>

          <button className="relative flex items-center bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
            <ShoppingCart size={20} className="mr-2" /> Cart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
