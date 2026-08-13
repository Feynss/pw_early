import LoginPage from "./LoginPage";
import { useAuth } from "./AuthContext";

export default function App() {
  const { user, token } = useAuth();

  return (
    <div>
      <p>Статус: {user ? `Залогинен как ${user.username}` : "Не залогинен"}</p>
      <p>Токен есть: {token ? "да" : "нет"}</p>
      <LoginPage />
    </div>
  );
}
