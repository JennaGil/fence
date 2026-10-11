// 빌드가 만든 파일. 설치 때 앱 파일을 모두 받아 두고, 그 뒤로는 캐시에서 먼저 준다(비행기 모드에서도 열림)
// 새 빌드면 VER가 바뀌어 브라우저가 이 파일을 새로 설치하고, 옛 캐시는 지운다
const VER = 'db0b18cd9752';
const KEY = 'farm:' + self.registration.scope + ':';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install', e => e.waitUntil(
  caches.open(KEY + VER).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(KEY) && k !== KEY + VER).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(KEY + VER).then(c => c.match(e.request, { ignoreSearch: true })).then(r => r || fetch(e.request)));
});
