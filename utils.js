function changePoints(points) {
	document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML) + points;
}

//function to easily submit deltas
function submitDelta(message) {
	gapi.hangout.data.submitDelta(message);
}
//sends commands easily
function sendCommand(stringCommand) {
	if(stringCommand == "itGotGuessed"){
		changePoints(1);
	}
	try {
		gapi.hangout.data.submitDelta({
			command : stringCommand
		});
	} catch(e) {
		console.log(e);
	}
}


function setMode(modeNum) {
	mode = modeNum;
	//1 = selector, 0 = guesser
}
