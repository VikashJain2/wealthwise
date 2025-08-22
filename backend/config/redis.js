import redis from 'redis'
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().then(()=>{
    console.log('Connected to Redis');
}).catch(console.error);
export {redisClient}