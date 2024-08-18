import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import pages
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import ProductsRootLayout from "./pages/ProductsRoot";
import ProductsPage from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetail";
import EditProductPage from "./pages/EditProduct";
import NewProductPage from "./pages/NewProduct";
import AuthenticationPage from "./pages/Authentication";
// import loaders
import { loader as homeProductsLoader } from "./components/HomeProducts";
import { loader as productsLoader } from "./components/Products";
import { loader as productLoader } from "./components/ProductDetails";
import { tokenLoader, checkAuthLoader } from "./util/auth";
// import actions
import { action as manipulateProductAction } from "./components/ProductForm";
import { action as deleteProductAction } from "./components/ProductDetails";
import { action as authAction } from "./components/AuthForm";
import { action as logoutAction } from "./pages/LogOut";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeProductsLoader,
      },
      {
        path: "products",
        element: <ProductsRootLayout />,
        children: [
          { index: true, element: <ProductsPage />, loader: productsLoader },
          {
            path: ":productId",
            id: "product-detail",
            loader: productLoader,
            children: [
              {
                index: true,
                element: <ProductDetailPage />,
                action: deleteProductAction,
              },
              {
                path: "edit",
                element: <EditProductPage />,
                action: manipulateProductAction,
                loader: checkAuthLoader,
              },
            ],
          },
          {
            path: "newProduct",
            element: <NewProductPage />,
            action: manipulateProductAction,
            loader: checkAuthLoader,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthenticationPage />,
        action: authAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
