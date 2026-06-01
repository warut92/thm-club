// bow control panel

let all_notes = document.getElementById('thm')?.innerHTML
// console.log(all_notes);
//คันชักออก
let add_bow = all_notes.replace(/<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&gt;<\/sub>/g, "<div style=\"position: absolute; top: 50%; left: 35%; width: 20px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%) rotate(180deg);\"></div>")

//คันชักเข้า 2 โน้ต (ข้ามห้อง) /xxxx/xx-x/
add_bow = add_bow.replace(/([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub><\/span><\/td><td><span style=\"display: inline-block; position: relative;\">([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g, "$1<\/span><\/td><td><span style=\"display: inline-block; position: relative;\"><div style=\"position: absolute; top: 10%; left: -40%; width: 35px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%);\"></div>$2")

//คันชักเข้า 2 โน้ต (เสียงสูง ข้ามห้อง) /xxxx/xx-x/
add_bow = add_bow.replace(/([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub><\/span>([ดรมฟซลทํ])<\/td><td><span style=\"display: inline-block; position: relative;\">([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g, "$1<\/span><\/td><td><span style=\"display: inline-block; position: relative;\"><div style=\"position: absolute; top: 10%; left: -40%; width: 35px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%);\"></div>$2$3")

//คันชักเข้า
add_bow = add_bow.replace(/<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g, "<div style=\"position: absolute; top: 10%; left: 35%; width: 20px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%);\"></div>")

//คันชักออก 2 โน้ต
add_bow = add_bow.replace(/([ดรมฟซลทํ])<div style=\"position: absolute; top: 50%; left: 35%; width: 20px; height: 20px; border-top: 1\.5px solid black; border-radius: 50%; transform: translateX\(-30%\) rotate\(180deg\);\"><\/div><\/span><span style=\"display: inline-block; position: relative;\">([ดรมฟซลทํ])<div style=\"position: absolute; top: 50%; left: 35%; width: 20px; height: 20px; border-top: 1\.5px solid black; border-radius: 50%; transform: translateX\(-30%\) rotate\(180deg\);\"><\/div>/g, "$1<\/span><span style=\"display: inline-block; position: relative;\"><div style=\"position: absolute; top: 50%; left: -40%; width: 35px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%) rotate\(180deg\);\"></div>$2")

//คันชักออก 2 โน้ต แบบเสียงสูง
add_bow = add_bow.replace(/([ดรมฟซลทํ])<div style=\"position: absolute; top: 50%; left: 35%; width: 20px; height: 20px; border-top: 1\.5px solid black; border-radius: 50%; transform: translateX\(-30%\) rotate\(180deg\);\"><\/div><\/span>([ดรมฟซลทํ])<span style=\"display: inline-block; position: relative;\">([ดรมฟซลทํ])<div style=\"position: absolute; top: 50%; left: 35%; width: 20px; height: 20px; border-top: 1\.5px solid black; border-radius: 50%; transform: translateX\(-30%\) rotate\(180deg\);\"><\/div>/g, "$1<\/span><span style=\"display: inline-block; position: relative;\"><div style=\"position: absolute; top: 50%; left: -40%; width: 35px; height: 20px; border-top: 1.5px solid black; border-radius: 50%; transform: translateX(-30%) rotate\(180deg\);\"></div>$2$3")

document.getElementById('thm').innerHTML = add_bow