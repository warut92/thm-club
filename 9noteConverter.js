let allNotesFor9 = document.getElementById("thm").innerHTML
console.log(allNotesFor9);

const map = {
    "1": "5",
    "2": "6",
    "3": "7",
    "4": "1",
    "5": "2",
    "6": "3",
    "7": "4",
    "8": "5*",
    "9": "6*",
    "<tr><td><ninenote></td></tr>": ""
  };
  
let replaced = allNotesFor9.replace(/<ninenote>([\s\S]*?)<\/ninenote>/g, (match, inner) => {
    let converted = inner.replace(/\d/g, d => map[d] || d);
    return `<ninenote>${converted}</ninenote>`;
  });
  
  document.getElementById("thm").innerHTML = replaced;