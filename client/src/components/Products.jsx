import React, { useEffect, useState } from "react";
import Product from "./Product";
import classes from "../styles/Products.module.css";
import { Link, useLoaderData } from "react-router-dom";

const Products = () => {
  const products = useLoaderData();
  return (
    <>
      <ul className={classes.container}>
        {products &&
          products.map((product) => (
            <li key={product._id}>
              <Link to={product._id} relative="route">
                <Product product={product} />
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Products;

export async function loader() {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    // ...
  } else {
    const resData = await response.json();
    return resData.data;
  }
}
