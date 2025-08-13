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
	
				console.log(textBetween.trim());
				document.title = textBetween + "(โน้ตดนตรีไทย ชมรมดนตรีไทย ชสว)";
			}