var startScreen = '<div id="fadescreen"></div><!--<div id="points">0</div>--><input type="button" value="Oh! Me First!" onclick="contentSwap(selectCharacterScreen)">' + '<input type="button" value="I\'ll guess..." onclick = "contentSwap(guessActor)">' + '<input type="button" value="lol" onclick="forfeit()">';

var guessActor = '	<!--<div id="points">0</div>-->' + '<div id="time">01:30</div>' + '<div id="olol"> ' + '<p> Waiting for the charade master to make his choice.</p>' + '</div>';

var selectCharacterScreen = '<div id="fadescreen"></div>' + '<!--<div id="points">-->' + '' + '</div><div id="time">01:30</div>' + '<div id="wrapper"><div id="olol"></div>' + '<form action = "" method="post" class = "calendarButton" id="getInfo">' + '<input type = "number" name="difficulty" value = "10" id="numVal">' + '<input type = "submit" id = "request" name="requester" value="Get me characters!">' + '</form>' + '</div>';

var passedId = "";
var data = "";
var interval;
var pause = true;
var minutes = "";
var seconds = "";
var mode = 0;

function changePoints(points) {
	document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML) + points;
}

function setMode(modeNum) {
	mode = modeNum;
	//1 = selector, 0 = guesser
}

function nextPlayer() {
	//get participant ID that has 1 in to state. Can be used in a get state to ID.
	//make all participants have getEnabledParticipants, then, on win, if self person = ID+1,
	//set the mode to 1 and re-set state.
	var participants = gapi.hangout.getEnabledParticipants();
	console.log(participants);
	var theirId = gapi.hangout.data.getState().myId;
	console.log("ME" + gapi.hangout.getLocalParticipantId());
	console.log(participants.length);
	for (var i = 0; i < participants.length; i++) {
		if(participants[i].id == theirId){
			if(i == participants.length){
				if(participants[0].id == gapi.hangout.getLocalParticipantId()){
					contentSwap(characterScreen);
				}
			}
			if(i < participants.length){
				if(participants[i+1].id == gapi.hangout.getLocalParticipantId()){
					contentSwap(characterScreen);
				}
			}
		}
	}
}

function contentSwap(selector) {
	mode = 0;
	//sets mode to 0 if selector
	document.getElementById("wrapper").innerHTML = selector;
	if (selector == selectCharacterScreen) {
		gapi.hangout.data.submitDelta({
			command : "forceChange",
			myId : gapi.hangout.getLocalParticipantId()
		});
		mode = 1;
		//sets mode to 1 if setter.
		document.getElementById("getInfo").addEventListener("change", function() {
			if (document.getElementById("numVal").value < 3) {
				document.getElementById("numVal").value = 3;
			}
			if (document.getElementById("numVal").value > 10) {
				document.getElementById("numVal").value = 10;
			}
		});
	}
}

function pauseCountdown() {
	if (pause == false) {
		clearInterval(interval);
		pause = true;
	}
}

function startCountdown() {
	if (pause == true) {
		pause = false;
		interval = window.setInterval(count, 1000);
	}
}

function count() {
	var minSec = document.getElementById("time").innerHTML.split(":");
	minutes = parseInt(minSec[0]);
	seconds = parseInt(minSec[1]);
	if (minutes == "00" && seconds == "00") {
		clearInterval(interval);
	}

	if (document.getElementById('time').innerHTML != "00:00") {

		if (seconds == 0) {
			minutes -= 1;
			seconds += 60;
		}
		if (minutes == 0 && seconds == 0) {
			minutes == 0;
			seconds == 1;
			clearInterval(interval);
		}

		if (minutes >= 0 && seconds >= 0) {
			seconds = seconds - 1;
		}
		if (minutes < 10 && minutes.length != 2) {
			minutes = "0" + minutes;
		}
		if (seconds < 10 && seconds.length != 2) {
			seconds = "0" + seconds;
		}

		if (minutes == 0) {
			minutes = "00";
		}
		document.getElementById("time").innerHTML = minutes + ":" + seconds;
	}
}

function forfeit() {
	//	contentSwap(guessActor);
	try {
		gapi.hangout.data.submitDelta({
			command : "forfeit",
			forfeitBy : gapi.hangout.getLocalParticipant().person.displayName
		});
	} catch (e) {
		console.log(e);
	}

	//broadcast forfeit and choose next participant from array.

}

function parseData(response) {
	var insertThing = "";
	for (var i = 0; i < response.Title.length; i++) {
		insertThing += "<div class = 'characters' id = 'char" + i + "' onclick=guessSelected(" + i + ")><div class='nameInTitle' id='nameInTitle" + i + "'>";
		insertThing += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
		insertThing += "<div class= 'bio' id='bio" + i + "''>";
		if (response.Image[i] != 'null' && response.Image[i] != undefined) {
			insertThing += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
		}
		insertThing += "<p class='hidden'>" + response.Bio[i] + "</p>";
		insertThing += "</div>";
		insertThing += "</div>";
	}
	document.getElementById("olol").innerHTML = insertThing;
}

function guessSelected(idOfGuess) {
	//console.log("THING1:"+idOfGuess);
	//console.log("THING2:"+passedId);
	if (idOfGuess == parseInt(passedId)) {
		document.getElementById("olol").innerHTML = "CORRECT!"
		gapi.hangout.data.submitDelta({
			command : "itGotGuessed",
			guessedBy : gapi.hangout.getLocalParticipant().person.displayName
		});
	}
	if (idOfGuess != passedId) {
		document.getElementById("olol").innerHTML = "INCORRECT! <p>Wait out the round to see if one of your co-players guessed it!";
		//trigger message sent to tell everyone they suck, wait five, cycle to next person.
	}
}

function charSelected(idoflulz) {
	//	console.log(idoflulz);
	//	var transmission = document.getElementById('wrapper').innerHTML;
	//	console.log(transmission);
	//	console.log( JSON.stringify(data));
//	getParticipants();
	try {
		//gapi.hangout.data.setValue("actorsChosen", JSON.stringify(data));
		gapi.hangout.data.submitDelta({
			actorsChosen : JSON.stringify(data),
			charID : "" + idoflulz,
			command : "",
			myId : gapi.hangout.getLocalParticipantId()
		});
		//console.log("shit got sent.");
	} catch(e) {
		console.log("Problemz;" + e);
	}

	//push to other clients of thingy at this point with all possible choices.
	//push with data ID, transmission as data, and charSelected.
	var responseString = "";
	responseString += "<div class = 'characters' id = 'char" + idoflulz + "' onclick=charSelected(" + idoflulz + ")><div class='nameInTitle' id='nameInTitle" + idoflulz + "'>";
	responseString += "<p>" + data.Actor[idoflulz] + " as " + data.Name[idoflulz] + " in " + data.Title[idoflulz] + ".</p></div>";
	responseString += "<div class= 'bio' id='bio" + idoflulz + "''>";
	if (data.Image[idoflulz] != 'null' && data.Image[idoflulz] != undefined) {
		responseString += "<img class='image' align='left' id= 'img" + idoflulz + "' src='" + data.Image[idoflulz] + "'>";
	}
	responseString += "<p>" + data.Bio[idoflulz] + "</p>";
	responseString += "</div>";
	responseString += "</div>";
	responseString += '<input type="button" value="Forfeit Round!" id="forfeitRound" onclick="forfeit()"> <input type="button" value="Start Timer!" id="startTimer" onclick="startCountdown()">';
	responseString += '<input type="button" value="pause" onclick="pauseCountdown()">';
	document.getElementById('wrapper').innerHTML = responseString;
}


$('#getInfo').live('submit', function() {
	//document.getElementById('points').innerHTML = (10 - document.getElementById("numVal").value) * 1000;
	$.ajax({
		url : "https://dev.welikepie.com/~though30/welikepie.com/dev/movieSiteInfo/gather.php?difficulty=" + document.getElementById("numVal").value + "&jsoncallback=?",
		dataType : 'jsonp',
		success : function(response) {
			data = response;
			document.getElementById("wrapper").innerHTML = "";
			//Actor, Name, Title, Image, Bio
			var insertString = "";
			for (var i = 0; i < response.Title.length; i++) {
				if ((response.Bio[i].length) >= 1000) {
					response.Bio[i] = response.Bio[i].substring(0, 1000) + "...";
				}
				insertString += "<div class = 'characters' id = 'char" + i + "' onclick=charSelected(" + i + ")><div class='nameInTitle' id='nameInTitle" + i + "'>";
				insertString += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
				insertString += "<div class= 'bio' id='bio" + i + "''>";
				if (response.Image[i] != 'null' && response.Image[i] != undefined) {
					insertString += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
				}
				insertString += "<p class='hidden'>" + response.Bio[i] + "</p>";
				insertString += "</div>";
				insertString += "</div>";

			}
			insertString += '<input type="button" value="Forfeit Round!" id="forfeitRound" onclick="forfeit()">';
			document.getElementById("wrapper").innerHTML = insertString;
			//console.log(response.Title);
			//console.log(response.Title[0]+","+response.Title.length);
		}
	});
	return false;
});

function onStateChanged(event) {
	try {
		if(gapi.hangout.data.getState().commend == "forfeit"){
			document.getElementById("wrapper").innerHTML = gapi.hangout.data.getState().forfeitBy+" forfeited the round. Boo him.";
			setTimeout(nextPlayer(),5000);
		}
		if(gapi.hangout.data.getState().command == "itGotGuessed"){
			var stringToReplace = "It got guessed by "+gapi.hangout.data.getState().guessedBy;
			document.getElementById("wrapper").innerHTML = stringToReplace;
			setTimeout(nextPlayer(),5000);
		}
		console.log("stateChanged triggered");
		console.log(gapi.hangout.data.getState().command + ":" + "forceChange");
		if (gapi.hangout.data.getState().command == "forceChange") {
			if (gapi.hangout.getLocalParticipantId() != gapi.hangout.data.getState().myId) {
				contentSwap(guessActor);
			}
		}
		if (mode == 0) {
			passedId = gapi.hangout.data.getState().charID;
			parseData(JSON.parse(gapi.hangout.data.getState().actorsChosen));
		}
	} catch(e) {
		console.log(e);
	}
}

function onMessageReceived(event) {
	console.log("shit is being received. We have progress.");
	try {
		console.log(event.message);
		console.log("receiving.");
	} catch (e) {
		console.log(e);
	}
}

/** Kick off the app. */
function init() {
	// When API is ready...
	gapi.hangout.onApiReady.add(function(eventObj) {
		if (eventObj.isApiReady) {
			try {
				gapi.hangout.data.onStateChanged.add(onStateChanged);
				gapi.hangout.data.onMessageReceived.add(onMessageReceived);
				console.log("received added to callback");
				contentSwap(startScreen);

			} catch (e) {
				console.log('init:ERROR');
				console.log(e);
			}
		}
	});
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init); 