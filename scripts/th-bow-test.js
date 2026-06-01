let all_notes = document.getElementById('thm')?.innerHTML

// ค่าเริ่มต้น
let strokeWidth = 1.5;
let width = 20;
let height = 30;
let bowOutTop = 5;
let leftOut = -10;
let bowInTop = -20;
let leftIn = -8;

let startX = 8;      // จุดเริ่มต้น X
let startY = 18;     // จุดเริ่มต้น Y

let controlX = 17;   // จุดควบคุม X
let controlY = 8;    // จุดควบคุม Y

let endX = 27;       // จุดสิ้นสุด X
let endY = 18;       // จุดสิ้นสุด Y

console.log(fontSize);


  //สร้างตัวแปร
  //คันชักออก
  let bowOut = `
<svg
style="position:absolute; top:5px; left:-10px; transform:rotate(180deg);"
width="30"
height="40"
viewBox="0 0 35 20">
<path d="M10 16 Q17 4 24 16"
stroke="black"
stroke-width="1.5"
fill="none"/>
</svg>
`;
//คันชักเข้า
let bowIn = `
<svg
style="position:absolute; top:-20px; left:-8px;"
width="30"
height="40"
viewBox="0 0 35 20">
<path d="M10 16 Q17 4 24 16"
stroke="black"
stroke-width="1.5"
fill="none"/>
</svg>
`;

let bowOut2 = `
<svg
style="position:absolute; top:70%; left:-40%; transform:rotate(180deg);"
width="35"
height="30"
viewBox="0 0 35 20">
<path d="M2 18 Q17 2 33 18"
stroke="black"
stroke-width="${strokeWidth}"
fill="none"/>
</svg>
`;

let bowIn2 = `
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
  
  // คันชักเข้า 2 โน้ต (เสียงสูง ข้ามห้อง)
  add_bow = add_bow.replace(
    /([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub><\/span>([ดรมฟซลทํ])<\/td><td><span style=\"display: inline-block; position: relative;\">([ดรมฟซลท])<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g,
    `$1</span></td><td><span style="display: inline-block; position: relative;">${bowIn2}$2$3`
  );
  
  // คันชักเข้า
  add_bow = add_bow.replace(
    /<sub style="position: absolute; bottom: -0\.5em; left: 50%; transform: translateX\(-50%\);">&lt;<\/sub>/g,
    bowIn
  );

  document.getElementById('thm').innerHTML = add_bow
