import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Arcwatch from "../../app/page";
import "../../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Arcwatch />
  </StrictMode>,
);
