// For React 19 Compatibility
import '@ant-design/v5-patch-for-react-19';

import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import './styles/style.css';

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
