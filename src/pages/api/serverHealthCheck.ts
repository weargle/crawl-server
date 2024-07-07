import { VercelRequest, VercelResponse } from "@vercel/node";
import { getWebScraperQueue } from "../../services/queue-service";

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const webScraperQueue = getWebScraperQueue();
        const [waitingJobs] = await Promise.all([
          webScraperQueue.getWaitingCount(),
        ]);
    
        const noWaitingJobs = waitingJobs === 0;
        // 200 if no active jobs, 503 if there are active jobs
        res.status(noWaitingJobs ? 200 : 500).json({
          waitingJobs,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}