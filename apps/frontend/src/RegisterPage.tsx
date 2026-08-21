import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const response = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, displayName }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    login(data.user, data.token);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Регистрация</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Логин</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Никнейм</label>
        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>
      <div>
        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
