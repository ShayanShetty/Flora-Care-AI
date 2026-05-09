import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { eq, desc, count, sql } from "drizzle-orm";
import multer from "multer";
import { db, scansTable } from "@workspace/db";
import { GetScanParams } from "@workspace/api-zod";
import { verifyToken } from "../lib/auth.js";
import { analyzePlantImage } from "../lib/plant-analyzer.js";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function requireAuth(req: Parameters<Parameters<typeof router.use>[0]>[0]): { userId: string; username: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}

router.get("/scans", async (req, res): Promise<void> => {
  const auth = requireAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const scans = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.userId, auth.userId))
    .orderBy(desc(scansTable.scannedAt));

  res.json(
    scans.map((s) => ({
      ...s,
      symptoms: s.symptoms ?? undefined,
      treatment: s.treatment ?? undefined,
      prevention: s.prevention ?? undefined,
      scannedAt: s.scannedAt.toISOString(),
    }))
  );
});

router.post("/scans", upload.single("image"), async (req, res): Promise<void> => {
  const auth = requireAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  const imageBase64 = file.buffer.toString("base64");
  const mimeType = file.mimetype;

  const imageUrl = `data:${mimeType};base64,${imageBase64}`;

  const analysis = await analyzePlantImage(imageBase64, mimeType);

  const id = randomUUID();
  const [scan] = await db
    .insert(scansTable)
    .values({
      id,
      userId: auth.userId,
      imageUrl,
      plantName: analysis.plantName,
      diseaseName: analysis.diseaseName,
      confidence: analysis.confidence,
      isHealthy: analysis.isHealthy,
      description: analysis.description,
      symptoms: analysis.symptoms,
      treatment: analysis.treatment,
      prevention: analysis.prevention,
    })
    .returning();

  res.status(201).json({
    ...scan,
    symptoms: scan.symptoms ?? undefined,
    treatment: scan.treatment ?? undefined,
    prevention: scan.prevention ?? undefined,
    scannedAt: scan.scannedAt.toISOString(),
  });
});

router.get("/scans/stats", async (req, res): Promise<void> => {
  const auth = requireAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const allScans = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.userId, auth.userId))
    .orderBy(desc(scansTable.scannedAt));

  const totalScans = allScans.length;
  const healthyScans = allScans.filter((s) => s.isHealthy).length;
  const diseasedScans = totalScans - healthyScans;
  const recentScans = allScans.slice(0, 5).map((s) => ({
    ...s,
    symptoms: s.symptoms ?? undefined,
    treatment: s.treatment ?? undefined,
    prevention: s.prevention ?? undefined,
    scannedAt: s.scannedAt.toISOString(),
  }));

  const diseaseCounts: Record<string, number> = {};
  for (const scan of allScans.filter((s) => !s.isHealthy)) {
    diseaseCounts[scan.diseaseName] = (diseaseCounts[scan.diseaseName] ?? 0) + 1;
  }

  const topDiseases = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([diseaseName, count]) => ({ diseaseName, count }));

  res.json({
    totalScans,
    diseasedScans,
    healthyScans,
    recentScans,
    topDiseases,
  });
});

router.get("/scans/:id", async (req, res): Promise<void> => {
  const auth = requireAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetScanParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scan] = await db
    .select()
    .from(scansTable)
    .where(eq(scansTable.id, params.data.id))
    .limit(1);

  if (!scan) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }

  if (scan.userId !== auth.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json({
    ...scan,
    symptoms: scan.symptoms ?? undefined,
    treatment: scan.treatment ?? undefined,
    prevention: scan.prevention ?? undefined,
    scannedAt: scan.scannedAt.toISOString(),
  });
});

export default router;
