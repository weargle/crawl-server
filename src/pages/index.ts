import { VercelRequest, VercelResponse } from "@vercel/node";
import { redisClient } from "../services/rate-limiter";

export default (req: VercelRequest, res: VercelResponse) => {
    return res.send("SCRAPERS-JS: Hello, world! Fly.io");
}


redisClient.connect();