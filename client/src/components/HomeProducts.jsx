import React from "react";
import Product from "./Product";
import classes from "../styles/Products.module.css";
import { Link, useLoaderData } from "react-router-dom";

const HomeProducts = () => {
  const data = useLoaderData();

  if (data.isError) {
    return <p>{data.message}</p>;
  }
  const products = data.data;

  return (
    <>
      <ul className={classes.container}>
        {products &&
          products.map((product) => (
            <li key={product._id}>
              <Link to={`products/${product._id}`} relative="route">
                <Product product={product} />
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default HomeProducts;

export async function loader() {
  // can use everythin that we use in javascript but hooks
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    return { isError: true, message: "Could not fetch products" };
    // alternative with error page
    // throw { message: "Could not fetch products" };
  } else {
    // why to use ? reach some backend in fetch function
    return response;
  }
}
