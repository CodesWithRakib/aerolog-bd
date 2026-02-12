import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// For static/ISR fetching
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster reads
});

// For live preview/listening (requires token)
export const clientWithToken = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Need fresh data for preview
  token: process.env.SANITY_API_TOKEN,
});
