const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Strip trailing "/api" to avoid duplication in path construction (e.g. login/refresh)
export const BASE_URL = rawUrl.endsWith("/api") ? rawUrl.slice(0, -4) : rawUrl;
