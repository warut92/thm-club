/*
 * Service Worker สำหรับใช้งานแบบออฟไลน์
 *
 * ไม่ต้องแก้รายชื่อไฟล์เอง: SW จะเริ่มจาก index.html แล้วไล่ตามลิงก์ทุกหน้าในเว็บ
 * (รวมถึง css / js / รูป ที่แต่ละหน้าใช้) แล้วเก็บลง cache ให้ทั้งหมด
 *
 * - ติดตั้งครั้งแรก: ดาวน์โหลดทุกหน้าทันที
 * - ทุกครั้งที่เปิดเว็บตอนออนไลน์ (ห่างกันอย่างน้อย SYNC_INTERVAL): ตรวจหาหน้าใหม่/หน้าที่แก้ไข
 * - เปิดหน้าเว็บตอนออนไลน์: ดึงจากเน็ตก่อน (ได้ของใหม่เสมอ) ถ้าเน็ตช้า/ไม่มี ใช้ของใน cache
 *
 * ถ้าแก้ไฟล์นี้ ให้เปลี่ยน VERSION ด้วย
 */
const VERSION = 'v3';
const PRECACHE = 'thm-pages-' + VERSION;
const RUNTIME = 'thm-runtime-' + VERSION;
const META_KEY = '__thm_meta__';

const ROOT = new URL('./', self.location).href;
const START = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './script-pwa.js',
  './img/icon.png',
  './img/icon-192.png',
  './img/icon-512.png',
];

const MAX_URLS = 1000;                    // กันไล่ลิงก์ไม่รู้จบ
const CONCURRENCY = 6;                    // ดาวน์โหลดพร้อมกันกี่ไฟล์
const SYNC_INTERVAL = 6 * 60 * 60 * 1000; // 6 ชั่วโมง
const NAV_TIMEOUT = 4000;                 // รอเน็ตกี่ ms ก่อนใช้ cache แทน

// โดเมนภายนอกที่ไม่ต้องเก็บ (วิดีโอ/โซเชียล)
const SKIP_HOSTS = /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|facebook\.com|google-analytics\.com|googletagmanager\.com)$/;

// ---------------------------------------------------------------------------
// install / activate
// ---------------------------------------------------------------------------
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    // ทีละไฟล์ ไฟล์ไหนพังก็ไม่ทำให้ติดตั้งล้ม
    await Promise.all(START.map(u =>
      fetch(new Request(abs(u), { cache: 'no-cache' }))
        .then(res => res.ok && cache.put(abs(u), res))
        .catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = [PRECACHE, RUNTIME];
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !keep.includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
    await syncAll(true);
  })());
});

// ---------------------------------------------------------------------------
// ข้อความจากหน้าเว็บ
// ---------------------------------------------------------------------------
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SYNC') {
    event.waitUntil(syncAll(!!data.force));
  } else if (data.type === 'STATUS') {
    event.waitUntil(getMeta().then(meta =>
      event.source && event.source.postMessage({ type: 'STATUS', running: !!syncing, ...meta })
    ));
  }
});

// ---------------------------------------------------------------------------
// fetch
// ---------------------------------------------------------------------------
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;

  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && req.mode === 'navigate') {
    event.respondWith(networkFirstPage(event));
    return;
  }
  if (sameOrigin) {
    event.respondWith(staleWhileRevalidate(event, PRECACHE));
    return;
  }
  // ไฟล์จากเว็บอื่น (thmjs.css, ฟอนต์, CDN) เก็บไว้ใช้ออฟไลน์ด้วย
  if (!SKIP_HOSTS.test(url.hostname) &&
      ['style', 'script', 'font', 'image'].includes(req.destination)) {
    event.respondWith(staleWhileRevalidate(event, RUNTIME));
  }
});

async function networkFirstPage(event) {
  const req = event.request;
  const key = stripHash(req.url);
  const cache = await caches.open(PRECACHE);

  const network = fetch(req).then(res => {
    if (res.ok) {
      const copy = res.clone();
      event.waitUntil(cache.put(key, copy));
    }
    return res;
  });

  const timeout = new Promise(resolve => setTimeout(resolve, NAV_TIMEOUT));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch (e) { /* ออฟไลน์ */ }

  const cached = await matchAny(key);
  if (cached) return cached;
  try { return await network; } catch (e) { /* ออฟไลน์ */ }
  return offlinePage();
}

async function staleWhileRevalidate(event, cacheName) {
  const req = event.request;
  const key = req.url.startsWith(self.location.origin) ? stripHash(req.url) : req;
  const cached = await matchAny(key);

  const network = fetch(req).then(async res => {
    if (res.ok || res.type === 'opaque') {
      const cache = await caches.open(cacheName);
      await cache.put(key, res.clone());
    }
    return res;
  });

  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  try {
    return await network;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

function matchAny(key) {
  return caches.match(key, { ignoreSearch: typeof key === 'string' && key.startsWith(self.location.origin) });
}

function offlinePage() {
  const home = abs('./index.html');
  return new Response(
    `<!DOCTYPE html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ออฟไลน์</title></head>
<body style="font-family:sans-serif;padding:24px;line-height:1.6">
<h2>ยังไม่มีหน้านี้ในเครื่อง</h2>
<p>ตอนนี้ไม่ได้เชื่อมต่ออินเทอร์เน็ต และหน้านี้ยังไม่ได้ถูกดาวน์โหลดไว้</p>
<p><a href="${home}">กลับหน้าหลัก</a></p>
</body></html>`,
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

// ---------------------------------------------------------------------------
// ไล่ลิงก์และดาวน์โหลดทุกหน้า
// ---------------------------------------------------------------------------
let syncing = null;

function syncAll(force) {
  if (syncing) return syncing;
  syncing = (async () => {
    const meta = await getMeta();
    if (!force && meta.lastSync && Date.now() - meta.lastSync < SYNC_INTERVAL) return;
    try {
      await crawl();
    } finally {
      syncing = null;
    }
  })();
  return syncing;
}

async function crawl() {
  const pages = await caches.open(PRECACHE);
  const runtime = await caches.open(RUNTIME);

  const queue = START.map(abs);
  const seen = new Set(queue);
  let done = 0, failed = 0, pageCount = 0;

  const progress = () => broadcast({ type: 'PROGRESS', done: done + failed, total: seen.size, failed });

  async function work(url) {
    const sameOrigin = url.startsWith(self.location.origin);
    try {
      const res = sameOrigin
        ? await fetch(new Request(url, { cache: 'no-cache' }))
        : await fetch(new Request(url, { mode: 'no-cors' }));
      if (!res.ok && res.type !== 'opaque') throw new Error(res.status);

      const type = res.headers.get('Content-Type') || '';
      if (sameOrigin && (type.includes('text/html') || /\.html?$|\/$/.test(new URL(url).pathname))) {
        pageCount++;
        const html = await res.clone().text();
        for (const link of extractLinks(html, url)) {
          if (seen.size >= MAX_URLS) break;
          if (!seen.has(link)) { seen.add(link); queue.push(link); }
        }
      }
      await (sameOrigin ? pages : runtime).put(url, res);
      done++;
    } catch (e) {
      failed++;
    }
    progress();
  }

  // ทำพร้อมกันหลายไฟล์
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      await work(queue.shift());
      // คิวอาจว่างชั่วคราวระหว่างที่ worker อื่นกำลังอ่านลิงก์ จึงวนต่อจนทุกตัวเสร็จ
    }
  });
  await Promise.all(workers);
  // รอบสอง: ลิงก์ที่ถูกเพิ่มเข้าคิวหลัง worker บางตัวหยุดไปแล้ว
  while (queue.length) await Promise.all(queue.splice(0, CONCURRENCY).map(work));

  // ลบหน้าที่ถูกลบออกจากเว็บแล้ว (ทำเฉพาะตอนดาวน์โหลดได้ครบ)
  if (failed === 0) {
    for (const req of await pages.keys()) {
      const u = stripHash(req.url);
      if (!seen.has(u) && !seen.has(u.split('?')[0])) await pages.delete(req);
    }
  }

  const meta = { lastSync: Date.now(), pages: pageCount, files: done, failed };
  await pages.put(abs(META_KEY), new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } }));
  broadcast({ type: 'DONE', ...meta });
}

function extractLinks(html, baseUrl) {
  const out = new Set();
  // ตัด comment ออกก่อน
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  const tagRe = /<(a|script|link|img|source|audio|video)\b([^>]*)>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    const attr = tag === 'a' || tag === 'link' ? 'href' : 'src';
    const val = getAttr(attrs, attr);
    if (!val) continue;

    let url;
    try { url = new URL(val.trim(), baseUrl); } catch (e) { continue; }
    if (!/^https?:$/.test(url.protocol)) continue;
    url.hash = '';
    const sameOrigin = url.origin === self.location.origin;

    if (tag === 'a') {
      // ลิงก์ไปหน้าอื่นในเว็บเดียวกันเท่านั้น
      if (!sameOrigin || !url.href.startsWith(ROOT)) continue;
      if (!/(\.html?|\/)$/i.test(url.pathname)) continue;
    } else if (tag === 'link') {
      const rel = (getAttr(attrs, 'rel') || '').toLowerCase();
      if (!/stylesheet|icon|manifest/.test(rel)) continue;
    } else if (tag === 'video' || tag === 'audio' || tag === 'source') {
      // ไฟล์วิดีโอ/เสียงใหญ่เกินไป ไม่โหลดล่วงหน้า
      continue;
    }
    if (!sameOrigin && SKIP_HOSTS.test(url.hostname)) continue;
    out.add(url.href);
  }
  return out;
}

function getAttr(attrs, name) {
  const re = new RegExp('(?:^|\\s)' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
  const m = attrs.match(re);
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function abs(u) { return stripHash(new URL(u, ROOT).href); }
function stripHash(u) { const i = u.indexOf('#'); return i < 0 ? u : u.slice(0, i); }

async function getMeta() {
  const res = await caches.match(abs(META_KEY));
  if (!res) return {};
  try { return await res.json(); } catch (e) { return {}; }
}

async function broadcast(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach(c => c.postMessage(msg));
}
