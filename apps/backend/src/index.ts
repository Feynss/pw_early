import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import { signToken } from "./jwt";
import { prisma } from "./db";
import { requireAuth, AuthRequest } from "./authMiddleware";

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173" }));
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

  const token = signToken(user.id);

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, username: user.username },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user.id);

  res.json({
    token,
    user: { id: user.id, email: user.email, username: user.username },
  });
});

app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ id: user!.id, email: user!.email, username: user!.username });
});

app.post("/api/posts", requireAuth, async (req: AuthRequest, res) => {
  const { content } = req.body;

  const post = await prisma.post.create({
    data: {
      content,
      authorId: req.userId!,
    },
  });

  res.status(201).json(post);
});

app.get("/api/posts/wall/:username", async (req, res) => {
  const wallOwner = await prisma.user.findUnique({
    where: { username: req.params.username },
  });

  if (!wallOwner) {
    return res.status(404).json({ message: "User not found" });
  }

  const posts = await prisma.post.findMany({
    where: { authorId: wallOwner.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
