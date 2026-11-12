/*
 * ลงทะเบียน Service Worker + แสดงสถานะการดาวน์โหลดสำหรับใช้งานออฟไลน์
 * ไฟล์นี้ถูกโหลดอัตโนมัติจาก scripts/panel-center.js ในทุกหน้า
 * (หน้าไหนมี <p id="status"></p> จะแสดงสถานะ + ปุ่มอัปเดต)
 */
(function () {
  if (window.__thmPwaLoaded) return;
  window.__thmPwaLoaded = true;

  var self = document.currentScript;
  var base = self ? self.src : location.href;
  var swUrl = new URL('sw.js', base).href;
  var manifestUrl = new URL('manifest.json', base).href;

  // ให้ทุกหน้าติดตั้งเป็นแอปได้
  if (!document.querySelector('link[rel="manifest"]')) {
    var link = document.createElement('link');
    link.rel = 'manifest';
    link.href = manifestUrl;
    document.head.appendChild(link);
  }

  var statusEl = document.getElementById('status');
  var textEl, btn;
  if (statusEl) {
    textEl = document.createElement('span');
    btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'อัปเดตโน้ตสำหรับออฟไลน์';
    btn.style.marginLeft = '8px';
    btn.hidden = true;
    statusEl.textContent = '';
    statusEl.appendChild(textEl);
    statusEl.appendChild(btn);
  }

  function show(msg) { if (textEl) textEl.textContent = msg; }
  function net() { return navigator.onLine ? '🟢 ออนไลน์' : '🔴 ออฟไลน์'; }

  function formatTime(t) {
    try {
      return new Date(t).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) { return new Date(t).toLocaleString(); }
  }

  var lastMeta = null;
  function showMeta() {
    if (!lastMeta || !lastMeta.lastSync) { show(net()); return; }
    show(net() + ' · ✅ พร้อมใช้ออฟไลน์ ' + lastMeta.pages + ' หน้า (อัปเดต ' + formatTime(lastMeta.lastSync) + ')' +
      (lastMeta.failed ? ' · โหลดไม่สำเร็จ ' + lastMeta.failed + ' ไฟล์' : ''));
    if (btn) btn.hidden = !navigator.onLine;
  }

  window.addEventListener('online', showMeta);
  window.addEventListener('offline', showMeta);

  if (!('serviceWorker' in navigator)) {
    show(net() + ' · เบราว์เซอร์นี้ไม่รองรับการใช้งานออฟไลน์');
    return;
  }

  navigator.serviceWorker.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'PROGRESS') {
      if (btn) btn.hidden = true;
      show('⏳ กำลังดาวน์โหลดสำหรับใช้ออฟไลน์... ' + d.done + '/' + d.total);
    } else if (d.type === 'DONE' || d.type === 'STATUS') {
      if (d.type === 'STATUS' && d.running) return;
      lastMeta = d;
      showMeta();
    }
  });

  function send(msg) {
    navigator.serviceWorker.ready.then(function (reg) {
      if (reg.active) reg.active.postMessage(msg);
    });
  }

  if (btn) btn.addEventListener('click', function () {
    btn.hidden = true;
    show('⏳ กำลังตรวจหาโน้ตใหม่...');
    send({ type: 'SYNC', force: true });
  });

  show(net());
  function init() {
    navigator.serviceWorker.register(swUrl).then(function () {
      send({ type: 'STATUS' });
      // ตรวจหาหน้าใหม่ (SW จะทำจริงเฉพาะเมื่อห่างจากครั้งก่อนเกิน 6 ชม.)
      if (navigator.onLine) send({ type: 'SYNC' });
    }).catch(function (err) {
      console.error('SW failed', err);
    });
  }
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
