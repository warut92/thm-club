//content table
//all str
	let allNotes =  document.getElementById('thm').innerHTML;

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
		songNamesCont += "<a href=\"#" + songNamesArr[i] + "\">" + (i+1) + " " + songNamesArr[i] + "</a><br>"
	}
	document.getElementById('contentTable').innerHTML = songNamesCont;
