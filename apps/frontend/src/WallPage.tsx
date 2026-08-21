import { useAuth } from "./AuthContext";

export default function WallPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Стена пользователя {user?.username}</h1>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}
