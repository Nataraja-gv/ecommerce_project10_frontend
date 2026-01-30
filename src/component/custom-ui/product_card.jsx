import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/feature/addtocart_slice";
import { addTocart, removeFromCartApi } from "@/services/cart";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const {
    product_name,
    product_price,
    mrp,
    discount_percentage,
    product_images,
    stock,
    _id,
  } = product;

  const image = product_images?.[0]?.image_link;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItem.items);
  const cartItem = cartItems.find((item) => item.product === _id);

  const handleAddToCart = async () => {
    try {
      dispatch(
        addToCart({
          product: _id,
          quantity: 1,
        })
      );

      const data = {
        items: {
          product: _id,
          quantity: 1,
        },
      };
      const res = await addTocart(data);
      if (res) {
        toast.success("product added to cart");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding product");
    }
  };

  const handleIncrease = async () => {
    try {
      dispatch(increaseQuantity({ product: _id }));
      const newQuantity = cartItem.quantity + 1;
      const data = {
        items: {
          product: _id,
          quantity: newQuantity,
        },
      };
      const res = await addTocart(data);
      if (res) {
        toast.success("Cart updated");
      }
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleDecrease = async () => {
    try {
      // CASE 1: Quantity is 1 → REMOVE ITEM
      if (cartItem.quantity === 1) {
        dispatch(decreaseQuantity({ product: _id }));

        const data = { product: _id };

        const res = await removeFromCartApi(data);
        if (res) {
          toast.success("Item removed from cart");
        }
        return;
      }

      // CASE 2: Quantity > 1 → DECREASE
      const newQuantity = cartItem.quantity - 1;

      dispatch(decreaseQuantity({ product: _id }));

      const data = {
        items: {
          product: _id,
          quantity: newQuantity,
        },
      };

      const res = await addTocart(data);
      if (res) {
        toast.success("Cart updated");
      }
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };
  const stopLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/product/${_id}`}>
      <div className="bg-white border w-full  border-gray-300 rounded-xl p-3 hover:shadow-md transition">
        {/* Image */}
        <div className="relative flex justify-center">
          <img
            src={image}
            alt={product_name}
            className="h-28 w-28 object-contain"
          />

          {discount_percentage > 0 && (
            <span className="absolute top-1 left-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
              ₹{mrp - product_price} OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-2">
          <h3 className="text-sm font-medium line-clamp-2 h-10">
            {product_name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold">₹{product_price}</span>
            <span className="text-xs text-gray-500 line-through">₹{mrp}</span>
          </div>

          {cartItem ? (
            <div className="mt-2 flex items-center justify-between border rounded-lg px-3 py-1">
              <button
                onClick={(e) => {
                  stopLink(e);
                  handleDecrease();
                }}
                className="text-lg font-semibold cursor-pointer"
              >
                −
              </button>

              <span className="font-semibold">{cartItem?.quantity}</span>

              <button
                onClick={(e) => {
                  stopLink(e);
                  handleIncrease();
                }}
                disabled={cartItem?.quantity >= stock}
                className="text-lg font-semibold disabled:opacity-50 cursor-pointer"
              >
                +
              </button>
            </div>
          ) : (
            <button
              disabled={stock === 0}
              onClick={(e) => {
                stopLink(e);
                handleAddToCart();
              }}
              className="mt-2 w-full border border-pink-600 text-pink-600 text-sm font-semibold py-1.5 rounded-lg
                     hover:bg-pink-600 hover:text-white transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
