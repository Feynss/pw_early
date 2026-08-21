import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useAuth } from "./AuthContext";

export default function App() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <p>Статус: {user ? `Залогинен как ${user.username}` : "Не залогинен"}</p>
      <p>Токен есть: {token ? "да" : "нет"}</p>
      <LoginPage />
      <RegisterPage />
    </div>
  );
}
