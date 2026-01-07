 import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "@/feature/addtocart_slice";
import {
  addTocart,
  getuserCartItems,
  removeFromCartApi,
} from "@/services/cart";
import { toast } from "react-toastify";

export default function CartDrawer({ open, close }) {
  const dispatch = useDispatch();
  const [cartsItemsList, setCartsItemsList] = useState([]);

  // 🔁 Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await getuserCartItems();
      setCartsItemsList(res?._payload?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔒 Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // ⌨️ ESC close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [close]);

  // ➕ Increase
  const handleIncrease = async (item) => {
    try {
      dispatch(increaseQuantity({ product: item.product._id }));
      await addTocart({
        items: {
          product: item.product._id,
          quantity: item.quantity + 1,
        },
      });
      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // ➖ Decrease / Remove
  const handleDecrease = async (item) => {
    try {
      if (item.quantity === 1) {
        dispatch(decreaseQuantity({ product: item.product._id }));
        await removeFromCartApi({ product: item.product._id });
        toast.success("Item removed");
      } else {
        dispatch(decreaseQuantity({ product: item.product._id }));
        await addTocart({
          items: {
            product: item.product._id,
            quantity: item.quantity - 1,
          },
        });
      }
      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // 💰 Total
  const totalAmount = useMemo(() => {
    return cartsItemsList.reduce(
      (sum, item) => sum + item.product.product_price * item.quantity,
      0
    );
  }, [cartsItemsList]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] bg-white
        flex flex-col
        shadow-[-4px_0_20px_rgba(0,0,0,0.2)]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header (Sticky) */}
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Cart</h2>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {cartsItemsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cartsItemsList.map((item) => {
              const { product, quantity } = item;
              const image = product.product_images?.[0]?.image_link;

              return (
                <div
                  key={product._id}
                  className="flex items-start gap-3 border-b pb-4"
                >
                  <img
                    src={image}
                    alt={product.product_name}
                    className="w-16 h-16 rounded-lg border object-contain"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹{product.product_price}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-1 text-lg hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-3 py-1 text-lg hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-semibold whitespace-nowrap">
                    ₹{product.product_price * quantity}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Bill Summary */}
        <div className="border-t px-4 py-4 text-sm space-y-2 bg-gray-50">
          <div className="flex justify-between text-gray-600">
            <span>Item total</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Delivery fee</span>
            <span>FREE</span>
          </div>

          <div className="flex justify-between font-semibold text-base text-black">
            <span>To pay</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Footer (Sticky) */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-4">
          <button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white
            py-3 rounded-xl font-semibold text-base transition"
          >
            Add Address to proceed
          </button>
        </div>
      </div>
    </>
  );
}
