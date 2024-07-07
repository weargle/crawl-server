import { VercelRequest, VercelResponse } from "@vercel/node";
import { getWebScraperQueue } from "../../../src/services/queue-service";

export async function crawlJobStatusPreviewController(req: VercelRequest, res: VercelResponse) {
  try {
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
