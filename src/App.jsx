import { Routes, Route } from "react-router-dom";
import CreateWish from "./pages/CreateWish";
import ViewWish from "./pages/ViewWish";
import SurpriseVideo from "./pages/SurpriseVideo";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50">
      <Routes>
        <Route path="/" element={<CreateWish />} />
        <Route path="/wish/:id" element={<ViewWish />} />
        <Route path="/surprise/:id" element={<SurpriseVideo />} />
      </Routes>
    </div>
  );
}
