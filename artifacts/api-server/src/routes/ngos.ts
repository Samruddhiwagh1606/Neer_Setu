import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ngosTable, providersTable, campaignsTable, serviceRequestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateCampaignBody, InviteProviderBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req: any, res) => {
  try {
    const [ngo] = await db.select().from(ngosTable)
      .where(eq(ngosTable.userId, req.userId)).limit(1);
    if (!ngo) {
      return res.status(404).json({ error: "NGO profile not found" });
    }
    const providerCount = await db.select().from(providersTable)
      .where(eq(providersTable.ngoId, ngo.id));
    const allRequests = await db.select().from(serviceRequestsTable);
    const completedInstallations = allRequests.filter(r => r.status === "completed").length;
    res.json({
      ...ngo,
      providerCount: providerCount.length,
      totalInstallations: completedInstallations,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch NGO profile" });
  }
});

router.get("/me/providers", requireAuth, async (req: any, res) => {
  try {
    const [ngo] = await db.select().from(ngosTable)
      .where(eq(ngosTable.userId, req.userId)).limit(1);
    if (!ngo) return res.json([]);
    const providers = await db.select().from(providersTable)
      .where(eq(providersTable.ngoId, ngo.id));
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch NGO providers" });
  }
});

router.get("/me/campaigns", requireAuth, async (req: any, res) => {
  try {
    const [ngo] = await db.select().from(ngosTable)
      .where(eq(ngosTable.userId, req.userId)).limit(1);
    if (!ngo) return res.json([]);
    const campaigns = await db.select().from(campaignsTable)
      .where(eq(campaignsTable.ngoId, ngo.id));
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

router.post("/me/campaigns", requireAuth, async (req: any, res) => {
  try {
    const [ngo] = await db.select().from(ngosTable)
      .where(eq(ngosTable.userId, req.userId)).limit(1);
    if (!ngo) return res.status(404).json({ error: "NGO not found" });

    const parsed = CreateCampaignBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const [campaign] = await db.insert(campaignsTable).values({
      ngoId: ngo.id,
      title: parsed.data.title,
      description: parsed.data.description,
      targetAudience: parsed.data.targetAudience || null,
      startDate: parsed.data.startDate || null,
      endDate: parsed.data.endDate || null,
      status: "planned",
    }).returning();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

router.post("/invite-provider", requireAuth, async (req: any, res) => {
  try {
    const parsed = InviteProviderBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    // In a real app, send an invite email. For now, just acknowledge.
    res.json({ message: `Invitation sent to ${parsed.data.email}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to send invite" });
  }
});

export default router;
