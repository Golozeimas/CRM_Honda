import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLandingPage } from "./pages/PublicLandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}