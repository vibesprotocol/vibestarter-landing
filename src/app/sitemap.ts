import type { MetadataRoute } from "next";

const BASE_URL = "https://vibestarter.xyz";

const PATHS = ["", "/thesis", "/whitepaper", "/terms", "/privacy", "/risk-disclosure"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${BASE_URL}${path}` }));
}
