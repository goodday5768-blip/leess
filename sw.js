// 홈 화면 앱용 서비스 워커(pwa.py, 2026-09-28). 아무것도 캐시하지 않는다 — 문제는 늘 서버의 최신본.
// 설치 조건(크롬 안드로이드·삼성 인터넷)을 채우고, 인터넷이 끊긴 채 열면 브라우저 오류 화면 대신 안내문을 보여 준다.
const OFFLINE = "<!doctype html><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>인터넷 연결 필요</title><body style=\"margin:0;padding:56px 24px;font:17px/1.7 -apple-system,sans-serif;text-align:center;background:#f5f5f2;color:#1c1d21\"><p style=\"font-size:40px;margin:0\">📶</p><p><b>인터넷에 연결되어 있지 않습니다.</b><br>와이파이나 데이터를 켠 뒤 다시 열어 주세요.</p><button onclick=\"location.reload()\" style=\"font:inherit;padding:10px 22px;border:0;border-radius:10px;background:#2f5bd3;color:#fff\">다시 열기</button></body>";
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, {headers: {'Content-Type': 'text/html; charset=utf-8'}})));
});
