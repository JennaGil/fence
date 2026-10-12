// 빌드가 만든 파일. 설치 때 앱 파일을 모두 받아 두고, 그 뒤로는 캐시에서 먼저 준다(비행기 모드에서도 열림)
// 새 빌드면 VER가 바뀌어 브라우저가 이 파일을 새로 설치해 두고(waiting), 페이지의 알림 줄을 누르면(skipWaiting 메시지) 바로,
// 안 누르면 옛 빌드 창이 모두 닫힌 다음 실행에 넘어가며 옛 캐시를 지운다
const VER = '41852a26219f';
const KEY = 'farm:' + self.registration.scope + ':';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install', e => e.waitUntil(
  caches.open(KEY + VER).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(KEY) && k !== KEY + VER).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(KEY + VER).then(c => c.match(e.request, { ignoreSearch: true })).then(r => r || fetch(e.request)));
});
