const CACHE = "grades-v23";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];
// shown only if the app was never opened online on this phone (nothing in the cache yet)
const OFFLINE = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Matu</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#F2F2F2;font-family:system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
svg{width:72px;height:72px;stroke:#FFD60A;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}h1{font-size:28px;margin:14px 0 6px}p{color:#8A8A8E;margin:0 0 22px}
button{border:0;border-radius:16px;background:#F2F2F2;color:#000;font-weight:700;font-size:17px;height:52px;padding:0 28px}</style></head>
<body><div><svg viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M8.5 16.4a5 5 0 0 1 6-.8M5 12.9a10 10 0 0 1 4.2-2.5M19 12.9a10 10 0 0 0-3-2M2 9.3a15 15 0 0 1 4-2.6M22 9.3a15 15 0 0 0-11.5-4.2"/><path d="M12 20h.01"/></svg>
<h1>Pas de connexion</h1><p>Connecte-toi une première fois pour installer Matu.<br>Ensuite, l'app marche aussi hors ligne.</p><button onclick="location.reload()">Réessayer</button></div></body></html>`;
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("grades-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")).then(r => r ||
        (e.request.mode === "navigate" ? new Response(OFFLINE, {headers:{"Content-Type":"text/html; charset=utf-8"}}) : Response.error())))
  );
});
