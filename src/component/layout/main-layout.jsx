"use client";
import React, { useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsAuthenticated } from "@/feature/user-slice";
import { AuthProfile } from "@/services/profile";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) return;
    const fetchProfile = async () => {
      try {
        const res = await AuthProfile();
        if (res?.data) {
          dispatch(setUser(res?.data));
          dispatch(setIsAuthenticated(true));
        }
      } catch (error) {}
    };
    if (!user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <div>
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
