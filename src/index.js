import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LinksComponent from "./LinksComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "linktree/:id",
    element: <LinksComponent />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
