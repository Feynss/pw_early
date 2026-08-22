import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WallPage from "./WallPage";
import ProtectedRoute from "./ProtectedRoute";  // possible future feat
import NotFoundPage from "./NotFoundPage";
import { useAuth } from "./AuthContext";

function RedirectToOwnWall() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={`/wall/${user.username}`} replace />;
}

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/wall/:username" element={<WallPage />} />

      <Route path="/wall" element={<RedirectToOwnWall />} />
      <Route path="/" element={<RedirectToOwnWall />} />

      <Route path="*" element={<NotFoundPage />} />
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