"use client";
import { getCategories } from "@/services/category";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const [categoryLists, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategories();
        setCategoryList(res?._payload || []);
      } catch (error) {
        console.log(error?.message);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="flex flex-wrap  gap-6 cursor-pointer">
        {categoryLists.map((category) => (
          <div key={category._id}>
            <img
              src={category.category_image.image_link}
              alt={category.category_name}
              className="w-25 h-30  mb-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
