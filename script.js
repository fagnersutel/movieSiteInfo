/*
* doing: setting game mode to "finish" once fulfilled finishing criteria.
* todo: find bug whereby "charade master" shows previous guesses before re-displaying.
* On "finish"; pull points array and get highest points and display winner. Then reset state.
* Go to #whoyagonnacall
*/
//it's a bit odd, but the myId element in the state object is the element holding information on charadeMaster
//make sure game modes are clicking through and working. Make timer work properly and shit.
var timeForRound = "";
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
//integer, 0 || 1, governs whether person is portraying the people or guessing.
var guessesMade = 1;
//total guesses made.
var points = 0;
//local points
var localText;
//things that get pulled in
var menuFirstIn;
//things that get pulled in
//this is set just after the app loads by pulling in information.
var menuAfter;
//things that get pulled in
var startScreen = "<div id='fadescreen'></div><div id='pointSet'></div><div id='wrapper'></div><input type='button' value='Oh! Me First!' onclick='contentSwap(selectCharacterScreen)'><input type='button' value='I\'ll guess...' onclick = 'contentSwap(guessActor)'><input type='button' value='lol' onclick='forfeit()'>";
var guessActor = '<div id="pointSet"></div><div id="time">' + timeForRound + '</div><div id="wrapper"><div id="contentWrapper"><p> Waiting for the charade master to make his choice.</p></div></div>';
var selectCharacterScreen = '<div id="fadescreen"></div><div id="pointSet"></div><div id="time">' + timeForRound + '</div><div id="wrapper"><div id="contentWrapper"></div></div>';
var endScreen;
var outOfTime;
var currentRound = 0;
//set depending on gameMode
var maxRounds = 100;
var gameMode;
var gameFinished = false;

//---------------------------------------------UTILITY FUNCTIONS--------------------------------------
function changePoints(addPoints) {
	//console.log("ADDING POINTS");
	//console.log(parseInt(document.getElementById("pointSet").innerHTML) + addPoints);
	if (currentRound <= maxRounds) {
		points += addPoints;
		document.getElementById("pointSet").innerHTML = points;
		//gapi.hangout.getLocalParticipant().person.id
		//myId
		if (mode == 0) {
			var pointArr = JSON.parse(gapi.hangout.data.getState().pointsArray);
			var actorsId = gapi.hangout.data.getState().myId;
			var thisId = gapi.hangout.getLocalParticipantId();
			pointArr[actorsId][0] = points;
			pointArr[thisId][0] = parseInt(pointArr[actorsId][0], 10) + addPoints;
			try {
				//gapi.hangout.data.setValue("actorsChosen", JSON.stringify(data));
				gapi.hangout.data.submitDelta({
					pointsArray : JSON.stringify(pointArr)
				});
				////console.log("shit got sent.");
			}
			catch(e) {
				//console.log("Problemz;" + e);
			}
		}
	}
}

function pointsSorter(JSONinfo) {
	var domString = "";
	var points = [];
	var name = [];
	var participants = gapi.hangout.getEnabledParticipants();
	console.log(participants);
	for (var key in JSONinfo) {
		//    console.log("Key: " + key);
		name.push(key);
		points.push(JSONinfo[key][0]);

		//   console.log("Value: " + JSONinfo[key][0]);
	}

	for (var i = 0; i < name.length; i++) {
		for (var j = 0; j < participants.length; j++) {
			if (name[i] == participants[j].id) {
				name[i] = participants[j].person.displayName;
			}
		}

	}

	bubble_srt(points, name);
	console.log(points);
	console.log(name);
	domString += "<ul>";
	for (var i = 0; i < points.length; i++) {
		domString += "<li><div class='player'>" + name[i] + "</div><div class='points'>" + points[i] + "</div>";
	}
	domString += "</ul>";
	document.getElementById("winners").innerHTML = domString;
}

function bubble_srt(a, b) {
	//basic bubble sort sorting the 'a' array and shuffling around
	//the b array to match the a array.
	var n = a.length;
	var i;
	var j;
	var t = 0;
	var r = "";
	for ( i = 0; i < n; i++) {
		for ( j = 1; j < (n - i); j++) {
			if (a[j - 1] > a[j]) {
				t = a[j - 1];
				r = b[j - 1];
				a[j - 1] = a[j];
				b[j - 1] = b[j];
				a[j] = t;
				b[j] = r;
			}
		}
	}

	a.reverse();
	b.reverse();

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

function setGameMode(modeToSet) {
	if (modeToSet == "finish") {
		document.getElementById("container").innerHTML = "PITY THE FOOL. GAMEOVER.";
	}
	try {
		gapi.hangout.data.submitDelta({
			GameMode : modeToSet,
			command : "setGameMode"
		});
	} catch(e) {
		console.error(e.stack);
	}
}

function reset(user) {
	console.log(user);

	console.log(gapi.hangout.data.getState());
	var points = new Array();
	var usefulBit = JSON.parse(gapi.hangout.data.getState().pointsArray);		
	for (var key in usefulBit) {
		//    console.log("Key: " + key);
		points[key]=[0,0];
		//   console.log("Value: " + JSONinfo[key][0]);
	}
	console.log(points);
	mode = 1;
	try{
	var updates = {
			"pointsArray" : JSON.stringify(points),
			"roundCurrentCount" : "0"
	};
	var removes = ["guessedBy","myId","GameMode","charID","actorsChosen"];
	gapi.hangout.data.submitDelta(updates,removes);
	}
	catch(e){console.log(e);}
	sendCommand("restartSelected");
	console.log(gapi.hangout.data.getState());
	console.log(gapi.hangout.data.getState().pointsArray);			
	contentSwap(menuFirstIn);
	
}

//------------------------------------------------------------------------------------------------------------

function actorLeft() {
	var participants = gapi.hangout.getEnabledParticipants();
	if (participants[0].id == gapi.hangout.getLocalParticipantId()) {
		contentSwap(selectCharacterScreen);
	}
}

function nextPlayer() {
	console.log(JSON.parse(gapi.hangout.data.getState().pointsArray));
	console.log("NextPlayer method");
	console.log(currentRound + " of " + maxRounds);

	if (gameMode == "3ShotsEach" && currentRound >= maxRounds * ((gapi.hangout.getEnabledParticipants().length) - 1)) {
		console.log("3 shots each");
		endCheck = 0;
		var pointArr = JSON.parse(gapi.hangout.data.getState().pointsArray);
		console.log(pointArr);
		console.log(gapi.hangout.data.getState().pointsArray);
		var endCheck = 0;
		try {
			var key, count = 0;
			for (key in pointArr) {
				count++;
			}
			console.log(count);
			for (var i = 0; i < count; i++) {
				endCheck += pointArr[gapi.hangout.getEnabledParticipants()[i].id][1];
				console.log(pointArr[gapi.hangout.getEnabledParticipants()[i].id][1]);
			}
		} catch(e) {
			console.log(e);
		}
		console.log(endCheck + "." + gapi.hangout.getEnabledParticipants().length * maxRounds);
		if (endCheck >= (gapi.hangout.getEnabledParticipants().length * maxRounds)) {
			setGameMode("finish");
		}

		sendCommand("nextPlayer");

		//check here if summation of points array values is elements*maxRounds. If it is, then globally set gamemode to finish.
		//#whoyagonnacall
		//var localId = JSON.parse(gapi.hangout.data.getState().pointsArray);
		//localId[gapi.hangout.getLocalParticipantId()][1];
	} else if (gameMode == "10RoundShootOut") {
		if (currentRound > maxRounds) {
			setGameMode("finish");
		}
	} else if (gameMode == "QuickFire") {
		if (currentRound > maxRounds) {
			setGameMode("finish");
		}
	}

	var participants = gapi.hangout.getEnabledParticipants();
	var theirId = gapi.hangout.data.getState().myId;

	for (var i = 0; i < participants.length; i++) {
		if (participants[i].id == theirId) {
			//console.log(participants[i].id == gapi.hangout.getLocalParticipantId());
			if (i == participants.length - 1) {
				if (participants[0].id == gapi.hangout.getLocalParticipantId()) {
					//console.log("KABLAM");
					if (gameMode == "3ShotsEach" && currentRound >= maxRounds) {
						sendCommand("nextPlayer");
					} else {
						contentSwap(selectCharacterScreen);
					}
				}
			}
			if (i < participants.length - 1) {
				if (participants[i + 1].id == gapi.hangout.getLocalParticipantId()) {
					//console.log("KABLIM");
					if (gameMode == "3ShotsEach" && currentRound >= maxRounds) {
						sendCommand("nextPlayer");
					} else {
						contentSwap(selectCharacterScreen);
					}
				}
			}
		}
	}
}

//swaps the content of the div to whatever you want in there.
function contentSwap(selector) {
	//sets mode to 0 if selector
	document.getElementById("container").innerHTML = selector;
	if (selector == outOfTime) {
		if (mode == 1) {
			setTimeout(function() {
				sendCommand("nextPlayer");
			}, 1000);
		}
	}
	if (selector == endScreen) {
		pointsSorter(JSON.parse(gapi.hangout.data.getState().pointsArray));
	}
	if (contentSwap == selectCharacterScreen || contentSwap == guessActor) {
		document.getElementById("pointSet").innerHTML = points;
	}
	if (selector == menuFirstIn) {
		mode = 1;
		console.log("Selected menu screen.");
	}
	if (selector == menuAfter) {
		mode = 0;
	}
	if (selector == selectCharacterScreen) {
		document.getElementById("wrapper").innerHTML = "We're waiting for information from the server :-)";
		retrieveActorsFromServer();
		currentRound++;
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
		if (gameMode == "QuickFire") {
			pauseCountdown();
			document.getElementById("time").innerHTML = timeForRound;
		}
		if (gameMode == "10RoundShootOut") {
			document.getElementById("time").innerHTML = "";
			document.getElementById("pointSet").innerHTML = points;
		}
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
		interval = null;
	}
	if (minutes == "-1" && seconds == "60") {
		minutes == "00";
		seconds == "00";
	}
	if (interval == null) {
		if (mode == 1 && gameMode == "QuickFire") {
			pause = true;
			contentSwap(outOfTime);
		}
	}
	if (document.getElementById('time')) {
		if (document.getElementById('time').innerHTML != "00:00" && interval != null) {

			if (seconds == 0) {
				minutes -= 1;
				seconds += 60;
			}
			if (minutes == 0 && seconds == 0) {
				minutes == 0;
				seconds == 1;
				clearInterval(interval);
				interval = null;
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
			if (interval != null) {
				document.getElementById("time").innerHTML = minutes + ":" + seconds;
			}
		}
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

//----------------------------------------STUFF TO DO WITH SETTING UP GAME MODE------------------------------
function GameSetup(modeToSetup) {

	if (modeToSetup == "10RoundShootOut") {
		pauseCountdown();
		timeForRound = "";
		maxRounds = 2;
		//10
	}

	if (modeToSetup == "3ShotsEach") {
		pauseCountdown();
		timeForRound = "";
		maxRounds = 1;
		//3
	}

	if (modeToSetup == "QuickFire") {
		timeForRound = "00:30";
		maxRounds = 2;
		//20
	}

}

//-------------------------------------USERCENTRIC TWADDLE---------------------------------------------------
//processes the JSON information once it has been received by the client.
function parseData(response) {
	var insertThing = "";
	for (var i = 0; i < response.Title.length; i++) {
		insertThing += "<a onclick=guessSelected(" + i + ")><div class = 'characters' id = 'char" + i + "'><div class='nameInTitle' id='nameInTitle" + i + "'>";
		insertThing += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
		insertThing += "<div class= 'bio' id='bio" + i + "''>";
		if (response.Image[i] != 'null' && response.Image[i] != undefined) {
			//	insertThing += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
		}
		insertThing += "<p class='hidden'>" + response.Bio[i] + "</p>";
		insertThing += "</div>";
		insertThing += "</div></a>";

	}
	document.getElementById("contentWrapper").innerHTML = insertThing;
}

//function carried out upon a guess being chosen by the user
function guessSelected(idOfGuess) {
	////console.log("THING1:"+idOfGuess);
	////console.log("THING2:"+passedId);
	if (idOfGuess == parseInt(passedId)) {
		document.getElementById("contentWrapper").innerHTML = "You're an awesome person for being right, go you!";
		changePoints(1);
		gapi.hangout.data.submitDelta({
			command : "itGotGuessed",
			guessedBy : gapi.hangout.getLocalParticipant().person.displayName
		});
	}
	if (idOfGuess != passedId) {
		pauseCountdown();
		document.getElementById("contentWrapper").innerHTML = "INCORRECT! <p>Wait out the round to see if one of your co-players guessed it!";
		//trigger message sent to tell everyone they suck, wait five, cycle to next person.
		sendCommand("badGuess");
	}
}

//-----------------------------------------------------------------------------------------------------------------
//--------------------------------------------------PERPETRATOR TWADDLE--------------------------------------------
//character selected by actor, charNum depicts which and pushes to participants.
function charSelected(charNum) {
	if (gameMode == "3ShotsEach") {
		currentRound++;
		//startCountdown();
	}
	var incrementRound = parseInt(gapi.hangout.data.getState().roundCurrentCount, 10) + 1;
	var localId = JSON.parse(gapi.hangout.data.getState().pointsArray);
	console.log(localId);
	console.log(gapi.hangout.getLocalParticipantId());
	localId[gapi.hangout.getLocalParticipantId()][1] = parseInt(localId[gapi.hangout.getLocalParticipantId()][1], 10) + 1;

	try {

		//gapi.hangout.data.setValue("actorsChosen", JSON.stringify(data));
		gapi.hangout.data.submitDelta({
			actorsChosen : JSON.stringify(data),
			charID : "" + charNum,
			command : "forceChange",
			myId : gapi.hangout.getLocalParticipantId(),
			roundCurrentCount : "" + incrementRound,
			pointsArray : JSON.stringify(localId)
		});
		//		console.log("shit got sent.");
	} catch(e) {
		console.log("Problemz;" + e);
	}

	//push to other clients of thingy at this point with all possible choices.
	//push with data ID, transmission as data, and charSelected.
	var responseString = "";
	responseString += "<div id='contentWrapper'>";
	responseString += "<div class = 'characters' id = 'char" + charNum + "'><div class='nameInTitle' id='nameInTitle" + charNum + "'>";
	responseString += "<p>" + data.Actor[charNum] + " as " + data.Name[charNum] + " in " + data.Title[charNum] + ".</p></div>";
	responseString += "<div class= 'bio' id='bio" + charNum + "'>";
	if (data.Image[charNum] != 'null' && data.Image[charNum] != undefined) {
		responseString += "<p><img class='image' align='left' id= 'img" + charNum + "' src='" + data.Image[charNum] + "'>";
	}
	if (data.Bio[charNum] != 'null') {
		if (data.Bio[charNum] != undefined) {
			if (data.Image[charNum] == 'null' || data.Image[charNum] == undefined) {
				responseString += "<p>";
			}
			responseString += data.Bio[charNum] + "</p>";
		}
	}
	responseString += "</div>";
	responseString += "</div>";
	responseString += "</div>";
	//responseString += '<input type="button" value="Start Timer!" id="startTimer" onclick="sendCommand(\'startCountdown\')">';
	//responseString += '<input type="button" value="pause" onclick="sendCommand(\'pauseCountdown\')">';
	document.getElementById('wrapper').innerHTML = responseString;
	if (timeForRound != "") {
		console.log("thisThing");
		sendCommand("startCountdown");
	}
}

//gets the text for general retrieval of a JSON object. I will not be responsible if your JSON is badly formed.
function getTextJSONs(jsonToRetrieve, varToWriteTo) {
	$.ajax({
		url : "https://dev.welikepie.com:444/movieSiteInfo/getJSON.php?json=" + jsonToRetrieve + "&jsoncallback=?",
		dataType : 'jsonp',
		success : function(response) {
			varToWriteTo = response;
		}
	});
}

//method which gets information from the IMDB scraped database. Voodoo be here.
function retrieveActorsFromServer() {
	if (mode == 1) {
		pauseCountdown();
	}
	document.getElementById("container").innerHTML = "<div id='pointSet'></div><div id='wrapper'></div>";
	document.getElementById("pointSet").innerHTML = points;
	document.getElementById("wrapper").innerHTML = "We're waiting for information from the server :-)";
	//document.getElementById('points').innerHTML = (10 - document.getElementById("numVal").value) * 1000;
	$.ajax({
		url : "https://dev.welikepie.com:444/movieSiteInfo/gather.php?difficulty=" + people + "&jsoncallback=?",
		dataType : 'jsonp',
		success : function(response) {
			data = response;
			//Actor, Name, Title, Image, Bio
			document.getElementById("wrapper").innerHTML = "";
			document.getElementById("container").innerHTML = '<div id="pointSet">' + points + '</div>' + '<div id="time">' + timeForRound + '</div>' + '<div id="wrapper"></div>' + '<input type="button" value="Forfeit Round!" id="forfeitRound" onclick="forfeit()">';
			var insertString = "<div id='contentWrapper'>";
			console.log("receiving information");
			for (var i = 0; i < response.Title.length; i++) {
				if (response.Bio[i] != null) {
					if ((response.Bio[i].length) >= 1000) {
						response.Bio[i] = response.Bio[i].substring(0, 1000) + "...";
					}
				}
				insertString += "<div class = 'characters' id = 'char" + i + "'>";
				insertString += "<a onclick=charSelected(" + i + ")>";
				insertString += "<div class='nameInTitle' id='nameInTitle" + i + "'>";
				insertString += "<p>" + response.Actor[i] + " as " + response.Name[i] + " in " + response.Title[i] + ".</p></div>";
				if (response.Image[i] != 'null' && response.Image[i] != undefined) {
					insertString += "<img class='image' id= 'img" + i + "' src='" + response.Image[i] + "'>";
				}
				insertString += "</a>";
				insertString += "</div>";
			}
			insertString += '</div>';
			document.getElementById("wrapper").innerHTML = insertString;
			var increment = people;
			//incrementing through array of classnames loaded
			try {
				$('.image').load(function() {
					increment--;
					var w = $(this).width();
					var h = $(this).height();
					if (w >= h) {
						document.getElementsByClassName("image")[increment].style.width = "200px";
					} else if (w <= h) {
						document.getElementsByClassName("image")[increment].style.height = "200px";
					}
				});
			} catch(e) {
				console.log(e);
			}
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

//-----------------------------------------------------------------------------------------------------------------
//method which reacts whenever the state changes
function onStateChanged(event) {
	//console.log("POINTS!!! "+points);
	if (!gameFinished) {
		try {
			//console.log(JSON.parse(gapi.hangout.data.getState().pointsArray));
			console.log(event);
			console.log(gapi.hangout.data.getState().command);
			//console.log(gapi.hangout.data.getState());
			if (gapi.hangout.data.getState().command == "restartSelected"){
				console.log("AHOY THERE!");
				if(mode==0){
					contentSwap(menuAfter);
				}
			}
			if (gapi.hangout.data.getState().command == "startCountdown") {
				startCountdown();
			}
			if (gapi.hangout.data.getState().command == "setGameMode") {
				console.log(gapi.hangout.data.getState().GameMode);

				gameMode = gapi.hangout.data.getState().GameMode;
				console.log(maxRounds + "," + currentRound);
				if (gameMode != "finish") {
					GameSetup(gameMode);
					if (mode == 1) {
						contentSwap(selectCharacterScreen);
					} else if (mode == 0) {
						contentSwap(guessActor);
					}
				} else {
					console.log("game finishing???");
					gameFinished = true;
					contentSwap(endScreen);
				}
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
						document.getElementById("contentWrapper").innerHTML = personName + " is ashamed none of you got their amazing depiction.";
					} else {
						document.getElementById("contentWrapper").innerHTML = "The Invisible Man is ashamed none of you got their amazing depiction.";
					}
				}
				if (mode == 1) {
					pauseCountdown();
					document.getElementById("contentWrapper").innerHTML = "Nobody guessed your character. Don't worry though, I still like you!";
					setTimeout(function() {
						if (gameMode == "quickFire" && mode == 1) {
							pause = true;
						}
						sendCommand("nextPlayer");
					}, 1000);
				}
			}
			if (gapi.hangout.data.getState().command == "badGuess") {
				//This needs to run only on the charade masters program.
				wrongGuess();
			}
			if (gapi.hangout.data.getState().command == "pauseCountdown") {
				pauseCountdown();
			}
			if (gapi.hangout.data.getState().command == "nextPlayer") {
				//console.log("SHIT IS GETTING DONE"+points);
				if (mode == 1) {
					try {
						gapi.hangout.data.submitDelta({
							actorsChosen : ""
						});
					} catch(e) {
						console.log(e);
					}
				}
				if (gameMode == "quickFire") {
					pause = true;
				}
				if (gameMode == "3ShotsEach") {
					try {
						gapi.hangout.data.submitDelta({
							actorsChosen : ""
						});
					} catch(e) {
						console.log(e);
					}
					nextPlayer();
				} else if (maxRounds > currentRound) {
					nextPlayer();
				} else {
					console.log(maxRounds + "," + currentRound);
					setGameMode("finish");
				}
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
					pauseCountdown();
					//console.log("mode:" + mode);
					//console.log(gapi.hangout.data.getState().guessedBy + "," + gapi.hangout.getLocalParticipant().person.displayName);
					//console.log(gapi.hangout.data.getState().guessedBy == gapi.hangout.getLocalParticipant().person.displayName)
					if (mode == 1) {
						//console.log("actor");
						document.getElementById("contentWrapper").innerHTML = "You got guessed by " + gapi.hangout.data.getState().guessedBy + ".";
						changePoints(1);
						setTimeout(function() {
							try {
								if (gameMode == "quickFire" && mode == 1) {
									pause = true;
								}
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
						}, 1000);

						//nextPlayer();
					} else if (gapi.hangout.data.getState().guessedBy != gapi.hangout.getLocalParticipant().person.displayName) {
						changePoints(1);
						//console.log("notEquals");
						document.getElementById("contentWrapper").innerHTML = "The answer was guessed by " + gapi.hangout.data.getState().guessedBy + ".";
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
					if (gameMode == "QuickFire") {
						startCountdown();
					}
					contentSwap(guessActor);
					if (gapi.hangout.data.getState().charID != null && gapi.hangout.data.getState().charID != undefined) {
						passedId = gapi.hangout.data.getState().charID;
						try {
							console.log("655");
							console.log(gapi.hangout.data.getState().actorsChosen);
							parseData(JSON.parse(gapi.hangout.data.getState().actorsChosen));
						} catch(e) {
							console.log(e.stack);
							try {
								parseData(JSON.parse(gapi.hangout.data.getState().actorsChosen));
							} catch(e) {
								console.log(e.stack);
								contentSwap(guessActor);
							}
						}
					}
				}
				if (mode == 1) {
					gapi.hangout.data.submitDelta({
						command : "",
						actorsChosen : ""
					});
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
	console.log(event);
	if (event[0].disabledParticipants[0].id == gapi.hangout.data.getState().myId) {
		document.getElementById("contentWrapper").innerHTML = "The actor ragequit. Ridicule him.";
	}
	//wait five, then 
}

/** Kick off the app. */
function init() {
	// When API is ready...
	console.log("maybe something?");
	gapi.hangout.onApiReady.add(function(eventObj) {
		if (eventObj.isApiReady) {
			try {
				//document.getElementById("time").innerHTML = timeForRound;
				gapi.hangout.data.onStateChanged.add(onStateChanged);
				gapi.hangout.data.onMessageReceived.add(onMessageReceived);
				gapi.hangout.onParticipantsDisabled.add(left);

				$.ajax({
					url : "https://dev.welikepie.com:444/movieSiteInfo/getJSON.php?json=textJSON.txt&jsoncallback=?",
					dataType : 'jsonp',
					success : function(response) {
						localText = response;

						var menuText = "<div id='wrapper'>";
						for (var i = 0; i < localText.GameModes.length; i++) {
							menuText += "<div class = 'gameModes' id='" + localText.GameModes[i].id + "'>";
							menuText += "<div class = 'gameTitle'>" + localText.GameModes[i].Title + "</div>"
							menuText += "<div class = 'gameDescription'>" + localText.GameModes[i].Description + "</div>";
							menuText += "<button class = 'gameButtons' id='" + localText.GameModes[i].id + "button'onclick='setGameMode(\"" + localText.GameModes[i].id + "\")'>" + localText.GameModes[i].ButtonText + "</button>";
							menuText += "</div>"
						}
						menuText += "</div>";
						menuFirstIn = menuText;
						outOfTime = "<div id='contentWrapper'><div id='timeFinished'>" + localText.InputText[0].outOfTimeText + "</div></div>";
						endScreen = "<div id='done'>" + localText.InputText[0].endScreenText + "</div>";
						try {
							currentRound = 0;
							var localId = new Array();
							localId[gapi.hangout.getLocalParticipantId()] = [points, 0];
							gapi.hangout.data.submitDelta({
								"pointsArray" : JSON.stringify(localId),
								"roundCurrentCount" : "0",
								"command" : ""
							});
							console.log("pointsArray sent!");
						} catch(e) {
							console.log("We failed on start." + e);
						}
						console.log(gapi.hangout.getEnabledParticipants()[0].id + "," + gapi.hangout.getLocalParticipantId());
						if (gapi.hangout.getEnabledParticipants()[0].id == gapi.hangout.getLocalParticipantId()) {
							try {
								//var localId = ;create empty object then add through array notation.
								var localId = {};
								localId[gapi.hangout.getLocalParticipantId()] = [points, 0];
								//console.log("COMMAND SENDING"+points);
								gapi.hangout.data.submitDelta({
									"pointsArray" : JSON.stringify(localId),
									"command" : ""
								});
								console.log("pointsArray set");
							} catch(e) {
								console.error(e.stack);
							}
							contentSwap(menuFirstIn);
						}
						console.log(gapi.hangout.data.getState().command);
						if (gapi.hangout.data.getState().command == "" && gapi.hangout.getEnabledParticipants().length > 1) {
							var localId = JSON.parse(gapi.hangout.data.getState().pointsArray);
							console.log(localId);
							console.log(gapi.hangout.getLocalParticipantId());
							localId[gapi.hangout.getLocalParticipantId()] = [points, 0];
							console.log("COMMAND SENDING"+points);
							gapi.hangout.data.submitDelta({
								"pointsArray" : JSON.stringify(localId)
							});
							menuAfter = "<div id='postMenu'>" + localText.InputText[0].menuAfterText + "</div>";
							contentSwap(menuAfter);
							console.log("pointsArray sent from command being nothing and people joined.");
						} else if (gapi.hangout.getEnabledParticipants().length > 1 && gapi.hangout.data.getState().GameMode != undefined) {

							var localId = JSON.parse(gapi.hangout.data.getState().pointsArray);
							console.log(localId);
							console.log(gapi.hangout.getLocalParticipantId());
							localId[gapi.hangout.getLocalParticipantId()] = [points, 0];
							//console.log("COMMAND SENDING"+points);
							gapi.hangout.data.submitDelta({
								"pointsArray" : JSON.stringify(localId)
							});
							console.log("is this happening?");
							gameMode = gapi.hangout.data.getState().GameMode;
							GameSetup(gameMode);
							contentSwap(guessActor);
						}
						//startScreen = localText.startScreen;
					},
					error : function(response) {
						document.getElementById("container").innerHTML = "<div id='epicFail'> Something has died. Horrendously. We're really sorry about this! Please re-load! </div>";
					},
				});

				if (gapi.hangout.data.getState().command == "forceChange" && gapi.hangout.getEnabledParticipants().length > 1) {

					var localId = JSON.parse(gapi.hangout.data.getState().pointsArray);
					console.log(localId);
					console.log(gapi.hangout.getLocalParticipantId());
					localId[gapi.hangout.getLocalParticipantId()] = [points, 0];
					//console.log("COMMAND SENDING"+points);
					gapi.hangout.data.submitDelta({
						"pointsArray" : JSON.stringify(localId)
					});

					gameMode = gapi.hangout.data.getState().GameMode;
					GameSetup(gameMode);
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
