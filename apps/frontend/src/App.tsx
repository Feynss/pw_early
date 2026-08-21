import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WallPage from "./WallPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/wall" element={<WallPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/wall" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}