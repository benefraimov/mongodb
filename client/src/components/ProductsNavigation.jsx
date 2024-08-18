import React from "react";
import { NavLink, useRouteLoaderData } from "react-router-dom";
import classes from "./ProductsNavigation.module.css";

const ProductsNavigation = () => {
  const token = useRouteLoaderData("root");
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end>
              Products
            </NavLink>
          </li>
          {token && (
            <li>
              <NavLink
                to="newProduct"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }>
                New Product
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default ProductsNavigation;
