import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, providersTable, ngosTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "neersetu-jwt-secret-2024";

router.post("/register", async (req, res) => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const { name, email, password, role, location, phone, serviceArea, organizationName } = parsed.data;

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
      role: role as "user" | "provider" | "ngo",
      location: location || null,
      phone: phone || null,
    }).returning();

    if (role === "provider") {
      await db.insert(providersTable).values({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: phone || null,
        serviceArea: serviceArea || "India",
        city: null,
        state: null,
      });
    } else if (role === "ngo") {
      await db.insert(ngosTable).values({
        userId: user.id,
        name: user.name,
        email: user.email,
        organizationName: organizationName || name,
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const { email, password } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.userId)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phone: user.phone,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
