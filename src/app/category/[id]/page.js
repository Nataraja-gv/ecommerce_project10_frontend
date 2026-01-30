"use client";

import CategoryProductPage from "@/page/categoryproduct/category-page";
import { useParams } from "next/navigation";
import React, { use } from "react";

export default async function page() {
  const params = useParams();
  const id = params.id;
  return (
    <div>
      <CategoryProductPage id={id} />
    </div>
  );
}
