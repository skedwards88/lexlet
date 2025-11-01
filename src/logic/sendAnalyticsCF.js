import {v4 as uuidv4} from "uuid";

const ANALYTICS_ENDPOINT =
  "https://analytics.skedwards88.workers.dev/analytics";

export function sendAnalyticsCF({userId, sessionId, analyticsToLog}) {
  const mode = process.env.NODE_ENV;
  if (mode === "development" || mode === "test") {
    console.log(
      `Not logging because in ${mode} mode: ${JSON.stringify(analyticsToLog)}`,
    );
    return;
  }

  const payload = analyticsToLog.map((event) => ({
    ...event,
    userId,
    sessionId,
    eventId: uuidv4(),
    clientMs: Date.now(),
  }));

  // Don't await the response since the app doesn't care
  void fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({batch: payload}),
    keepalive: true,
  }).catch((error) => {
    console.error("Failed to send analytics", error);
  });
}
