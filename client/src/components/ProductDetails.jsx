import React from "react";
import { Link, redirect, useRouteLoaderData } from "react-router-dom";
import Product from "./Product";
import { getAuthToken } from "../util/auth";

const ProductDetails = () => {
  const data = useRouteLoaderData("product-detail");

  if (data.isError) {
    return <p>{data.message}</p>;
  }
  const product = data.data;

  return (
    <>
      <h1>Product Details</h1>
      <p>
        <Link to=".." relative="path">
          Back
        </Link>
      </p>
      <Product product={product} />
    </>
  );
};

export default ProductDetails;

export async function loader({ request, params }) {
  const id = params.productId;
  const response = await fetch("http://localhost:3000/products/" + id);
  if (!response.ok) {
    return { isError: true, message: "Could not fetch product" };
  } else {
    return response;
  }
}

export async function action({ request, params }) {
  const id = params.productId;

  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/products/" + id, {
    method: request.method,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    return { isError: true, message: "Could not delete product" };
  }

  return redirect("/products");
}
