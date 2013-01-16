var timeForRound = "01:30";
// time per round
var people = 5;
// actors to summon
var passedId = "";
var data = "";
var interval;
var pause = true;
var minutes = "";
var seconds = "";
var mode;
var guessesMade = 1;
var points = 0;
var localText;
var menuFirstIn;
//this is set just after the app loads by pulling in information.
var menuAfter;
var startScreen = '<div id="fadescreen"></div><div id="pointSet"></div><div id="wrapper"></div><input type="button" value="Oh! Me First!" onclick="contentSwap(selectCharacterScreen)">' + '<input type="button" value="I\'ll guess..." onclick = "contentSwap(guessActor)">' + '<input type="button" value="lol" onclick="forfeit()">';

var guessActor = '<div id="pointSet"></div>' + '<div id="time">' + timeForRound + '</div>' + '<div id="wrapper"><div id="olol"> ' + '<p> Waiting for the charade master to make his choice.</p></div></div>';

var selectCharacterScreen = '<div id="fadescreen"></div>' + '<div id="pointSet"></div><div id="time">' + timeForRound + '</div>' + '<div id="wrapper"><div id="olol"></div></div>';

var gameModeDescriptions;
//---------------------------------------------UTILITY FUNCTIONS--------------------------------------
function changePoints(addPoints) {
	//console.log("ADDING POINTS");
	//console.log(parseInt(document.getElementById("pointSet").innerHTML) + addPoints);
	points += addPoints;
	document.getElementById("pointSet").innerHTML = points;
}

//function to easily submit deltas
function submitDelta(message) {
	gapi.hangout.data.submitDelta(message);
}

//sends commands easily
function sendCommand(stringCommand) {
	try {
		gapi.hangout.data.submitDelta({
			command : stringCommand
		});
	} catch(e) {
		console.error(e.stack);
	}
}

function setMode(modeNum) {
	mode = modeNum;
	//1 = selector, 0 = guesser
}

//------------------------------------------------------------------------------------------------------------
function actorLeft() {
	var participants = gapi.hangout.getEnabledParticipants();
	if (participants[0].id == gapi.hangout.getLocalParticipantId()) {
		contentSwap(selectCharacterScreen);
	}
}

function nextPlayer() {
	//get participant ID that has 1 in to state. Can be used in a get state to ID.
	//make all participants have getEnabledParticipants, then, on win, if self person = ID+1,
	//set the mode to 1 and re-set state.
	var participants = gapi.hangout.getEnabledParticipants();
	//console.log(participants);
	var theirId = gapi.hangout.data.getState().myId;
	//console.log("ME" + gapi.hangout.getLocalParticipantId());
	//console.log(theirId);
	//console.log(participants.length);

	for (var i = 0; i < participants.length; i++) {
		//console.log(i);
		//console.log("stuff is happening");
		//console.log(participants[i].id + "," + theirId);
		//console.log(participants[i].id == gapi.hangout.getLocalParticipantId());
		if (participants[i].id == theirId) {
			//console.log(participants[i].id == gapi.hangout.getLocalParticipantId());
			if (i == participants.length - 1) {
				if (participants[0].id == gapi.hangout.getLocalParticipantId()) {
					//console.log("KABLAM");
					contentSwap(selectCharacterScreen);
				}
			}
			if (i < participants.length - 1) {
				if (participants[i + 1].id == gapi.hangout.getLocalParticipantId()) {
					//console.log("KABLIM");
					contentSwap(selectCharacterScreen);
				}
			}
		}
	}
}

//swaps the content of the div to whatever you want in there.
function contentSwap(selector) {
	//sets mode to 0 if selector
	document.getElementById("container").innerHTML = selector;
	if (contentSwap == selectCharacterScreen || contentSwap == guessActor) {
		document.getElementById("pointSet").innerHTML = points;
	}
	if (selector == menuFirstIn) {
		console.log("Selected menu screen.");
	}
	if (selector == selectCharacterScreen) {
		retrieveActorsFromServer();
		setMode(1);
		mode = 1;
		gapi.hangout.data.submitDelta({
			command : "forceChange",
			myId : gapi.hangout.getLocalParticipantId()
		});
		//also fake submit form locally.
		//sets mode to 1 if setter.

	}
	if (selector == guessActor) {
		mode = 0;
	}
	//console.log(mode);
}

//--------------------------FUNCTIONS WHICH GOVERN STARTING AND STOPPING AND COUNTING COUNTDOWN AND FORFEIT---------
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
	if (minutes == "-1" && seconds == "60") {
		minutes == "00";
		seconds == "00";
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
	//changePoints(1);
	try {
		gapi.hangout.data.submitDelta({
			command : "forfeit",
			forfeitBy : gapi.hangout.getLocalParticipant().person.displayName
		});
	} catch (e) {
		console.error(e.stack);
	}

	//broadcast forfeit and choose next participant from array.

}

//-----------------------------------------------------------------------------------------------------------
//-------------------------------------USERCENTRIC TWADDLE---------------------------------------------------
//processes the JSON information once it has been received by the client.
function parseData(response) {
	var insertThing = "";
	for (var i = 0; i < response.Title.length; i++) {
		insertThing += "<a onclick=guessSelected(" + i + ")><div class = 'characters' id = 'char" + i + "'><div class='nameInTitle' id='nameInTitle" + i + "'>";
		insertThing += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
		insertThing += "<div class= 'bio' id='bio" + i + "''>";
		if (response.Image[i] != 'null' && response.Image[i] != undefined) {
			insertThing += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
		}
		insertThing += "<p class='hidden'>" + response.Bio[i] + "</p>";
		insertThing += "</div>";
		insertThing += "</div></a>";

	}
	document.getElementById("olol").innerHTML = insertThing;
}

//function carried out upon a guess being chosen by the user
function guessSelected(idOfGuess) {
	////console.log("THING1:"+idOfGuess);
	////console.log("THING2:"+passedId);
	if (idOfGuess == parseInt(passedId)) {
		document.getElementById("olol").innerHTML = "You're an awesome person for being right, go you!";
		changePoints(1);
		gapi.hangout.data.submitDelta({
			command : "itGotGuessed",
			guessedBy : gapi.hangout.getLocalParticipant().person.displayName
		});
	}
	if (idOfGuess != passedId) {
		document.getElementById("olol").innerHTML = "INCORRECT! <p>Wait out the round to see if one of your co-players guessed it!";
		//trigger message sent to tell everyone they suck, wait five, cycle to next person.
		sendCommand("badGuess");
	}
}

//-----------------------------------------------------------------------------------------------------------------
//--------------------------------------------------PERPETRATOR TWADDLE--------------------------------------------
//character selected by actor, charNum depicts which and pushes to participants.
function charSelected(charNum) {

	try {
		//gapi.hangout.data.setValue("actorsChosen", JSON.stringify(data));
		gapi.hangout.data.submitDelta({
			actorsChosen : JSON.stringify(data),
			charID : "" + charNum,
			command : "forceChange",
			myId : gapi.hangout.getLocalParticipantId()
		});
		////console.log("shit got sent.");
	}
	catch(e) {
		//console.log("Problemz;" + e);
	}

	//push to other clients of thingy at this point with all possible choices.
	//push with data ID, transmission as data, and charSelected.
	var responseString = "";
	responseString += "<div id='olol'>"
	responseString += "<div class = 'characters' id = 'char" + charNum + "' onclick=charSelected(" + charNum + ")><div class='nameInTitle' id='nameInTitle" + charNum + "'>";
	responseString += "<p>" + data.Actor[charNum] + " as " + data.Name[charNum] + " in " + data.Title[charNum] + ".</p></div>";
	responseString += "<div class= 'bio' id='bio" + charNum + "''>";
	if (data.Image[charNum] != 'null' && data.Image[charNum] != undefined) {
		responseString += "<img class='image' align='left' id= 'img" + charNum + "' src='" + data.Image[charNum] + "'>";
	}
	if (data.Bio[charNum] != 'null') {
		if (data.Bio[charNum] != undefined) {
			responseString += "<p>" + data.Bio[charNum] + "</p>";
		}
	}
	responseString += "</div>";
	responseString += "</div>";
	responseString += "</div>";
	responseString += '<input type="button" value="Start Timer!" id="startTimer" onclick="sendCommand(\'startCountdown\')">';
	responseString += '<input type="button" value="pause" onclick="sendCommand(\'pauseCountdown\')">';
	document.getElementById('wrapper').innerHTML = responseString;
}

//gets the text for general retrieval of a JSON object. I will not be responsible if your JSON is badly formed.
function getTextJSONs(jsonToRetrieve, varToWriteTo) {
	$.ajax({
		url : "https://dev.welikepie.com/~though30/welikepie.com/dev/movieSiteInfo/getJSON.php?json=" + jsonToRetrieve + "&jsoncallback=?",
		dataType : 'jsonp',
		success : function(response) {
			varToWriteTo = response;
		}
	});
}

//method which gets information from the IMDB scraped database. Voodoo be here.
function retrieveActorsFromServer() {
	//document.getElementById('points').innerHTML = (10 - document.getElementById("numVal").value) * 1000;
	$.ajax({
		url : "https://dev.welikepie.com/~though30/welikepie.com/dev/movieSiteInfo/gather.php?difficulty=" + people + "&jsoncallback=?",
		dataType : 'jsonp',
		success : function(response) {
			data = response;
			//Actor, Name, Title, Image, Bio
			document.getElementById("wrapper").innerHTML = "";
			document.getElementById("container").innerHTML = '<div id="pointSet">' + points + '</div>' + '<div id="time">' + timeForRound + '</div>' + '<div id="wrapper"></div>' + '<input type="button" value="Forfeit Round!" id="forfeitRound" onclick="forfeit()">';
			var insertString = "<div id='olol'>";
			for (var i = 0; i < response.Title.length; i++) {
				if (response.Bio[i] != null) {
					if ((response.Bio[i].length) >= 1000) {
						response.Bio[i] = response.Bio[i].substring(0, 1000) + "...";
					}
				}
				insertString += "<a onclick=charSelected(" + i + ")>";
				insertString += "<div class = 'characters' id = 'char" + i + "'><div class='nameInTitle' id='nameInTitle" + i + "'>";
				insertString += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
				insertString += "<div class= 'bio' id='bio" + i + "''>";
				if (response.Image[i] != 'null' && response.Image[i] != undefined) {
					insertString += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
				}
				insertString += "<p class='hidden'>" + response.Bio[i] + "</p>";
				insertString += "</div>";
				insertString += "</div>";
				insertString += "</a>";
			}
			insertString += '</div>';
			document.getElementById("wrapper").innerHTML = insertString;
			//console.log("end of things");
			////console.log(response.Title);
			////console.log(response.Title[0]+","+response.Title.length);
		}
	});
	return false;
};
//method which governs the fail state of the round. Actor controlled.
function wrongGuess() {
	guessesMade++;
	if (guessesMade == gapi.hangout.getEnabledParticipants().length) {
		gapi.hangout.data.submitDelta({
			command : "allBadGuess",
			actor : gapi.hangout.getLocalParticipant().person.displayName
		});
		guessesMade = 1;
	}
}

//------------------------------------------------------------------------------------------------------------------
//method which reacts whenever the state changes
function onStateChanged(event) {
	//console.log("POINTS!!! "+points);
	try {
		//console.log(gapi.hangout.data.getState());
		if (gapi.hangout.data.getState().command == "startCountdown") {
			startCountdown();
		}
		if (gapi.hangout.data.getState().command == "allBadGuess") {
			if (mode == 0) {
				var arrayToCycle = gapi.hangout.getEnabledParticipants();
				var actorId = gapi.hangout.data.getState().myId;
				var personName = -1;
				for (var i = 0; i < gapi.hangout.getEnabledParticipants().length; i++) {
					if (arrayToCycle[i].id == actorId) {
						personName = arrayToCycle[i].person.displayName;
					}
				}
				if (personName != -1) {
					document.getElementById("olol").innerHTML = personName + " is ashamed none of you got their amazing depiction.";
				} else {
					document.getElementById("olol").innerHTML = "The Invisible Man is ashamed none of you got their amazing depiction.";
				}
			}
			if (mode == 1) {
				document.getElementById("olol").innerHTML = "Nobody guessed your character. Don't worry though, I still like you!";
				try {
					//console.log("COMMAND SENDING"+points);
					gapi.hangout.data.submitDelta({
						actorsChosen : "",
						command : "nextPlayer",
						charID : "",
					});
				} catch(e) {
					console.error(e.stack);
				}
			}
		}
		if (gapi.hangout.data.getState().command == "badGuess") {
			//This needs to run only on the actor's program.
			wrongGuess();
		}
		if (gapi.hangout.data.getState().command == "pauseCountdown") {
			pauseCountdown();
		}
		if (gapi.hangout.data.getState().command == "nextPlayer") {

			//console.log("SHIT IS GETTING DONE"+points);
			setTimeout(nextPlayer());
		}
		if (gapi.hangout.data.getState().command == "forfeit") {
			pauseCountdown();
			if (mode != 1) {
				document.getElementById("wrapper").innerHTML = gapi.hangout.data.getState().forfeitBy + " forfeited the round. Boo him.";
			} else {
				document.getElementById("wrapper").innerHTML = "Why would you do such a thing?";
			}
			nextPlayer();
		}
		if (gapi.hangout.data.getState().command == "itGotGuessed") {
			try {
				//console.log("mode:" + mode);
				//console.log(gapi.hangout.data.getState().guessedBy + "," + gapi.hangout.getLocalParticipant().person.displayName);
				//console.log(gapi.hangout.data.getState().guessedBy == gapi.hangout.getLocalParticipant().person.displayName)
				if (mode == 1) {
					//console.log("actor");
					document.getElementById("olol").innerHTML = "You got guessed by " + gapi.hangout.data.getState().guessedBy + ".";
					changePoints(1);
					try {
						//console.log("COMMAND SENDING"+points);
						gapi.hangout.data.submitDelta({
							actorsChosen : "",
							command : "nextPlayer",
							charID : "",
							myId : gapi.hangout.getLocalParticipantId()
						});
					} catch(e) {
						console.error(e.stack);
					}
					//nextPlayer();
				} else if (gapi.hangout.data.getState().guessedBy != gapi.hangout.getLocalParticipant().person.displayName) {
					changePoints(1);
					//console.log("notEquals");
					document.getElementById("olol").innerHTML = "The answer was guessed by " + gapi.hangout.data.getState().guessedBy + ".";
					;
				}
			} catch(e) {
				console.error(e.stack);
			}
		}
		//console.log("stateChanged triggered");
		//console.log(gapi.hangout.data.getState().command + ":" + "command Issued");
		if (gapi.hangout.data.getState().command == "forceChange") {
			if (gapi.hangout.getLocalParticipantId() != gapi.hangout.data.getState().myId) {
				contentSwap(guessActor);
				if (gapi.hangout.data.getState().charID != null && gapi.hangout.data.getState().charID != undefined) {
					passedId = gapi.hangout.data.getState().charID;
					parseData(JSON.parse(gapi.hangout.data.getState().actorsChosen));
				}
			}
		}
		if (mode == 0 && gapi.hangout.data.getState().command == "noChange") {
			if (gapi.hangout.data.getState().command != "itGotGuessed") {
				passedId = gapi.hangout.data.getState().charID;
				parseData(JSON.parse(gapi.hangout.data.getState().actorsChosen));
			}
		}
	} catch(e) {
		console.error(e.stack);
	}
}

//function for message received
function onMessageReceived(event) {
	try {
		//console.log(event.message);
		//console.log("receiving.");
	} catch (e) {
		console.error(e.stack);
	}
}

function left(event) {
	//bit that works goes here.
	if (event[0].id == gapi.hangout.data.getState().myId) {
		document.getElementById("olol").innerHTML = "The actor ragequit. Ridicule him.";
	}
}

/** Kick off the app. */
function init() {
	// When API is ready...
	gapi.hangout.onApiReady.add(function(eventObj) {
		if (eventObj.isApiReady) {
			try {
				document.getElementById("time").innerHTML = timeForRound;
				gapi.hangout.data.onStateChanged.add(onStateChanged);
				gapi.hangout.data.onMessageReceived.add(onMessageReceived);
				gapi.hangout.onParticipantsDisabled.add(left);
				//gapi.hangout.data.onMessageReceived.add()
				//console.log("received added to callback");
				//console.log("a1");
				//console.log(gapi.hangout.data.getState());

				$.ajax({
					url : "https://dev.welikepie.com/~though30/welikepie.com/dev/movieSiteInfo/getJSON.php?json=textJSON.txt&jsoncallback=?",
					dataType : 'jsonp',
					success : function(response) {
						localText = response;
						if (gapi.hangout.getEnabledParticipants().length == 1) {
							var menuText = "<div id='wrapper'>";
							for (var i = 0; i < localText.GameModes.length; i++) {
								menuText += "<div class = 'gameModes' id='" + localText.GameModes[i].id + "'>";
								menuText += "<div class = 'gameTitle'>" + localText.GameModes[i].Title + "</div>"
								menuText += "<div class = 'gameDescription'>" + localText.GameModes[i].Description + "<div>";
								menuText += "<button id='" + localText.GameModes[i].id + "button'>" + localText.GameModes[i].ButtonText + "</button>";
								menuText += "</div>"
							}
							menuText += "</div>";
							menuFirstIn = menuText;
							contentSwap(menuFirstIn);
						}
				if (gapi.hangout.data.getState().command == undefined && gapi.hangout.getEnabledParticipants().length > 1) {
					menuAfter = "<div id='postMenu'>"+menuText.InputText.menuAfter+"</div>";
					contentSwap(menuAfter);
				}

					},
					error : function(response) {
						document.getElementById("container").innerHTML = "<div id='epicFail'> Something has died. Horrendously. We're really sorry about this! Please re-load! </div>";
					},
				});

				if (gapi.hangout.data.getState().command == "forceChange" && gapi.hangout.getEnabledParticipants().length > 1) {
					contentSwap(guessActor);
				} 

			} catch (e) {
				//console.log('init:ERROR');
				console.error(e.stack);
			}
		}
	});
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);
