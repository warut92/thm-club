// =====================================================
// 🎻 Thai Tuner — เครื่องตั้งเสียงดนตรีไทย (ซอด้วง)
// ใช้:
//   ซอด้วง : <script src="../scripts/thai-tuner.js"></script>
//            (หรือ data-instrument="so-duang")  สายใน ซอล 342.2 / สายนอก เรสูง 508.4
//   ซออู้   : <script src="../scripts/thai-tuner.js" data-instrument="so-u"></script>
//            สายใน โด 230.3 / สายนอก ซอล 342.2
// =====================================================
(function () {
  const scriptEl = document.currentScript;

  // ---------- ค่าความถี่เสียงไทย (ช่วงกลาง) ----------
  const BASE_FREQ = {
    'c': 230.3, 'd': 254.2, 'e': 280.7,
    'f': 309.9, 'g': 342.2, 'a': 377.8, 'b': 417.2
  };
  const NOTE_INFO = {
    'c': { th: 'ด', name: 'โด', num: '1' },
    'd': { th: 'ร', name: 'เร', num: '2' },
    'e': { th: 'ม', name: 'มี', num: '3' },
    'f': { th: 'ฟ', name: 'ฟา', num: '4' },
    'g': { th: 'ซ', name: 'ซอล', num: '5' },
    'a': { th: 'ล', name: 'ลา', num: '6' },
    'b': { th: 'ท', name: 'ที', num: '7' }
  };

  // ---------- ค่าตั้งสายของแต่ละเครื่อง ----------
  const INSTRUMENTS = {
    'so-duang': {
      title: 'ตั้งเสียงซอด้วง',
      strings: [
        { id: 'inner', label: 'สายใน (ซอล)', freq: 342.2 },
        { id: 'outer', label: 'สายนอก (เรสูง)', freq: 508.4 }
      ]
    },
    'so-u': {
      title: 'ตั้งเสียงซออู้',
      strings: [
        { id: 'inner', label: 'สายใน (โด)', freq: 230.3 },
        { id: 'outer', label: 'สายนอก (ซอล)', freq: 342.2 }
      ]
    }
  };
  const instKey = (scriptEl && scriptEl.dataset.instrument) || 'so-duang';
  const INSTRUMENT = INSTRUMENTS[instKey] || INSTRUMENTS['so-duang'];
  const STRINGS = INSTRUMENT.strings;

  // สร้างตารางเสียงทุกช่วงเสียง (ต่ำ / กลาง / สูง / สูงมาก)
  const ALL_NOTES = [];
  [-1, 0, 1, 2].forEach(oct => {
    Object.keys(BASE_FREQ).forEach(k => {
      ALL_NOTES.push({ key: k, octave: oct, freq: BASE_FREQ[k] * Math.pow(2, oct) });
    });
  });

  function octaveLabel(oct) {
    if (oct < 0) return 'ต่ำ';
    if (oct === 1) return 'สูง';
    if (oct >= 2) return 'สูงมาก';
    return '';
  }
  function noteText(key, oct) {
    const info = NOTE_INFO[key];
    const o = octaveLabel(oct);
    return info.name + (o ? o : '') + ' (' + info.th + ')';
  }
  function cents(f, ref) { return 1200 * Math.log2(f / ref); }

  // ---------- CSS ----------
  const css = `
  .tt-toggle{position:fixed;bottom:12px;left:12px;z-index:9999;font-size:28px;
    background:yellow;border:2px solid blue;border-radius:8px;cursor:pointer;padding:2px 8px}
  .tt-panel{position:fixed;bottom:64px;left:12px;z-index:9999;width:300px;max-width:calc(100vw - 24px);
    background:#fffde0;border:2px solid blue;border-radius:10px;padding:10px;font-size:16px;
    box-shadow:0 4px 14px rgba(0,0,0,.25);font-family:inherit}
  .tt-panel[hidden]{display:none}
  .tt-panel h3{margin:0 0 6px;font-size:18px;text-align:center}
  .tt-row{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
  .tt-row button{flex:1;font-size:15px;padding:6px 4px;border:2px solid blue;border-radius:6px;
    background:yellow;cursor:pointer;font-family:inherit}
  .tt-row button.on{background:#7cfc00}
  .tt-notes button{flex:1 0 12%;padding:4px 0;font-size:16px}
  .tt-display{text-align:center;background:#fff;border:1px solid #99a;border-radius:8px;padding:8px;margin:6px 0}
  .tt-note{font-size:34px;font-weight:bold;line-height:1.2}
  .tt-freq{font-size:14px;color:#444}
  .tt-meter{position:relative;height:22px;background:linear-gradient(90deg,#f88 0%,#ffd27f 35%,#8f8 45%,#8f8 55%,#ffd27f 65%,#f88 100%);
    border-radius:11px;margin:8px 0 2px;border:1px solid #777}
  .tt-needle{position:absolute;top:-4px;width:4px;height:30px;background:#000;left:50%;margin-left:-2px;
    border-radius:2px;transition:left .08s linear}
  .tt-scale{display:flex;justify-content:space-between;font-size:11px;color:#555}
  .tt-status{font-size:15px;font-weight:bold;margin-top:4px}
  .tt-small{font-size:12px;color:#555;text-align:center}
  @media print{.tt-toggle,.tt-panel{display:none!important}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- UI ----------
  const toggle = document.createElement('button');
  toggle.className = 'tt-toggle';
  toggle.title = 'เครื่องตั้งเสียง';
  toggle.textContent = '🎻';

  const panel = document.createElement('div');
  panel.className = 'tt-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <h3>${INSTRUMENT.title}</h3>
    <div class="tt-small">เลือกสายที่ต้องการตั้ง หรือ "อัตโนมัติ" เพื่อหาเสียงที่ใกล้ที่สุด</div>
    <div class="tt-row tt-targets">
      <button data-target="auto" class="on">อัตโนมัติ</button>
      ${STRINGS.map(s => `<button data-target="${s.id}">${s.label}<br><small>${s.freq} Hz</small></button>`).join('')}
    </div>
    <div class="tt-display">
      <div class="tt-note">–</div>
      <div class="tt-freq">กดปุ่ม 🎤 เพื่อเริ่มฟังเสียง</div>
      <div class="tt-meter"><div class="tt-needle"></div></div>
      <div class="tt-scale"><span>-50</span><span>ต่ำไป</span><span>0</span><span>สูงไป</span><span>+50</span></div>
      <div class="tt-status">&nbsp;</div>
    </div>
    <div class="tt-row">
      <button class="tt-mic">🎤 เริ่มฟังเสียง</button>
    </div>
    <div class="tt-small">เสียงอ้างอิง (กดเพื่อเปิด/ปิด)</div>
    <div class="tt-row tt-refs">
      ${STRINGS.map(s => `<button data-ref="${s.freq}">🔊 ${s.label}</button>`).join('')}
    </div>
    <div class="tt-row tt-notes">
      ${Object.keys(BASE_FREQ).map(k => `<button data-ref="${BASE_FREQ[k]}" title="${NOTE_INFO[k].name} ${BASE_FREQ[k]} Hz">${NOTE_INFO[k].th}</button>`).join('')}
    </div>
  `;
  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const elNote = panel.querySelector('.tt-note');
  const elFreq = panel.querySelector('.tt-freq');
  const elNeedle = panel.querySelector('.tt-needle');
  const elStatus = panel.querySelector('.tt-status');
  const micBtn = panel.querySelector('.tt-mic');

  toggle.addEventListener('click', () => { panel.hidden = !panel.hidden; });

  // ---------- เลือกเป้าหมาย ----------
  let target = 'auto';
  panel.querySelectorAll('.tt-targets button').forEach(btn => {
    btn.addEventListener('click', () => {
      target = btn.dataset.target;
      panel.querySelectorAll('.tt-targets button').forEach(b => b.classList.toggle('on', b === btn));
    });
  });

  // ---------- Audio ----------
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // เสียงอ้างอิง
  let refOsc = null, refGain = null, refBtn = null;
  function stopRef() {
    if (refOsc) {
      const c = getCtx();
      refGain.gain.setTargetAtTime(0, c.currentTime, 0.03);
      refOsc.stop(c.currentTime + 0.2);
      refOsc = null;
    }
    if (refBtn) refBtn.classList.remove('on');
    refBtn = null;
  }
  function playRef(freq, btn) {
    const same = refBtn === btn;
    stopRef();
    if (same) return;
    const c = getCtx();
    refOsc = c.createOscillator();
    refGain = c.createGain();
    refOsc.type = 'triangle';
    refOsc.frequency.value = freq;
    refGain.gain.value = 0;
    refGain.gain.setTargetAtTime(0.25, c.currentTime, 0.03);
    refOsc.connect(refGain).connect(c.destination);
    refOsc.start();
    refBtn = btn;
    btn.classList.add('on');
  }
  panel.querySelectorAll('[data-ref]').forEach(btn => {
    btn.addEventListener('click', () => playRef(parseFloat(btn.dataset.ref), btn));
  });

  // ไมโครโฟน + ตรวจจับความถี่
  let stream = null, analyser = null, buf = null, rafId = null;
  let smoothFreq = 0;

  async function startMic() {
    try {
      const c = getCtx();
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
      const src = c.createMediaStreamSource(stream);
      analyser = c.createAnalyser();
      analyser.fftSize = 2048;
      buf = new Float32Array(analyser.fftSize);
      src.connect(analyser);
      micBtn.textContent = '⏹ หยุดฟัง';
      micBtn.classList.add('on');
      elFreq.textContent = 'กำลังฟัง... ลองสีสายซอ';
      loop();
    } catch (err) {
      elFreq.textContent = 'ไม่สามารถใช้ไมโครโฟนได้: ' + err.message;
    }
  }
  function stopMic() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null; analyser = null; smoothFreq = 0;
    micBtn.textContent = '🎤 เริ่มฟังเสียง';
    micBtn.classList.remove('on');
    elNote.textContent = '–';
    elFreq.textContent = 'กดปุ่ม 🎤 เพื่อเริ่มฟังเสียง';
    elStatus.innerHTML = '&nbsp;';
    elNeedle.style.left = '50%';
  }
  micBtn.addEventListener('click', () => (stream ? stopMic() : startMic()));

  // Autocorrelation pitch detection
  function detectPitch(b, sampleRate) {
    let size = b.length, rms = 0;
    for (let i = 0; i < size; i++) rms += b[i] * b[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // เงียบเกินไป

    // ตัดส่วนหัว/ท้ายที่เงียบ
    let r1 = 0, r2 = size - 1;
    const thres = 0.2;
    for (let i = 0; i < size / 2; i++) if (Math.abs(b[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < size / 2; i++) if (Math.abs(b[size - i]) < thres) { r2 = size - i; break; }
    b = b.slice(r1, r2);
    size = b.length;

    // จำกัดช่วง lag (ความถี่ต่ำสุด ~60 Hz) เพื่อลดภาระการคำนวณ
    const maxLag = Math.min(size, Math.ceil(sampleRate / 60) + 2);
    const c = new Float32Array(maxLag);
    for (let i = 0; i < maxLag; i++)
      for (let j = 0; j < size - i; j++) c[i] += b[j] * b[j + i];
    size = maxLag;

    let d = 0;
    while (d < size - 1 && c[d] > c[d + 1]) d++;
    let maxVal = -1, maxPos = -1;
    for (let i = d; i < size; i++) if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
    if (maxPos <= 0) return -1;

    // parabolic interpolation
    let T0 = maxPos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2, bb = (x3 - x1) / 2;
    if (a) T0 = T0 - bb / (2 * a);
    return sampleRate / T0;
  }

  function nearestNote(f) {
    let best = ALL_NOTES[0], bestDiff = Infinity;
    ALL_NOTES.forEach(n => {
      const d = Math.abs(cents(f, n.freq));
      if (d < bestDiff) { bestDiff = d; best = n; }
    });
    return best;
  }

  let lastUpdate = 0;
  function loop() {
    rafId = requestAnimationFrame(loop);
    const now = performance.now();
    if (now - lastUpdate < 50) return;
    lastUpdate = now;
    analyser.getFloatTimeDomainData(buf);
    const f = detectPitch(buf, ctx.sampleRate);
    if (f < 60 || f > 2000) return;

    smoothFreq = smoothFreq ? smoothFreq * 0.7 + f * 0.3 : f;
    if (Math.abs(cents(f, smoothFreq)) > 80) smoothFreq = f; // เปลี่ยนเสียงกะทันหัน

    let refFreq, label;
    if (target === 'auto') {
      const n = nearestNote(smoothFreq);
      refFreq = n.freq;
      label = noteText(n.key, n.octave);
    } else {
      const s = STRINGS.find(x => x.id === target);
      refFreq = s.freq;
      label = s.label;
    }
    const cDiff = cents(smoothFreq, refFreq);
    const clamped = Math.max(-50, Math.min(50, cDiff));

    elNote.textContent = label;
    elFreq.textContent = smoothFreq.toFixed(1) + ' Hz  (เป้าหมาย ' + refFreq.toFixed(1) + ' Hz)';
    elNeedle.style.left = (50 + clamped) + '%';

    if (Math.abs(cDiff) <= 5) {
      elStatus.textContent = '✅ ตรงเสียงแล้ว';
      elStatus.style.color = 'green';
    } else if (cDiff < 0) {
      elStatus.textContent = '⬆ ต่ำไป ' + Math.abs(cDiff).toFixed(0) + ' cent — บิดลูกบิดให้ตึงขึ้น';
      elStatus.style.color = '#c60';
    } else {
      elStatus.textContent = '⬇ สูงไป ' + cDiff.toFixed(0) + ' cent — คลายลูกบิดลง';
      elStatus.style.color = '#c00';
    }
  }
})();
