import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LinksComponent from "./LinksComponent";
import WalletWrapper from "./WalletWrapper";
import "@rainbow-me/rainbowkit/styles.css";

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
    <WalletWrapper>
      <RouterProvider router={router} />
    </WalletWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
