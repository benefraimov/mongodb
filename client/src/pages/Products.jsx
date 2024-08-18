import React from "react";
import { Helmet } from "react-helmet-async";
import Products from "../components/Products";

const ProductsPage = () => {
  return (
    <>
      <Helmet>
        <title>Products Page</title>
      </Helmet>
      <Products />
    </>
  );
};

export default ProductsPage;
