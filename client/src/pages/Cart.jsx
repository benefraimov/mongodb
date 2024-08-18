import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HomePage() {
  const navigate = useNavigate();

  function navigateHandler() {
    // example
    navigate("/products");
  }
  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <h1>Your Cart</h1>
    </>
  );
}

export default HomePage;
