"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import SignupPageModel from "@/page/signin-model";
import { authLogout } from "@/services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "@/feature/user-slice";

const Navbar = ({ user }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      const res = await authLogout();

      if (res) {
        toast.success("Logged out successfully");
        setOpenProfile(false);
        dispatch(setUser());
        dispatch(setIsAuthenticated(false));
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
          {/* LEFT AREA */}
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight">
              FreshNow
            </h1>

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-semibold text-green-600">
                ⚡ Delivery in 7 min
              </span>

              <button className="flex items-center text-gray-800 text-sm hover:text-purple-700 transition">
                <MapPin size={15} className="mr-1 text-purple-600" />
                Narasimhaswamy Layout – 32nd Cross
                <ChevronDown size={14} className="ml-1 text-purple-600" />
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex items-center w-1/3 bg-gray-100 px-4 py-2 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-purple-300 transition">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder='Search for "chocolate box"'
              className="bg-transparent outline-none px-2 w-full text-sm"
            />
          </div>

          {/* RIGHT AREA */}
          <div className="flex items-center gap-5 relative" ref={profileRef}>
            {/* USER AREA */}
            {user ? (
              <div className="relative">
                {/* Profile Button */}
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 text-gray-800 font-semibold text-sm hover:text-purple-700 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shadow-sm border border-purple-200">
                    <User size={20} className="text-purple-700" />
                  </div>
                  <ChevronDown
                    size={16}
                    className={`${openProfile ? "rotate-180" : ""} transition`}
                  />
                </button>

                {/* Dropdown Menu */}
                {openProfile && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl shadow-xl
                    border border-gray-200 rounded-xl overflow-hidden animate-dropdown z-50"
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b bg-purple-50">
                      <p className="text-xs text-gray-500">Logged in as</p>
                      <p className="text-sm font-semibold text-purple-700">
                        {user.user_name}
                      </p>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      disabled={loadingLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm 
                      text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      {loadingLogout ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-gray-700"
                        />
                      ) : (
                        <LogOut size={18} className="text-gray-700" />
                      )}
                      {loadingLogout ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setOpenLogin(true)}
                className="text-gray-700 hover:text-purple-700 font-medium text-sm"
              >
                Login
              </button>
            )}

            {/* CART */}
            <button className="relative flex items-center bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-800 shadow-sm transition">
              <ShoppingCart size={20} className="mr-2" />
              Cart
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="flex md:hidden items-center bg-gray-100 mx-4 mb-3 px-4 py-2 rounded-full shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none px-2 w-full text-sm"
          />
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {!user && openLogin && (
        <SignupPageModel closeModal={() => setOpenLogin(false)} />
      )}
    </>
  );
};

export default Navbar;
