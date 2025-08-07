import Redis from 'ioredis'

export const RedisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: 18068,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME
});

RedisClient.on('error', err => console.log('Redis Client Error', err));


