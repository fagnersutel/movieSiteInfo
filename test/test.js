var JSONarr = {"Person 1":[1,1],"Person 2":[2,1]}  ;
var removes = ["guessedBy","myId","GameMode","charID","actorsChosen"];
var textTemplating = "";
var people = 5;
var points = 10;
var timeForRound = "01:30";
var data;
//pointsSorter(JSONarr);
//jsonOrganiser(JSONarr);
//dataPopulate(10);//populates data field.
$.ajax({
	url : "../getJSON.php?json=textJSON.txt&jsoncallback=?",
	async : false,
	dataType : "jsonp",
	success : function(response){
		textTemplating = response;
	}
	
})
//||CHARACTER played by ACTOR in FILM
//||Character bold.
//||make images full width
//||get default stylings through

//--what other players see;
//||general mouseOver effect of textUnderline
//||list item background colour change slightly
//||make it darker on first select, add button in which actually guesses.
//||slight top border on each list item

//||--winner
//||bold headings for table.

//document.getElementById("container").innerHTML = mainMenu();
//document.getElementById("wrapper").innerHTML = waiting();
actorSelect(10); //num is indicative of how many actors to pull through
//parseData(10); //brings up what other players see.
//winner(JSONarr);


function winner(JSONinfo) {
	console.log(textTemplating["InputText"][0]["endScreenText"]);
	document.getElementById("container").innerHTML = textTemplating["InputText"][0]["endScreenText"];
	var domString = "";
	var points = [];
	var name = [];
	for (var key in JSONinfo) {
		//    console.log("Key: " + key);
		name.push(key);
		points.push(JSONinfo[key][0]);

		//   console.log("Value: " + JSONinfo[key][0]);
	}
	bubble_srt(points, name);
	console.log(points);
	console.log(name);
	domString += "<ul>";
	domString += "<li><div class='player bold'>Player</div><div class='points bold'>Points</div>";
	for (var i = 0; i < points.length; i++) {
		domString += "<li><div class='player'>" + name[i] + "</div><div class='points'>" + points[i] + "</div>";
	}
	domString += "</ul>";
	mode = 0;
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

function guessSelected(num){
	var element = document.getElementById("ButtonSelect"); element.parentNode.removeChild(element);
	console.log("were you playing, you'd've selected "+num);
}

function parseData(num) {
	dataPopulate(num)
	var response = data;
	var insertThing = "<div id='userDisplay'><ul>";
	for (var i = 0; i < response.Title.length; i++) {
		insertThing += "<li class='list characters' id = 'char" + i + "' onclick=selectButton('guessSelected'," + i + ")><div class='nameInTitle' id='nameInTitle" + i + "'>";
		insertThing += "<p>"+ response.Name[i] +" played by " + response.Actor[i] + " in " + response.Title[i] + ".</p></div>";
		insertThing += "<div class= 'bio' id='bio" + i + "''>";
		if (response.Image[i] != 'null' && response.Image[i] != undefined) {
			//	insertThing += "<img class='image' align='left' id= 'img" + i + "' src='" + response.Image[i] + "'>";
		}
		insertThing += "<p class='hidden'>" + response.Bio[i] + "</p>";
		insertThing += "</div>";

	}
	insertThing += "</ul></div>";
	document.getElementById("container").innerHTML = '<div id="pointSet">' + points + '</div>' + '<div id="SelectPlayerButton" ></div>'+'<div id="time">' + timeForRound + '</div>' +"<div id='wrapper'><div id='contentWrapper'></div></div>";

	document.getElementById("contentWrapper").innerHTML = insertThing;

}

function charSelected(charNum) {
	var element = document.getElementById("ButtonSelect"); element.parentNode.removeChild(element);
	//push to other clients of thingy at this point with all possible choices.
	//push with data ID, transmission as data, and charSelected.
	var responseString = "";
	responseString += "<div id='contentWrapper'>";
	responseString += "<div class = 'characters' id = 'char" + charNum + "'><div class='nameInTitle' id='nameInTitle" + charNum + "'>";
	responseString += "<p><span class='bold'>" + data.Name[charNum] + "</span> played by " + data.Actor[charNum] + " in " + data.Title[charNum] + ".</p></div>";
	responseString += "<div class= 'bio' id='bio" + charNum + "'>";
	if (data.Image[charNum] != 'null' && data.Image[charNum] != undefined) {
		responseString += "<img class='image fullBio' align='left' id= 'img" + charNum + "' src='" + data.Image[charNum] + "'><p>";
	}
	if (data.Bio[charNum] != 'null') {
		if (data.Bio[charNum] != undefined) {
			if (data.Image[charNum] == 'null' || data.Image[charNum] == undefined) {
				responseString += "<p id='charBioLongForm'>";
			}
			responseString += data.Bio[charNum] + "...</p>";
		}
	}
	responseString += "</div>";
	responseString += "</div>";
	responseString += "</div>";
	//responseString += '<input type="button" value="Start Timer!" id="startTimer" onclick="sendCommand(\'startCountdown\')">';
	//responseString += '<input type="button" value="pause" onclick="sendCommand(\'pauseCountdown\')">';
	document.getElementById('wrapper').innerHTML = "<div id='scrollWrapper'>"+responseString+"</div>"
}

//NEEDS ADDING IN MAIN GAME:
function selectButton(method, index){
	var charNames = document.getElementsByClassName("characters darkened");
		console.log(charNames);
		for(var i = 0; i < charNames.length; i++){
			console.log(i);
			charNames[i].className="list characters";
		}
		document.getElementById("char"+index).className="characters darkened";
	if(method=="charSelected"){//
		document.getElementById("SelectPlayerButton").innerHTML = '<button id="ButtonSelect" class="btn btn-small" onclick="(function(){'
			+'charSelected('+index+');'+'})();">Select Me</button>';
	}
	if(method=="guessSelected"){//
		document.getElementById("SelectPlayerButton").innerHTML = '<button id="ButtonSelect" class="btn btn-small" onclick="(function(){'
			+'guessSelected('+index+');})();">Select Me</button>';
	}
}

function actorSelect(num){
	dataPopulate(num);
	var insertString;
	var response = data;
			//Actor, Name, Title, Image, Bio
			document.getElementById("wrapper").innerHTML = "";
			document.getElementById("container").innerHTML = '<div id="pointSet">' + points + '</div>' + '<div id="SelectPlayerButton" ></div>'+'<div id="time">' + timeForRound + '</div>' + '<div id="wrapper"></div>' + '<input type="button" class="btn btn-large" value="Forfeit Round!" id="forfeitRound" onclick="forfeit()">';
			insertString = "<div id='contentWrapper' ><ul>";
			console.log("receiving information");
			for (var i = 0; i < response.Title.length; i++) {
				if (response.Bio[i] != null) {
					if ((response.Bio[i].length) >= 1000) {
						response.Bio[i] = response.Bio[i].substring(0, 1000) + "...";
					}
				}
				insertString += "<li class='list characters' id = 'char" + i + "' onclick=selectButton('charSelected'," + i + ")>";
				insertString += "<div class='nameInTitle' id='nameInTitle" + i + "'>";
				insertString += "<p><span class='bold'>" + data.Name[i] + "</span> played by " + data.Actor[i] + " in " + data.Title[i] + ".</p></div>";

				if (response.Image[i] != 'null' && response.Image[i] != undefined) {
					insertString += "<img class='image' id= 'img" + i + "' src='" + response.Image[i] + "'>";
				}
			}
			insertString += '</ul></div>';
			document.getElementById("wrapper").innerHTML =  "<div id='scrollWrapper'class='bottomBump'>"+insertString+"</div>";
			var increment = people;
			//incrementing through array of classnames loaded
			try {
				$('.image').load(function() {
					/*increment--;
					var w = $(this).width();
					var h = $(this).height();
					if (w >= h) {*/
						document.getElementsByClassName("image")[increment].style.width = "273px";
//					} else if (w <= h) {
		//				document.getElementsByClassName("image")[increment].style.height = "200px";
	//				}
				});
			} catch(e) {
				console.log(e);
			}
		
}

function dataPopulate(people){
		$.ajax({
		url : "../gather.php?difficulty=" + people + "&jsoncallback=?",
		dataType : 'jsonp',
		async : false,
		success : function(response) {
			data = response;}
			});
}
function waiting(){
	var insertString = '<div id="waitingForInfo"><h2>We\'re waiting for information. </h2></div><div class="loading"><div class="spinner"><div class="mask"><div class="maskedCircle"></div></div></div></div>';
return insertString;	
	
	
}
function mainMenu(){
	var menuText = "";
					$.ajax({
					url : "../getJSON.php?json=textJSON.txt&jsoncallback=?",
					dataType : 'jsonp',
					async : false,
					success : function(response) {
						localText = response;
						menuText += "<div id='wrapper'><ul id='menuItems'>";
						
						for (var i = 0; i < localText.GameModes.length; i++) {
							menuText += "<li class='bottomBump'><div class = 'gameModes' id='" + localText.GameModes[i].id + "'>";
							menuText += "<div class = 'gameTitle'><h2>" + localText.GameModes[i].Title + "</h2></div>"
							menuText += "<div class = 'gameDescription'><p>" + localText.GameModes[i].Description + "</p></div>";
			//				menuText += "<input type='button' class = 'btn btn-mini gameButtons' id='" + localText.GameModes[i].id + "button'onclick='setGameMode(\"" + localText.GameModes[i].id + "\")' value='"+localText.GameModes[i].ButtonText+"'>";
							menuText += "<input type='button' class = 'btn btn-small gameButtons topBump' id='" + localText.GameModes[i].id + "button'onclick='setGameMode(\"" + localText.GameModes[i].id + "\")' value='Start Game'>";
			
							menuText += "</div>"
						}
						menuText += "</ul></div>";
						menuFirstIn = menuText;
						outOfTime = "<div id='contentWrapper'><div id='timeFinished'>" + localText.InputText[0].outOfTimeText + "</div></div>";
						endScreen = "<div id='done'>" + localText.InputText[0].endScreenText + "</div>";
					
						}
						
						});
							return menuText;
	
}


function pointsMin(JSONinfo){
		var points = [];
	var name = [];
	var participants = JSONinfo;
	console.log(participants);
	for (var key in JSONinfo) {
		//    console.log("Key: " + key);
		name.push(key);
		points.push(JSONinfo[key][0]);

		//   console.log("Value: " + JSONinfo[key][0]);
	}

	
	bubble_srt(points, name);
	console.log(name);
	console.log(points);
	console.log(name[name.length-1]);
}


function jsonOrganiser(JSONinfo){
	var points = {}
	var usefulBit = JSONinfo;		
	for (var key in usefulBit) {
		    console.log("Key: " + key);
		points[key]=[0,0];
		//   console.log("Value: " + JSONinfo[key][0]);
	}
	console.log(JSON.stringify(points));
}



