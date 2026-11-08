// === CREATE CONTAINER ===
const fontControl = document.createElement("div");
fontControl.classList.add("font-control");

// === CREATE BUTTON (🎨) ===
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "🎨";
toggleBtn.classList.add("toggle-btn");

// === CREATE PANEL ===
const panel = document.createElement("div");
panel.classList.add("font-panel", "hiddenPanel");

// =========================
// 🔹 SIZE BUTTONS (อยู่ใน panel)
// =========================
const sizeControl = document.createElement("div");
sizeControl.classList.add("size-control");

const increaseBtn = document.createElement("button");
increaseBtn.className = "increaseBtn";
increaseBtn.textContent = "ก+";

const decreaseBtn = document.createElement("button");
decreaseBtn.className = "decreaseBtn";
decreaseBtn.textContent = "ก-";

const fontSizePanel = document.createElement("span");
fontSizePanel.className = "fontSize";
fontSizePanel.textContent = localStorage.getItem("fontSize");

sizeControl.appendChild(increaseBtn);
sizeControl.appendChild(decreaseBtn);
sizeControl.appendChild(fontSizePanel);

// =========================
// 🔹 FONT LIST
// =========================
const fontList = [
"Sarabun", "Kanit", "Prompt", "Loma", "Mali",
"Tlwg Typewriter", "Tlwg Typist", "Boon", "Garuda", "Umpush", "Sriracha",
"Srisakdi", "IBM Plex Sans Thai Looped"
];

// === FUNCTION CREATE SELECT ===
function createFontSelect(prefixText, className) {
const select = document.createElement("select");
select.classList.add("font-select", className);

fontList.forEach(font => {
const option = document.createElement("option");
option.value = font;
option.textContent = `${prefixText}: ${font}`;
select.appendChild(option);
});

return select;
}

// === CREATE SELECTS ===
const hFontSelect = createFontSelect("หลัก", "heading-select");
const tableFontSelect = createFontSelect("โน้ต", "table-select");


// =========================
// 🔹 BACKGROUND COLORS
// =========================
const bgControl = document.createElement("div");
bgControl.classList.add("bg-control");

const bgTitle = document.createElement("div");
bgTitle.textContent = "สีพื้นหลัง";
bgControl.appendChild(bgTitle);

// สร้างปุ่มเลือกสี: color = "default" คือปุ่มคืนค่าเริ่มต้น (แสดงเป็น ↺)
function createColorButton(color, onClick) {
const btn = document.createElement("button");
btn.style.width = "24px";
btn.style.height = "24px";
btn.style.margin = "2px";
btn.style.cursor = "pointer";
btn.style.padding = "0";

if (color === "default") {
btn.textContent = "↺";
btn.title = "ค่าเริ่มต้น";
btn.style.background = "#fff";
btn.style.border = "1px dashed #999";
} else {
btn.style.background = color;
btn.style.border = "1px solid #999";
}

btn.addEventListener("click", () => onClick(color));
return btn;
}

// ใส่สีและจำค่า: "default" = ล้างสีที่ตั้งไว้ และลบค่าที่จำไว้
function applyBgColor(color) {
if (color === "default") {
document.body.style.backgroundColor = "";
localStorage.removeItem("bgColor");
} else {
document.body.style.backgroundColor = color;
localStorage.setItem("bgColor", color);
}
}

const bgColors = [
"default",
"#f5f5f5",
"#fff8e1",
"#e8f5e9",
"#e3f2fd",
"#1e2a3d",
"#212121"
];

bgColors.forEach(color => {
bgControl.appendChild(createColorButton(color, applyBgColor));
});

// =========================
// 🔹 FONT COLORS
// =========================
const fontColorControl = document.createElement("div");
fontColorControl.classList.add("font-color-control");

const fontColorTitle = document.createElement("div");
fontColorTitle.textContent = "สีตัวอักษร";
fontColorControl.appendChild(fontColorTitle);

function applyFontColor(color) {
if (color === "default") {
document.body.style.color = "";
localStorage.removeItem("fontColor");
} else {
document.body.style.color = color;
localStorage.setItem("fontColor", color);
}
}

const fontColors = [
"default",
"#000000",
"#444444",
"#5d4037",
"#0d47a1",
"#1b5e20",
"#b71c1c",
"#ffffff",
"#ffe082"
];

fontColors.forEach(color => {
fontColorControl.appendChild(createColorButton(color, applyFontColor));
});

// =========================
// 🔹 TABLE BORDER COLORS
// =========================
const borderControl = document.createElement("div");
borderControl.classList.add("border-control");

const borderTitle = document.createElement("div");
borderTitle.textContent = "สีห้องโน้ต";
borderControl.appendChild(borderTitle);

// ใส่สีเส้นตาราง: ช่องว่าง (ไม่มีข้อความ) จะไม่มีเส้นตั้งซ้ายและเส้นนอนล่าง
function applyTableBorder(color) {
    document.querySelectorAll("table, td, th").forEach(el => {
        if (color === "transparent") {
            el.style.border = "none";
            return;
        }
        el.style.border = `1px solid ${color}`;
        if (el.tagName === "TABLE") return;
        const text = el.textContent.trim();
        if (text === "" || text === "กลับต้น") {
            el.style.borderLeft = "hidden";
            el.style.borderBottom = "hidden";
        }
        // ช่อง "กลับต้น" อยู่ขวาสุด จึงซ่อนเส้นขวาด้วย
        if (text === "กลับต้น") {
            el.style.borderRight = "hidden";
        }
    });
}

const borderColors = [
    "#000000",
    "#444444",
    "#795548",
    "#1565c0",
    "#2e7d32",
    "#b71c1c",
    "transparent" // invisible
    ];

    borderColors.forEach(color => {

        const btn = document.createElement("button");
        
        btn.style.width = "24px";
        btn.style.height = "24px";
        btn.style.margin = "2px";
        btn.style.cursor = "pointer";
        
        if (color === "transparent") {
        btn.textContent = "✕";
        btn.style.background = "#fff";
        btn.style.border = "1px dashed #999";
        } else {
        btn.style.background = color;
        btn.style.border = "1px solid #999";
        }
        
        btn.addEventListener("click", () => {

        applyTableBorder(color);

        localStorage.setItem("tableBorderColor", color);
        
        });
        
        borderControl.appendChild(btn);
        
        });

// =========================
// 🔹 LOAD SAVED COLORS
// =========================
const savedBg = localStorage.getItem("bgColor");
if (savedBg) {
document.body.style.backgroundColor = savedBg;
}

const savedFontColor = localStorage.getItem("fontColor");
if (savedFontColor) {
document.body.style.color = savedFontColor;
}

const savedBorder = localStorage.getItem("tableBorderColor");

if (savedBorder) {
applyTableBorder(savedBorder);
}

// =========================
// 🔹 APPEND TO PANEL
// =========================
panel.appendChild(sizeControl);

panel.appendChild(bgControl);
panel.appendChild(fontColorControl);
panel.appendChild(borderControl);

panel.appendChild(hFontSelect);
panel.appendChild(tableFontSelect);

// =========================
// 🔹 APPEND EVERYTHING
// =========================
fontControl.appendChild(toggleBtn);
fontControl.appendChild(panel);
document.body.appendChild(fontControl);

// =========================
// 🔹 TOGGLE PANEL
// =========================
let i = 0
toggleBtn.addEventListener("click", () => {
    i++
    let num = i%2
    if (num == 1) {
        toggleBtn.textContent = "❌";
    } else {
        toggleBtn.textContent = "🎨";
    }
panel.classList.toggle("hiddenPanel");
});

// =========================
// 🔹 FONT SIZE SYSTEM
// =========================
let fontSize = localStorage.getItem("fontSize");
fontSize = fontSize ? parseInt(fontSize) : 20;

document.body.style.fontSize = fontSize + "px";

increaseBtn.addEventListener("click", () => {
fontSize += 2;
document.body.style.fontSize = fontSize + "px";
localStorage.setItem("fontSize", fontSize);
// console.log(fontSize);
fontSizePanel.innerText = fontSize
});

decreaseBtn.addEventListener("click", () => {
    if (fontSize > 8) {
fontSize -= 2;
document.body.style.fontSize = fontSize + "px";
// console.log(fontSize);
fontSizePanel.innerText = fontSize
localStorage.setItem("fontSize", fontSize);
}
});

// =========================
// 🔹 APPLY FONT
// =========================
function applyFonts() {
const hFont = hFontSelect.value;
const tableFont = tableFontSelect.value;

document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,body").forEach(el => {
el.style.fontFamily = `'${hFont}', monospace`;
});

document.querySelectorAll("table, td, th").forEach(el => {
el.style.fontFamily = `'${tableFont}', monospace`;
});

localStorage.setItem("hFont", hFont);
localStorage.setItem("tableFont", tableFont);
}

// === EVENTS ===
hFontSelect.addEventListener("change", applyFonts);
tableFontSelect.addEventListener("change", applyFonts);

// === LOAD SAVED ===
const savedHFont = localStorage.getItem("hFont") || "Sarabun";
const savedTableFont = localStorage.getItem("tableFont") || "Tlwg Typist";

hFontSelect.value = savedHFont;
tableFontSelect.value = savedTableFont;

applyFonts();