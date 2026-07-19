import { google } from "googleapis";

function getIndexingAuth() {
  const email = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const key = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) return null;

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
}

export function isIndexingApiConfigured() {
  return Boolean(
    process.env.GOOGLE_INDEXING_CLIENT_EMAIL &&
      process.env.GOOGLE_INDEXING_PRIVATE_KEY
  );
}

export async function submitUrlForIndexing(url: string) {
  const auth = getIndexingAuth();
  if (!auth) {
    return { ok: false, error: "Google Indexing API not configured" };
  }

  try {
    const indexing = google.indexing({ version: "v3", auth });
    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Indexing submission failed";
    return { ok: false, error: message };
  }
}
