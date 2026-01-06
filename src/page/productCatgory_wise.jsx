"use client";
import ProductCard from "@/component/custom-ui/product_card";
import { getProducts } from "@/services/product";
import { useEffect, useState } from "react";

export default function ProductCategoryWise() {
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

  // 🔹 Group products by category ID

  const categoryWiseProducts = products?.reduce((acc, product) => {
    const categoryId = product?.category?._id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryInfo: product.category,
        products: [],
      };
    }

    acc[categoryId].products.push(product);
    return acc;
  }, {});

  return (
    <div className="">
      {Object.values(categoryWiseProducts).map(({ categoryInfo, products }) => (
        <div key={categoryInfo._id}>
          {/* Category Header */}
          <div className="flex items-center gap-3 mt-5">
            <h2 className="text-xl font-semibold">
              {categoryInfo?.category_name}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
