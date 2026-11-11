// DHS service worker – aggressive background alerts
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// We deliberately do NO caching so the page always stays fresh
self.addEventListener("fetch", () => {});

self.addEventListener("push", (e) => {
  let data = {};
  try {
    data = e.data ? e.data.json() : {};
  } catch (_) {
    data = { body: e.data ? e.data.text() : "Visitor alert" };
  }

  const urgent = data.urgent === true;
  const title = data.title || (urgent ? "URGENT: DHS Visitor Alert" : "DHS Visitor Alert");
  const body = data.body || "A visitor is waiting for you.";

  // Strong vibration patterns
  const vibratePattern = urgent
    ? [900, 200, 900, 200, 900, 200, 900, 200, 1400]   // long & aggressive
    : [300, 120, 300];                                 // clear but shorter

  const options = {
    body,
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: "dhs-" + (data.id || "alert"),
    renotify: true,
    requireInteraction: true,          // stay until user interacts (more aggressive)
    silent: false,
    vibrate: vibratePattern,
    data: { id: data.id || null },
    actions: urgent
      ? [
          { action: "open", title: "Open & Reply" },
          { action: "ack", title: "Got it" }
        ]
      : [{ action: "open", title: "Open" }]
  };

  e.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  const id = e.notification.data && e.notification.data.id;
  const url = new URL("./" + (id ? "?n=" + id : ""), self.registration.scope).href;

  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          if (client.navigate) client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
