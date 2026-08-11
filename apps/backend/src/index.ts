import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, username, password, displayName } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, displayName },
  });

  res.status(201).json({ id: user.id, email: user.email, username: user.username });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
