//content table
//all str
	let allNotes =  document.getElementById('thm').innerHTML;

	//insert page tag for 
	allNotes = allNotes.replace(/<tr><td>next<\/td><\/tr>/gm, "<page>")
	document.getElementById('thm').innerHTML = allNotes;
	//get all title song namesd
	const songNames = allNotes.match(/<a name=\"[ก-๛A-z].*<\/a>/gm)

	//convert to str
	let songNamesStr = songNames.toString()
	//replace char for only name
	songNamesStr = songNamesStr.replace(/<a name=\"/g, "")
	songNamesStr = songNamesStr.replace(/\"/g, "")
	songNamesStr = songNamesStr.replace(/>.*?<\/a>/g, "")

	//split using , convert to array
	const songNamesArr = songNamesStr.split(",")

	let songNamesCont = ""
	for (let i = 0; i < songNamesArr.length; i++) {
		songNamesCont += "<a href=\"#" + songNamesArr[i] + "\">" + (i+1) + ". " + songNamesArr[i] + "</a><br>"
	}
	document.getElementById('contentTable').innerHTML = songNamesCont;


	// Get all HR elements
	const hrs = document.querySelectorAll('hr');

	if (hrs.length >= 2) {
		// Get all nodes between first and second <hr>
		let textBetween = '';
		let node = hrs[0].nextSibling;

		while (node && node !== hrs[1]) {
			if (node.nodeType === Node.TEXT_NODE) {
				textBetween += node.textContent.trim() + ' ';
			}
			node = node.nextSibling;
		}

		// console.log(textBetween.trim());
		document.title = textBetween + "(โน้ตดนตรีไทย ชมรมดนตรีไทย ชสว)";
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

sizeControl.appendChild(increaseBtn);
sizeControl.appendChild(decreaseBtn);

// =========================
// 🔹 FONT LIST
// =========================
const fontList = [
  "Sarabun", "Kanit", "Prompt", "Loma", "Mali",
  "Tlwg Typewriter", "Tlwg Typist", "Sriracha",
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
// 🔹 APPEND TO PANEL
// =========================
panel.appendChild(sizeControl);   // ✅ ปุ่ม ก+ ก- อยู่ใน panel
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
toggleBtn.addEventListener("click", () => {
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
});

decreaseBtn.addEventListener("click", () => {
  if (fontSize > 8) {
    fontSize -= 2;
    document.body.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
  }
});

// =========================
// 🔹 APPLY FONT
// =========================
function applyFonts() {
  const hFont = hFontSelect.value;
  const tableFont = tableFontSelect.value;

  document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,small,a,body").forEach(el => {
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
const savedTableFont = localStorage.getItem("tableFont") || "Sarabun";

hFontSelect.value = savedHFont;
tableFontSelect.value = savedTableFont;

applyFonts();