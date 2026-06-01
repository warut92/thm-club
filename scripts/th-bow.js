let all_notes = document.getElementById('thm')?.innerHTML

let strokeWidth = "1.5"
let width = "35"
let height = "40"
let bowOutTop = "60%"
let bowInTop = "-30%"

console.log(fontSize);

const bowOut = `
<svg
style="position:absolute; top:${bowOutTop}; left:-35%; transform:rotate(180deg);"
width="${width}"
height="${height}"
viewBox="0 0 35 20">
<path d="M8 18 Q17 2 27 18"
stroke="black"
stroke-width="${strokeWidth}"
fill="none"/>
</svg>
`;

const bowIn = `
<svg
style="position:absolute; top:${bowInTop}; left:-20%;"
width="${width}"
height="${height}"
viewBox="0 0 35 20">
<path d="M8 18 Q17 2 27 18"
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
stroke-width="${strokeWidth}"
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