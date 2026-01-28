"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsAuthenticated } from "@/feature/user-slice";
import { AuthProfile } from "@/services/profile";
import { getuserCartItems } from "@/services/cart";
import { setCart } from "@/feature/addtocart_slice";
import { useRouter } from "next/navigation";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [cartsItemsList, setCartsItemsList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1️⃣ Fetch user
        const profileRes = await AuthProfile();
        if (profileRes?.data) {
          dispatch(setUser(profileRes.data));
          dispatch(setIsAuthenticated(true));
        }

        // 2️⃣ Fetch cart
        const cartRes = await getuserCartItems();
        setCartsItemsList(cartRes?._payload?.items);
        const normalizedCart =
          cartRes?._payload?.items?.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })) || [];

        dispatch(setCart(normalizedCart));
      } catch (error) {
        console.error(error);
      }
    };

    initApp();
  }, [dispatch]);

 

  return (
    <div>
      <Navbar user={user} cartsItemsList={cartsItemsList} />
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
