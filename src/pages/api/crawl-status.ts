import { Request, Response } from "express";
import { authenticateUser } from "./auth";
import { RateLimiterMode } from "../../../src/types";
import { addWebScraperJob } from "../../../src/services/queue-jobs";
import { getWebScraperQueue } from "../../../src/services/queue-service";
import { VercelRequest, VercelResponse } from "@vercel/node";

export async function crawlStatusController(req: VercelRequest, res: VercelResponse) {
  try {
    const { success, team_id, error, status } = await authenticateUser(
      req,
      res,
      RateLimiterMode.CrawlStatus
    );
    if (!success) {
      res.status(status).json({ error });
    }
    const job = await getWebScraperQueue().getJob(req.query.jobId);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
    }

    const { current, current_url, total, current_step } = await job.progress();
    res.json({
      status: await job.getState(),
      // progress: job.progress(),
      current: current,
      current_url: current_url,
      current_step: current_step,
      total: total,
      data: job.returnvalue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
