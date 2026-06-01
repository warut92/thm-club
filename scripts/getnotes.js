  //ดึงโน้ตตัวเลข
  const allTextNote = document.getElementById("thm").innerText;

//   console.log(allTextNote);
  const regex = /\(\[?([^\]\)]+)\]?\)\s*([\s\S]*?)\s*\/\//g;
  
  let matches;
  const sections = [];
  
  while ((matches = regex.exec(allTextNote)) !== null) {
      sections.push({
      name: matches[1].replace("ท่อน_%", "ท่อน ").replace("</a>", "ท่อน "),
      data: matches[2]
          .replace(/\s+/g, "") // ลบทุกช่องว่าง + ขึ้นบรรทัด
      });
  }

  console.log(sections);