import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { serviceRequestsTable, usersTable, providersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateServiceRequestBody, UpdateServiceRequestStatusBody, RateProviderBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: any, res) => {
  try {
    let requests;
    if (req.userRole === "user") {
      requests = await db.select({
        id: serviceRequestsTable.id,
        userId: serviceRequestsTable.userId,
        providerId: serviceRequestsTable.providerId,
        requestType: serviceRequestsTable.requestType,
        systemType: serviceRequestsTable.systemType,
        location: serviceRequestsTable.location,
        preferredDate: serviceRequestsTable.preferredDate,
        status: serviceRequestsTable.status,
        notes: serviceRequestsTable.notes,
        rating: serviceRequestsTable.rating,
        review: serviceRequestsTable.review,
        createdAt: serviceRequestsTable.createdAt,
        userName: usersTable.name,
      }).from(serviceRequestsTable)
        .innerJoin(usersTable, eq(serviceRequestsTable.userId, usersTable.id))
        .where(eq(serviceRequestsTable.userId, req.userId));
    } else if (req.userRole === "provider") {
      const [provider] = await db.select().from(providersTable)
        .where(eq(providersTable.userId, req.userId)).limit(1);
      if (!provider) return res.json([]);
      requests = await db.select({
        id: serviceRequestsTable.id,
        userId: serviceRequestsTable.userId,
        providerId: serviceRequestsTable.providerId,
        requestType: serviceRequestsTable.requestType,
        systemType: serviceRequestsTable.systemType,
        location: serviceRequestsTable.location,
        preferredDate: serviceRequestsTable.preferredDate,
        status: serviceRequestsTable.status,
        notes: serviceRequestsTable.notes,
        rating: serviceRequestsTable.rating,
        review: serviceRequestsTable.review,
        createdAt: serviceRequestsTable.createdAt,
        userName: usersTable.name,
      }).from(serviceRequestsTable)
        .innerJoin(usersTable, eq(serviceRequestsTable.userId, usersTable.id))
        .where(eq(serviceRequestsTable.providerId, provider.id));
    } else {
      // NGO - show all requests
      requests = await db.select({
        id: serviceRequestsTable.id,
        userId: serviceRequestsTable.userId,
        providerId: serviceRequestsTable.providerId,
        requestType: serviceRequestsTable.requestType,
        systemType: serviceRequestsTable.systemType,
        location: serviceRequestsTable.location,
        preferredDate: serviceRequestsTable.preferredDate,
        status: serviceRequestsTable.status,
        notes: serviceRequestsTable.notes,
        rating: serviceRequestsTable.rating,
        review: serviceRequestsTable.review,
        createdAt: serviceRequestsTable.createdAt,
        userName: usersTable.name,
      }).from(serviceRequestsTable)
        .innerJoin(usersTable, eq(serviceRequestsTable.userId, usersTable.id));
    }
    const requestsWithProvider = await Promise.all(
      (requests || []).map(async (r) => {
        let providerName = null;
        if (r.providerId) {
          const [p] = await db.select().from(providersTable).where(eq(providersTable.id, r.providerId)).limit(1);
          providerName = p?.name || null;
        }
        return { ...r, providerName };
      })
    );
    res.json(requestsWithProvider);
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

router.post("/", requireAuth, async (req: any, res) => {
  try {
    const parsed = CreateServiceRequestBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const [request] = await db.insert(serviceRequestsTable).values({
      userId: req.userId,
      providerId: parsed.data.providerId || null,
      requestType: parsed.data.requestType,
      systemType: parsed.data.systemType,
      location: parsed.data.location,
      preferredDate: parsed.data.preferredDate || null,
      notes: parsed.data.notes || null,
      status: "pending",
    }).returning();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId)).limit(1);
    res.json({ ...request, userName: user?.name || "", providerName: null });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
});

router.put("/:id/status", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = UpdateServiceRequestStatusBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const [request] = await db.update(serviceRequestsTable)
      .set({ status: parsed.data.status })
      .where(eq(serviceRequestsTable.id, id))
      .returning();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, request.userId)).limit(1);
    res.json({ ...request, userName: user?.name || "", providerName: null });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.post("/:id/rate", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = RateProviderBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid rating" });
    }
    const [request] = await db.update(serviceRequestsTable)
      .set({ rating: parsed.data.rating, review: parsed.data.review || null })
      .where(eq(serviceRequestsTable.id, id))
      .returning();

    // Update provider average rating
    if (request.providerId) {
      const allRequests = await db.select().from(serviceRequestsTable)
        .where(eq(serviceRequestsTable.providerId, request.providerId));
      const rated = allRequests.filter(r => r.rating !== null);
      if (rated.length > 0) {
        const avgRating = rated.reduce((acc, r) => acc + (r.rating || 0), 0) / rated.length;
        await db.update(providersTable)
          .set({ rating: avgRating, reviewCount: rated.length })
          .where(eq(providersTable.id, request.providerId));
      }
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, request.userId)).limit(1);
    res.json({ ...request, userName: user?.name || "", providerName: null });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

export default router;
