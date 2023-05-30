import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LinksComponent from "./LinksComponent";
import WalletWrapper from "./WalletWrapper";
import "@rainbow-me/rainbowkit/styles.css";
import CreateLinktree from "./CreateLinktree";
import { ChakraProvider } from "@chakra-ui/react";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "linktree/:id",
    element: <LinksComponent />,
  },
  {
    path: "createlinktree",
    element: <CreateLinktree />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <WalletWrapper>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </WalletWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
