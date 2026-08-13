const cache = new Map<string, { data: any; timestamp: number }>();

export function getClientCache<T>(key: string, maxAgeMs = 5 * 60 * 1000): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > maxAgeMs) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setClientCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearClientCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cache.clear();
    return;
  }
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}
