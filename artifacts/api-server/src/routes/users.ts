import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { savedProvidersTable, providersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { SaveProviderBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/saved-providers", requireAuth, async (req: any, res) => {
  try {
    const saved = await db.select().from(savedProvidersTable)
      .where(eq(savedProvidersTable.userId, req.userId));
    const providers = await Promise.all(
      saved.map(async (s) => {
        const [p] = await db.select().from(providersTable)
          .where(eq(providersTable.id, s.providerId)).limit(1);
        return p;
      })
    );
    res.json(providers.filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved providers" });
  }
});

router.post("/saved-providers", requireAuth, async (req: any, res) => {
  try {
    const parsed = SaveProviderBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const existing = await db.select().from(savedProvidersTable)
      .where(and(
        eq(savedProvidersTable.userId, req.userId),
        eq(savedProvidersTable.providerId, parsed.data.providerId)
      )).limit(1);
    if (existing.length === 0) {
      await db.insert(savedProvidersTable).values({
        userId: req.userId,
        providerId: parsed.data.providerId,
      });
    }
    res.json({ message: "Provider saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save provider" });
  }
});

router.delete("/saved-providers/:providerId", requireAuth, async (req: any, res) => {
  try {
    const providerId = parseInt(req.params.providerId);
    await db.delete(savedProvidersTable)
      .where(and(
        eq(savedProvidersTable.userId, req.userId),
        eq(savedProvidersTable.providerId, providerId)
      ));
    res.json({ message: "Provider unsaved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unsave provider" });
  }
});

export default router;
