import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { providersTable } from "@workspace/db";
import { eq, ilike, and, or, SQL } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { UpdateProviderProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { city, state } = req.query;
    let conditions: SQL[] = [];
    if (city && typeof city === "string") {
      conditions.push(ilike(providersTable.city, `%${city}%`));
    }
    if (state && typeof state === "string") {
      conditions.push(ilike(providersTable.state, `%${state}%`));
    }
    const providers = conditions.length > 0
      ? await db.select().from(providersTable).where(and(...conditions))
      : await db.select().from(providersTable);
    res.json(providers);
  } catch (error) {
    console.error("Get providers error:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

router.get("/me", requireAuth, async (req: any, res) => {
  try {
    const [provider] = await db.select().from(providersTable)
      .where(eq(providersTable.userId, req.userId)).limit(1);
    if (!provider) {
      return res.status(404).json({ error: "Provider profile not found" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch provider profile" });
  }
});

router.put("/me", requireAuth, async (req: any, res) => {
  try {
    const parsed = UpdateProviderProfileBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const [provider] = await db.update(providersTable)
      .set(parsed.data)
      .where(eq(providersTable.userId, req.userId))
      .returning();
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [provider] = await db.select().from(providersTable).where(eq(providersTable.id, id)).limit(1);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch provider" });
  }
});

export default router;
