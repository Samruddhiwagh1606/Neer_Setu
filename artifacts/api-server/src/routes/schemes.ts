import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { schemesTable, articlesTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router: IRouter = Router();

router.get("/schemes", async (req, res) => {
  try {
    const { state } = req.query;
    let schemes;
    if (state && typeof state === "string") {
      schemes = await db.select().from(schemesTable).where(ilike(schemesTable.state, `%${state}%`));
    } else {
      schemes = await db.select().from(schemesTable);
    }
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

router.get("/articles", async (req, res) => {
  try {
    const { category } = req.query;
    let articles;
    if (category && typeof category === "string") {
      articles = await db.select().from(articlesTable).where(eq(articlesTable.category, category));
    } else {
      articles = await db.select().from(articlesTable);
    }
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

export default router;
