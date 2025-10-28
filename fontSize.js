
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
