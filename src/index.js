import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WalletContextProvider } from "./contexts";
import LinksComponent from "./pages/LinksComponent";
import "@rainbow-me/rainbowkit/styles.css";
import CreateLinktree from "./pages/CreateLinktree";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import EditLinktree from "./pages/EditLinktree";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <LinksComponent />,
  },
  {
    path: "createlinktree",
    element: <CreateLinktree />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "editLinktree/:id",
    element: <EditLinktree />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <WalletContextProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </WalletContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
