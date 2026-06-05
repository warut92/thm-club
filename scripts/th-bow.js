let all_notes = document.getElementById('thm').innerHTML
let originalNotes = document.getElementById('thm')

function myBow() {
  document.getElementById('thm') = originalNotes.innerHTML
  console.log(originalNotes);
}

// ค่าเริ่มต้น
// let strokeWidth = 1.5;
// let width = 25;
// let height = 40;
// let bowOutTop = 5;
// let leftOut = -10;
// let bowInTop = -20;
// let leftIn = -8;

// let startX = 8;      // จุดเริ่มต้น X
// let startY = 18;     // จุดเริ่มต้น Y

// let controlX = 17;   // จุดควบคุม X
// let controlY = 8;    // จุดควบคุม Y
//
// let endX = 27;       // จุดสิ้นสุด X
// let endY = 18;       // จุดสิ้นสุด Y

let strokeWidth = 1.5;
let width = 26;
let height = 40;
let bowOutTop = 5;
let leftOut = -6;
let bowInTop = -20;
let leftIn = -8;

let startX = 12;      // จุดเริ่มต้น X
let startY = 19;     // จุดเริ่มต้น Y

let controlX = 19;   // จุดควบคุม X
let controlY = 8;    // จุดควบคุม Y

let endX = 26;       // จุดสิ้นสุด X
let endY = 19;       // จุดสิ้นสุด Y

document.addEventListener("click", function(event){

  if(event.target.tagName === "BUTTON"){
      updateBow();
  }

});

// =======================
// BUTTON 🏹
// =======================
const togglePanelBow = document.createElement("div");
togglePanelBow.innerText = "🏹";
togglePanelBow.classList.add("bowcontrol");
document.body.appendChild(togglePanelBow);

// =======================
// PANEL
// =======================
const bowPanel = document.createElement("div");
bowPanel.classList.add("bow-panel");
bowPanel.style.display = "none";

bowPanel.innerHTML = `
<span>ระบบคันชัก</span>
<br>
<button onclick="myBow()">ระบบ  >< </button>
<button onclick="updateBow()">ระบบ <sub>︶</sub>ด<sup>︵</button>
<br>
<span>ปรับลักษณะคันชัก</span>

<hr>

<div id="bowControls"></div>
`;

document.body.appendChild(bowPanel);

// =======================
// TOGGLE PANEL
// =======================
togglePanelBow.addEventListener("click", () => {
    bowPanel.style.display =
        bowPanel.style.display === "none" ? "block" : "none";
});

// =======================
// CONTROL GENERATOR
// =======================
const controls = [
    { name: "ความหนา", get: () => strokeWidth, set: v => strokeWidth = v, step: 0.5 },
    { name: "ความกว้าง", get: () => width, set: v => width = v, step: 1 },
    { name: "ความสูง", get: () => height, set: v => height = v, step: 1 },
    { name: "คันชักออกX", get: () => bowOutTop, set: v => bowOutTop = v, step: 1 },
    { name: "คันชักออกY", get: () => leftOut, set: v => leftOut = v, step: 1 },
    { name: "คันชักเข้าX", get: () => bowInTop, set: v => bowInTop = v, step: 1 },
    { name: "คันชักเข้าY", get: () => leftIn , set: v => leftIn = v, step: 1 },
        // SVG Path
    { name: "startX(8)", get: () => startX, set: v => startX = v, step: 1 },
    { name: "startY(18)", get: () => startY, set: v => startY = v, step: 1 },

    { name: "controlX(17)", get: () => controlX, set: v => controlX = v, step: 1 },
    { name: "controlY(8)", get: () => controlY, set: v => controlY = v, step: 1 },

    { name: "endX(27)", get: () => endX, set: v => endX = v, step: 1 },
    { name: "endY(18)", get: () => endY, set: v => endY = v, step: 1 }
];

const container = bowPanel.querySelector("#bowControls");

controls.forEach(control => {

    const row = document.createElement("div");
    row.classList.add("control-row");

    const label = document.createElement("span");
    label.textContent = control.name;

    const minus = document.createElement("button");
    minus.textContent = "−";

    const value = document.createElement("input");
    value.type = "number";
    value.step = control.step;
    value.value = control.get();

    const plus = document.createElement("button");
    plus.textContent = "+";

    minus.onclick = () => {
        let v = parseFloat(value.value) - control.step;
        value.value = v;
        control.set(v);
        updateBow();
    };

    plus.onclick = () => {
        let v = parseFloat(value.value) + control.step;
        value.value = v;
        control.set(v);
        updateBow();
    };

    value.oninput = () => {
        control.set(parseFloat(value.value));
        updateBow();
    };

    row.append(label, minus, value, plus);
    container.appendChild(row);
});

// =======================
// UPDATE FUNCTION
// =======================
function updateBow() {

  // เรียก render โน้ตใหม่ตรงนี้

  //สร้างตัวแปร
  //คันชักออก
  const bowOut = `
<svg
style="position:absolute; top:${bowOutTop}px; left:${leftOut}px; transform:rotate(180deg);"
width="${width}"
height="${height}"
viewBox="0 0 35 20">
<path d="M${startX} ${startY} Q${controlX} ${controlY} ${endX} ${endY}"
stroke="black"
stroke-width="${strokeWidth}"
fill="none"/>
</svg>
`;
//คันชักเข้า
const bowIn = `
<svg
style="position:absolute; top:${bowInTop}px; left:${leftIn}px;"
width="${width}"
height="${height}"
viewBox="0 0 35 20">
<path d="M${startX} ${startY} Q${controlX} ${controlY} ${endX} ${endY}"
stroke="black"
stroke-width="${strokeWidth}"
fill="none"/>
</svg>
`;

const bowOut2 = `
<svg
style="position:absolute; top:70%; left:-40%; transform:rotate(180deg);"
width="35"
height="30"
viewBox="0 0 35 20">
<path d="M2 18 Q17 2 33 18"
stroke="black"
stroke-width="1.5"
fill="none"/>
</svg>
`;

const bowIn2 = `
<svg
style="position:absolute; top:-30%; left:-20%;"
width="35"
height="40"
viewBox="0 0 35 20">
<path d="M2 18 Q17 2 33 18"
stroke="black"
stroke-width="${strokeWidth}"
fill="none"/>
</svg>
`;

//ตัวเปลี่ยน
// คันชักออก
let add_bow = all_notes.replace(
    /<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&gt;<\/sub>/g,
    bowOut
  );
   
  // คันชักเข้า 2 โน้ต (ข้ามห้อง)
  add_bow = add_bow.replace(
    /([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub><\/span><\/td><td><span style=\"display: inline-block; position: relative;\">([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g,
    `$1</span></td><td><span style="display: inline-block; position: relative;">${bowIn2}$2`
  );

  // คันชักเข้า
  add_bow = add_bow.replace(
    /<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g,
    bowIn
  );

  document.getElementById('thm').innerHTML = add_bow
}

// updateBow()