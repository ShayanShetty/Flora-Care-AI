import { Router, type IRouter } from "express";
import { diseaseData } from "../lib/disease-data.js";
import { GetDiseaseParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/diseases", async (req, res): Promise<void> => {
  const search = req.query["search"];
  const searchStr = typeof search === "string" ? search.toLowerCase() : "";

  let results = diseaseData;
  if (searchStr) {
    results = diseaseData.filter(
      (d) =>
        d.plantName.toLowerCase().includes(searchStr) ||
        d.diseaseName.toLowerCase().includes(searchStr) ||
        d.description.toLowerCase().includes(searchStr)
    );
  }

  res.json(results);
});

router.get("/diseases/:id", async (req, res): Promise<void> => {
  const params = GetDiseaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const disease = diseaseData.find((d) => d.id === params.data.id);
  if (!disease) {
    res.status(404).json({ error: "Disease not found" });
    return;
  }

  res.json(disease);
});

export default router;
