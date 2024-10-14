import Redis from "ioredis";

export function getClient() {
  if (!((globalThis as any).redis instanceof Redis)) {
    const redis = new Redis(process.env.REDIS_URL!);
    (globalThis as any).redis = redis;
  }

  return (globalThis as any).redis as Redis;
}
