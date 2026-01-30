"use client";
import Categorypage from "@/page/category/category-page";
import { useParams } from "next/navigation";
import React, { use } from "react";

export default async function page() {
  const params = useParams();
  const id = params.id;
  return (
    <div>
      <Categorypage id={id} />
    </div>
  );
}
