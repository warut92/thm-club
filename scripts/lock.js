const password = prompt("กรุณาใส่รหัสผ่าน:");

if (password === "1234") {

	// แสดงทั้งหน้า
	document.body.style.display = "block";

} else {
	// ไปหน้า index.html
	window.location.href = "../index.html";
	alert("รหัสผ่านไม่ถูกต้อง");
}
