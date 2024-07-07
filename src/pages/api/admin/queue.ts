import { VercelRequest, VercelResponse } from "@vercel/node";
import { getWebScraperQueue } from "src/services/queue-service";

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const webScraperQueue = getWebScraperQueue();
        const [webScraperActive] = await Promise.all([
          webScraperQueue.getActiveCount(),
        ]);
    
        const noActiveJobs = webScraperActive === 0;
        // 200 if no active jobs, 503 if there are active jobs
        res.status(noActiveJobs ? 200 : 500).json({
          webScraperActive,
          noActiveJobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}