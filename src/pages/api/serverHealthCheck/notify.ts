import { VercelRequest, VercelResponse } from "@vercel/node";
import { getWebScraperQueue } from "../../../services/queue-service";


export default async (req: VercelRequest, res: VercelResponse) => {
    if (process.env.SLACK_WEBHOOK_URL) {
        const treshold = 1; // The treshold value for the active jobs
        const timeout = 60000; // 1 minute // The timeout value for the check in milliseconds
    
        const getWaitingJobsCount = async () => {
          const webScraperQueue = getWebScraperQueue();
          const [waitingJobsCount] = await Promise.all([
            webScraperQueue.getWaitingCount(),
          ]);
    
          return waitingJobsCount;
        };
    
        res.status(200).json({ message: "Check initiated" });
    
        const checkWaitingJobs = async () => {
          try {
            let waitingJobsCount = await getWaitingJobsCount();
            if (waitingJobsCount >= treshold) {
              setTimeout(async () => {
                // Re-check the waiting jobs count after the timeout
                waitingJobsCount = await getWaitingJobsCount(); 
                if (waitingJobsCount >= treshold) {
                  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
                  const message = {
                    text: `⚠️ Warning: The number of active jobs (${waitingJobsCount}) has exceeded the threshold (${treshold}) for more than ${timeout/60000} minute(s).`,
                  };
    
                  const response = await fetch(slackWebhookUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                  })
                  
                  if (!response.ok) {
                    console.error('Failed to send Slack notification')
                  }
                }
              }, timeout);
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        checkWaitingJobs();
      }
}