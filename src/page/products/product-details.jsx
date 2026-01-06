"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "@/feature/addtocart_slice";

import { addTocart, removeFromCartApi } from "@/services/cart";
import { getProductsDetails, getProducts } from "@/services/product";
import ProductCard from "@/component/custom-ui/product_card";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItem.items);
  const cartItem = cartItems.find((item) => item.product === id);

  useEffect(() => {
    const fetchData = async () => {
      const productRes = await getProductsDetails(id);
      const productData = productRes?._payload;

      setProduct(productData);
      setActiveImage(productData?.product_images?.[0]?.image_link);

      // FETCH ALL PRODUCTS
      const allProductsRes = await getProducts();
      const allProducts = allProductsRes?._payload || [];

      // FILTER RELATED PRODUCTS
      const related = allProducts.filter(
        (item) => item._id !== id && item.category?._id === productData.category
      );

      setRelatedProducts(related.slice(0, 6)); // limit to 6
    };

    if (id) fetchData();
  }, [id]);

  if (!product) return <div className="p-10">Loading...</div>;

  const discountAmount = product.mrp - product.product_price;

  /* CART HANDLERS */
  const handleAddToCart = async () => {
    try {
      dispatch(addToCart({ product: id, quantity: 1 }));
      await addTocart({ items: { product: id, quantity: 1 } });
      toast.success("Product added to cart");
    } catch {
      toast.error("Error adding product");
    }
  };

  const handleIncrease = async () => {
    try {
      dispatch(increaseQuantity({ product: id }));
      await addTocart({
        items: { product: id, quantity: cartItem.quantity + 1 },
      });
    } catch {
      toast.error("Failed to update cart");
    }
  };

  const handleDecrease = async () => {
    try {
      if (cartItem.quantity === 1) {
        dispatch(decreaseQuantity({ product: id }));
        await removeFromCartApi({ product: id });
        return;
      }

      dispatch(decreaseQuantity({ product: id }));
      await addTocart({
        items: { product: id, quantity: cartItem.quantity - 1 },
      });
    } catch {
      toast.error("Failed to update cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* PRODUCT DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.product_images.map((img) => (
              <img
                key={img._id}
                src={img.image_link}
                onClick={() => setActiveImage(img.image_link)}
                className={`w-16 h-16 rounded-lg border cursor-pointer
                  ${
                    activeImage === img.image_link
                      ? "border-pink-500"
                      : "border-gray-200"
                  }`}
              />
            ))}
          </div>

          <div className="flex-1 flex justify-center items-center">
            <img
              src={activeImage}
              className="w-[420px] rounded-xl"
              alt={product.product_name}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-2xl font-semibold">{product.product_name}</h1>

          <div className="flex gap-3 mt-4 items-center">
            <span className="text-3xl font-bold text-green-600">
              ₹{product.product_price}
            </span>
            <span className="line-through text-gray-400">₹{product.mrp}</span>
            <span className="text-green-600 font-medium">
              ₹{discountAmount} OFF
            </span>
          </div>

          <p className="mt-5 text-gray-600">{product.product_description}</p>

          {/* CART UI */}
          {cartItem ? (
            <div className="mt-6 flex w-40 items-center justify-between border rounded-lg px-4 py-2">
              <button onClick={handleDecrease}>−</button>
              <span>{cartItem.quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={cartItem.quantity >= product.stock}
              >
                +
              </button>
            </div>
          ) : (
            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="mt-6 w-48 border border-pink-600 text-pink-600 py-2 rounded-lg
                hover:bg-pink-600 hover:text-white transition"
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>

      {/* 🔥 RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-5">Related Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
