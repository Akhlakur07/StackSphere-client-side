import { createBrowserRouter, Navigate } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import MyProfile from "../pages/dashboard/MyProfile";
import MyProducts from "../pages/dashboard/MyProducts";
import AddProduct from "../pages/dashboard/AddProduct";
import UpdateProduct from "../pages/dashboard/UpdateProduct";
import UserPrivateRoute from "../private/UserPrivateRoute";
import ModeratorPrivateRoute from "../private/ModeratorPrivateRoute";
import ModeratorDashboardLayout from "../pages/moderator/ModeratorDashboardLayout";
import ProductReviewQueue from "../pages/moderator/ProductReviewQueue";
import ReportedContents from "../pages/moderator/ReportedContents";

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
    element: (
      <UserPrivateRoute>
        <DashboardLayout />
      </UserPrivateRoute>
    ),
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
  {
    path: "/moderator",
    element: (
      <ModeratorPrivateRoute>
        <ModeratorDashboardLayout />
      </ModeratorPrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/moderator/review-queue" replace />,
      },
      {
        path: "review-queue",
        Component: ProductReviewQueue,
      },
      {
        path: "reported-contents",
        Component: ReportedContents,
      },
    ],
  },
]);

export default router;
