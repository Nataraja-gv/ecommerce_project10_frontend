"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* BRAND SECTION */}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-3">FreshNow</h1>
          <p className="text-sm leading-relaxed text-gray-400">
            Fresh groceries & essentials delivered to your doorstep in minutes.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Press</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              Customer Support
            </li>
            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Refund Policy</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@freshnow.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Bangalore, India</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FreshNow • All Rights Reserved
      </div>
    </footer>
  );
}
