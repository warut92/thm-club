const CORRECT_PASSWORD = "1234";
const STORAGE_KEY = "thm-club-password";

function getSavedPassword() {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch (e) {
		return null;
	}
}

function savePassword(value) {
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch (e) {
		// localStorage ใช้ไม่ได้ (เช่น private mode) ก็ข้ามไป
	}
}

function unlock() {
	// แสดงทั้งหน้า
	document.body.style.display = "block";
}

if (getSavedPassword() === CORRECT_PASSWORD) {
	// เคยใส่รหัสถูกแล้ว ไม่ต้องถามอีก
	unlock();
} else {
	const password = prompt("กรุณาใส่รหัสผ่าน:");

	if (password === CORRECT_PASSWORD) {
		savePassword(password);
		unlock();
	} else {
		// ไปหน้า index.html
		alert("รหัสผ่านไม่ถูกต้อง");
		window.location.href = "../index.html";
	}
}
