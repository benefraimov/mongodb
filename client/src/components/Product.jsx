import React, { useEffect, useState } from "react";
import classes from "../styles/Product.module.css";
import {
  useLocation,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";

const Product = ({ product }) => {
  const token = useRouteLoaderData("root");
  const submit = useSubmit();
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setShowButton(false);
    } else if (location.pathname === "/products") {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [location]);

  const editPage = () => {
    navigate("edit");
  };

  const deleteProduct = () => {
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      submit(null, { method: "DELETE" });
    }
  };
  return (
    <>
      <div className={classes.container}>
        {product && (
          <>
            <div className={classes.header}>{product.name}</div>
            <div className={classes.image_container}>
              <img src={product.imageUrl} alt={product.name} />
            </div>
            {token && showButton && <button onClick={editPage}>Edit</button>}
            {token && showButton && (
              <button onClick={deleteProduct}>Delete</button>
            )}
            <div className={classes.description}>{product.description}</div>
          </>
        )}
      </div>
    </>
  );
};

export default Product;
