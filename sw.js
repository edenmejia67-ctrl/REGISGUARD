// DHS service worker: shows Web Push alerts even when the app is closed. No caching (avoids stale pages).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const urgent = d.urgent === true;
  e.waitUntil(self.registration.showNotification(d.title || "DHS Visitor Alert", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png",
    tag: "dhs-" + (d.id || "alert"), renotify: true, requireInteraction: urgent,
    vibrate: urgent ? [500, 200, 500, 200, 500, 200, 900] : [200, 100, 200],
    data: { id: d.id || null }, actions: urgent ? [{ action: "open", title: "Open and acknowledge" }] : []
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const id = e.notification.data && e.notification.data.id;
  const url = new URL("./" + (id ? "?n=" + id : ""), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ("focus" in c) { if (c.navigate) c.navigate(url); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
