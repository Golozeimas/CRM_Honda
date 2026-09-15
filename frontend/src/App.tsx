import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublicLandingPage } from "./pages/PublicLandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </BrowserRouter>
  );
}