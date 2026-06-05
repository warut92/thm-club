// console.log(thm.innerHTML);

let khimBar

khimBar = thm.innerHTML.replace(
    /<\/tbody><\/table>/gm,
    `</table><br><table>`
  );

khimBar = khimBar.replace(
    /<td style="font-family: &quot;Tlwg Typist&quot;, monospace;"><\/td><td style="font-family: &quot;Tlwg Typist&quot;, monospace;"><\/td>/gm,
    `</table><br><table>`
  );

  
  document.getElementById('thm').innerHTML = khimBar