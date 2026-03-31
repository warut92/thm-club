//สำหรับหน้า index เท่านั้น

const increaseBtn = document.createElement("button");
increaseBtn.className = "increaseBtn";
increaseBtn.textContent = "ก+";
document.body.appendChild(increaseBtn);

const decreaseBtn = document.createElement("button");
decreaseBtn.className = "decreaseBtn";
decreaseBtn.textContent = "ก-";
document.body.appendChild(decreaseBtn);

// === LOAD FONT SIZE FROM localStorage ===
let fontSize = localStorage.getItem("fontSize");
if (fontSize) {
  fontSize = parseInt(fontSize);
} else {
  fontSize = 20; // default
}
document.body.style.fontSize = fontSize + "px";

// === ADD BUTTON EVENTS ===
increaseBtn.addEventListener("click", () => {
  fontSize += 2;
 document.body.style.fontSize = fontSize + "px";
  localStorage.setItem("fontSize", fontSize);
});

decreaseBtn.addEventListener("click", () => {
  if (fontSize > 8) {
    fontSize -= 2;
   document.body.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
  }
});


	 
// === FONT LIST ===
const fontList = ["Sarabun", "Kanit", "Prompt", 'Loma', 'Mali', 'Tlwg Typewriter', 'Tlwg Typist', 'Sriracha', 'Srisakdi', 'IBM Plex Sans Thai Looped'];

// === FUNCTION CREATE SELECT ===
function createFontSelect(prefixText, className) {
  const select = document.createElement("select");
  select.classList.add("font-select", className);

  fontList.forEach(font => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = `${prefixText}: ${font}`;
    option.classList.add("font-option");
    select.appendChild(option);
  });

  return select;
}

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

// === CREATE SELECTS ===
const hFontSelect = createFontSelect("หลัก", "heading-select");
const tableFontSelect = createFontSelect("โน้ต", "table-select");

// === APPEND SELECTS TO PANEL ===
panel.appendChild(hFontSelect);
panel.appendChild(tableFontSelect);

// === APPEND EVERYTHING ===
fontControl.appendChild(toggleBtn);
fontControl.appendChild(panel);
document.body.appendChild(fontControl);

// === TOGGLE FUNCTION ===
toggleBtn.addEventListener("click", () => {
  panel.classList.toggle("hiddenPanel");
});


function applyFonts() {
	const hFont = hFontSelect.value;
	const tableFont = tableFontSelect.value;
  
	// Apply to headings
	document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,small,a,body").forEach(el => {
	  el.style.fontFamily = `'${hFont}', monospace`;
	});
  
	// Apply to table
	document.querySelectorAll("table, td, th").forEach(el => {
	  el.style.fontFamily = `'${tableFont}', monospace`;
	});
  
	// Save
	localStorage.setItem("hFont", hFont);
	localStorage.setItem("tableFont", tableFont);
  }

  hFontSelect.addEventListener("change", applyFonts);
tableFontSelect.addEventListener("change", applyFonts);

const savedHFont = localStorage.getItem("hFont") || "T";
const savedTableFont = localStorage.getItem("tableFont") || "Sarabun";

hFontSelect.value = savedHFont;
tableFontSelect.value = savedTableFont;

applyFonts();