const GLOBAL_KEY = "__NEXUS_RPG_MEMORY_VOICE__";

export function mountOnce<T extends { resume?: () => void }>(factory: () => T): T {
  const globalObj = globalThis as any;
  const existing = globalObj[GLOBAL_KEY];
  if (existing && typeof existing === "object") {
    try { existing.resume?.(); } catch {}
    return existing;
  }

  const instance = factory();
  globalObj[GLOBAL_KEY] = instance;
  return instance;
}
