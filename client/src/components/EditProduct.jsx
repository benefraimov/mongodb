import React from "react";
import { useRouteLoaderData } from "react-router-dom";
import ProductForm from "./ProductForm";

const EditProduct = () => {
  const data = useRouteLoaderData("product-detail");

  if (data.isError) {
    return <p>{data.message}</p>;
  }
  const product = data.data;
  return <ProductForm method="PUT" product={product} />;
};

export default EditProduct;
