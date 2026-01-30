"use client";
import ProductCard from "@/component/custom-ui/product_card";
import { getProductsByCategory } from "@/services/product";
import React, { useEffect, useState } from "react";

// Assuming you might have a Skeleton component in your UI library
const ProductSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg aspect-[3/4] w-full" />
);

const CategoryPage = ({ id, categoryName = "Products" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductsByCategory(id);
        setProducts(res?._payload || []);
      } catch (error) {
        console.error("Failed to fetch products:", error?.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  return (
    <div className="py-8">
      {/* Page Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">
          {categoryName}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Showing {products.length} items found in this category.
        </p>
      </header>

      {/* Main Grid Logic */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="transition-transform duration-300 hover:-translate-y-1 shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">📦</div>
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="text-gray-500">
            Try checking another category or come back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
