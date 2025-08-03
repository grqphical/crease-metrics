import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Goalies from "./Routes/Goalies";
import Index from "./Routes/Index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/goalies" element={<Goalies />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
