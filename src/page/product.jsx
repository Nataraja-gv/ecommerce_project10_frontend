"use client";
import ProductCard from "@/component/custom-ui/product_card";
import { getProducts } from "@/services/product";
import { useEffect, useState } from "react";

export default function Productpage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res?._payload || []);
      } catch (error) {
        console.log(error?.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
