 "use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/component/custom-ui/product_card";
import { getProductsByCategory } from "@/services/product";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, PackageOpen } from "lucide-react";

const CategoryProductPage = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getProductsByCategory(id);
        setProducts(res?._payload || []);
      } catch (error) {
        console.error("Failed to fetch products:", error?.message);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-16 gap-4">
        <Loader2 className="animate-spin w-8 h-8" />
        <p className="text-lg font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  py-6">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <PackageOpen className="w-10 h-10 opacity-60" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm text-muted-foreground">
            Try exploring other categories or check back later.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products?.map((product) => (
            <div key={product._id} className="hover:scale-[1.02] transition-transform duration-200">
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CategoryProductPage;
