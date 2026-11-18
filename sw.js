// 통합앱 서비스 워커(build_hub.py, 2026-10-03 사용자 지시 「교재 오프라인에서도 열리게」):
// 첫 화면은 인터넷 우선 → 끊기면 마지막으로 받은 첫 화면. 교사용 폴더 교재는 leess-books 자기 워커가 맡는다. 시험앱들은 저마다 인터넷이 필요하다.
const C = 'hub-shell';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'manifest.json', 'icon-192.png', 'apple-touch-icon.png'])).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put('./', cp)).catch(() => {}); } return res; })
      .catch(() => caches.open(C).then(c => c.match('./')).then(m => m || new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font:17px/1.7 -apple-system,sans-serif;padding:56px 24px;text-align:center">인터넷에 연결되어 있지 않습니다. 와이파이나 데이터를 켠 뒤 다시 열어 주세요.</body>', {headers: {'Content-Type': 'text/html; charset=utf-8'}}))));
    return;
  }
  e.respondWith(fetch(r).catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || Response.error())));
});
