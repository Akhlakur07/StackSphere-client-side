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
import AdminPrivateRoute from "../private/AdminPrivateRoute";
import AdminDashboardLayout from "../pages/admin/AdminDashboardLayout";
import StatisticsPage from "../pages/admin/StatisticsPage";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCoupons from "../pages/admin/ManageCoupons";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage/>,
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
      {
        path: "/products",
        Component: Products,
      },
      {
        path: "/product/:id",
        element: (
          <UserPrivateRoute>
            <ProductDetails />
          </UserPrivateRoute>
        ),
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
  {
    path: "/admin",
    element: (
      <AdminPrivateRoute>
        <AdminDashboardLayout />
      </AdminPrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/statistics" replace />,
      },
      {
        path: "statistics",
        Component: StatisticsPage,
      },
      {
        path: "manage-users",
        Component: ManageUsers,
      },
      {
        path: "manage-coupons",
        Component: ManageCoupons,
      },
    ],
  },
]);

export default router;
