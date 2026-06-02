import React from "react";
import { createRoot } from "react-dom/client";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/global.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AdminResourcePage from "./pages/admin/AdminResourcePage";
import { adminResources } from "./pages/admin/adminResources";
import { store } from "./redux/store";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  ...adminResources.map((resource) => ({
    path: resource.path,
    element: <AdminResourcePage resource={resource} />,
  })),
  {
    path: "/",
    element: <Login />,
  }
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
