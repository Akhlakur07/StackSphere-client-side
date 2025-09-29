import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import MyProfile from "../pages/dashboard/MyProfile";
import MyProducts from "../pages/dashboard/MyProducts";
import AddProduct from "../pages/dashboard/AddProduct";
import UpdateProduct from "../pages/dashboard/UpdateProduct";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: MyProfile,
      },
      {
        path: "add-product",
        Component: AddProduct,
      },
      {
        path: "my-products",
        Component: MyProducts,
      },
      {
        path: "update-product/:id",
        Component: UpdateProduct,
      },
    ],
  },
]);

export default router;
