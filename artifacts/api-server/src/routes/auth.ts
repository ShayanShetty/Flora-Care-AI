import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "../lib/auth.js";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  const id = randomUUID();
  const passwordHash = hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({ id, username, passwordHash })
    .returning();

  const token = generateToken(user.id, user.username);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = generateToken(user.id, user.username);

  res.json({
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, payload.userId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
