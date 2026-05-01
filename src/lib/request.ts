import { headers } from "next/headers";

export async function getRequestMeta() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    undefined;
  const userAgent = h.get("user-agent") || undefined;
  return { ip, userAgent };
}

