import { Redis } from 'ioredis'

const globalForRedis = globalThis as unknown as { redis?: Redis }

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1
  })

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

export const safeRedis = {
  async get(key: string) {
    try {
      if (redis.status === 'wait') {
        await redis.connect()
      }
      return await redis.get(key)
    } catch {
      return null
    }
  },
  async set(key: string, value: string, ttlSeconds?: number) {
    try {
      if (redis.status === 'wait') {
        await redis.connect()
      }
      if (ttlSeconds) {
        await redis.set(key, value, 'EX', ttlSeconds)
      } else {
        await redis.set(key, value)
      }
    } catch {
      return
    }
  },
  async del(key: string) {
    try {
      if (redis.status === 'wait') {
        await redis.connect()
      }
      await redis.del(key)
    } catch {
      return
    }
  }
}
