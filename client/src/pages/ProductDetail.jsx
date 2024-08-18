import { Helmet } from "react-helmet-async";
import ProductDetails from "../components/ProductDetails";

const ProductDetailPage = () => {
  return (
    <>
      <Helmet>
        <title>Product Detail Page</title>
      </Helmet>
      <ProductDetails />
    </>
  );
};

export default ProductDetailPage;
