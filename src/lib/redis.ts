import * as redis from 'redis';

let redisClient: redis.RedisClientType;

if (typeof window === 'undefined') {
  if (!global.redis) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      legacyMode: true,
    });
    redisClient.connect().catch(console.error);
    global.redis = redisClient;
  } else {
    redisClient = global.redis;
  }
  console.log(process.env.REDIS_URL)
  redisClient.on("connect", (err) => {
    try {
      if (!err) console.log("Connected to Redis Session Store!");
    } catch (error) {}
  });
}

export default redisClient;