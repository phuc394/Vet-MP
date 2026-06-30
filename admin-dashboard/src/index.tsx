import React from "react";
import { createRoot } from "react-dom/client";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/global.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import AdminResourcePage from "./pages/admin/AdminResourcePage";
import RequireAuth from "./components/admin/RequireAuth";
import { adminResources } from "./pages/admin/adminResources";
import { store } from "./redux/store";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
  ...adminResources.map((resource) => ({
    path: resource.path,
    element: (
      <RequireAuth>
        <AdminResourcePage resource={resource} />
      </RequireAuth>
    ),
  })),
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  }
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
