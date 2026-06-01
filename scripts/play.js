 // select all tables
 const tables = document.querySelectorAll("table");

 document.addEventListener("click", (e) => {
   const table = e.target.closest("table");
   if (!table) return;
 
   const tables = document.querySelectorAll("table");
   tables.forEach(t => t.classList.remove("active"));
   table.classList.add("active");
 
   // ✅ get all text
   const text = table.innerText;
  //  console.log(text);
 
   function convertThaiNotes(str) {
   const map = {
     "ด": "1",
     "ร": "2",
     "ม": "3",
     "ฟ": "4",
     "ซ": "5",
     "ล": "6",
     "ท": "7",
     "ํ": "*",
     "ฺ": "."
   };
 
   return str
     .replace(/\s+/g, "") // remove ALL spaces (and tabs/newlines) ก6ับต้น
     
     .split("")
     .map(ch => map[ch] || ch)
     .join("");
 }
let output = convertThaiNotes(text);
 output = output.replace("ก6ับต้น", "") // remove 
// console.log(output);
 handlePlay(this, output)
 });

const BASE_DURATION = 300; // ms

const NOTE_FREQ = {
  "1": 466.16, // Bb
  "2": 523.25,
  "3": 587.33,
  "4": 622.25,
  "5": 698.46,
  "6": 783.99,
  "7": 880.00
};

// ==========================
// 🔹 map 8,9 → 1*,2*
// ==========================
function normalizeInput(input) {
  return input
    .replace(/8/g, "1*")
    .replace(/9/g, "2*");
}

// ==========================
// 🔹 parse → JSON
// ==========================
function parseNotes(input) {
  input = normalizeInput(input);

  // รวมหลายบรรทัด
  input = input.replace(/\n/g, " ").trim();

  let result = [];
  let i = 0;

  while (i < input.length) {
    let char = input[i];

    if (/[1-7]/.test(char)) {
      let note = char;
      let octave = 0;
      let duration = BASE_DURATION;

      let j = i + 1;

      // * และ .
      while (input[j] === "*" || input[j] === ".") {
        if (input[j] === "*") octave++;
        if (input[j] === ".") octave--;
        j++;
      }

      // -
      while (input[j] === "-") {
        duration += BASE_DURATION;
        j++;
      }

      let freq = NOTE_FREQ[note];
      freq = freq * Math.pow(2, octave);

      result.push({
        freq: freq,
        duration: duration
      });

      i = j;
    } else {
      i++;
    }
  }

  return result;
}

// ==========================
// 🔹 play
// ==========================

let currentAudio = null;
let isPlaying = false;
let currentOscillators = [];
let currentBtn = null;
function playSequence(input) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  currentAudio = audioCtx;

  const notes = parseNotes(input);
  let currentTime = audioCtx.currentTime;

  isPlaying = true;
  currentOscillators = [];

  notes.forEach(n => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = n.freq;
    osc.type = "sine";

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.setValueAtTime(0, currentTime);
    gain.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);

    osc.start(currentTime);

    gain.gain.linearRampToValueAtTime(0, currentTime + n.duration / 1000);
    osc.stop(currentTime + n.duration / 1000);

    currentOscillators.push(osc);

    currentTime += n.duration / 1000;
  });

  // 🔚 เล่นจบ → reset ปุ่มนั้นปุ่มเดียว
  setTimeout(() => {
    isPlaying = false;
    currentOscillators = [];

    if (currentBtn) {
      currentBtn.innerText = "เล่น";
      currentBtn = null;
    }
  }, currentTime * 1000);
}

function stopSequence() {
  if (currentAudio) {
    currentOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    currentAudio.close();
  }

  isPlaying = false;
  currentOscillators = [];

  // 🔥 reset ปุ่มเดิม
  if (currentBtn) {
    currentBtn.innerText = "เล่น";
    currentBtn = null;
  }
}

function updateAllButtons(playing) {
  document.querySelectorAll(".playBtn").forEach(btn => {
    btn.innerText = playing ? "หยุด" : "เล่น";
  });
}

function handlePlay(btn, data) {
  // 🔁 กดปุ่มเดิม
  if (isPlaying && btn === currentBtn) {
    stopSequence();
    return;
  }

  // 🔁 กดปุ่มใหม่ → หยุดของเก่า
  if (isPlaying) {
    stopSequence();
  }

  // ▶️ เริ่มเล่นใหม่
  currentBtn = btn;
  btn.innerText = "หยุด";

  playSequence(data);
}