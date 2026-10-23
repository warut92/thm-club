const CACHE_NAME = 'my-pwa-v1';
const ASSETS = [
        '/0-blank_tmp.html',
        '/9noteConverter.js',
        '/about.html',
        '/CNAME',
        '/contentTable.js',
        '/freq.html',
        '/index.html',
        '/list.py',
        '/manifest.webmanifest',
        '/README.md',
        '/sathukarn.html',
        '/style.css',
        '/sw.js',
        '/tmp.html',
        '/todo.txt',
        '/transpose.html',
        '/archive/homrong.html',
        '/archive/khim_old.html',
        '/archive/notem4.html',
        '/basic/jake.html',
        '/basic/khim.html',
        '/basic/klui.html',
        '/basic/pii-nai.html',
        '/basic/sathukan.html',
        '/basic/so-daung.html',
        '/basic/so-u.html',
        '/basic/sathukarn.html',
        '/competition/a-nu.html',
        '/competition/ramwong_rayong.html',
        '/competition/sornthong67.html',
        '/competition/wiwek.html',
        '/exercise/jorakehangyao.html',
        '/exercise/mulong.html',
        '/img/icon.png',
        '/img/warut-labtop.gif',
        '/pop/im-un.html',
        '/pop/kid_kan.html',
        '/pop/nanathong.html',
        '/pop/wuji.html',
        '/pop/月亮代表我的心.html',
        '/school-event/grandpark.html',
        '/school-event/khamwan.html',
        '/school-event/kulap-wieng-ping.html',
        '/school-event/openhouse67.html',
        '/short-song/chinjaiyo.html',
        '/short-song/Jingle_Bell.html',
        '/short-song/jinkebbuppha.html',
        '/short-song/kheak_kareak.html',
        '/short-song/lao_krathobmai.html',
        '/short-song/raengkapuephiik.html',
        '/short-song/talimalakas.html',
        '/short-song/yaunkhao.html',
        '/special-event/teacherday67.html',
        '/special-song/anu-ranad-thum.html',
        '/teaching/angkalung5-67.html',
        '/teaching/chang.html',
        '/teaching/java.html',
        '/teaching/kangkaw.html',
        '/teaching/kheakborates.html',
        '/teaching/laosiengtain.html',
        '/teaching/longmaeping_kulabwiengphing.html',
        '/teaching/longmeaping.html',
        '/teaching/loy-krathong.html',
        '/teaching/pamaklonyaw.html',
        "/index.html"
      ];
  // ติดตั้ง: cache ไฟล์ทั้งหมดล่วงหน้า
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// เปิดใช้งาน: ลบ cache เวอร์ชันเก่า
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ดึงข้อมูล: ใช้ cache ก่อน ถ้าไม่มีค่อยไปเน็ต
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html');
          }
        });
    })
  );
}); 