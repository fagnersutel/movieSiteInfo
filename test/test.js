var JSONarr = {"Person 1":[1,1],"Person 2":[2,1]}  ;
var removes = ["guessedBy","myId","GameMode","charID","actorsChosen"];
var textTemplating = "";
var people = 5;
var points = 10;
var timeForRound = "01:30";
var data;
var testData = {"Image":["http://ia.media-imdb.com/images/M/MV5BMTk1MDY1NjE4OF5BMl5BanBnXkFtZTcwMzEyMzE0NA@@._V1._SX640_SY899_.jpg","http://ia.media-imdb.com/images/M/MV5BMTMxMTIwMzAyM15BMl5BanBnXkFtZTYwNTQwNzc3._V1._SX450_SY304_.jpg","http://ia.media-imdb.com/images/M/MV5BMTUwNzkyODA0N15BMl5BanBnXkFtZTYwODc0Mzk2._V1._SX400_SY267_.jpg","http://ia.media-imdb.com/images/M/MV5BNjUyODI5MzQyOV5BMl5BanBnXkFtZTcwNTgwMzMzMw@@._V1._SX640_SY951_.jpg","http://ia.media-imdb.com/images/M/MV5BMTM2MjIzNjE5N15BMl5BanBnXkFtZTYwMDUwMzI2._V1._SX420_SY335_.jpg"],"Name":["David 'Noodles' Aaronson","Leonard Shelby","Carolyn Burnham","WALLE\n / \nM-O\n\n (voice)","Rocco Lampone"],"Actor":["Robert De Niro","Guy Pearce","Annette Bening","Ben Burtt","Tom Rosqui"],"Title":["Once Upon a Time in America","Memento","American Beauty","WALLE","The Godfather: Part II"],"Bio":["David Aaronson is a fictional Jewish gangster featured as the protagonist of the book The Hoods by Harry Grey, and later in the book's film adaptation, Once Upon A Time In America.David Aaronson was born in the early 1900s presumably either 1905 or 1907. He was born into poverty and squalor in a Jewish enclave in Brooklyn, New York City.David Aaronson later formed a gang with his friends Phillip \"Cock Eye\" Stein, Patrick \"Patsy\" Goldberg and a young boy named Dominic. Together they rolled drunks in a bar run by a local mobster named Bugsy that they worked for and helped in maintaining his protection racket.In 1921 David \"Noodles\" Aaronson and his gang were about to roll a drunk when Maximillian \"Max\" Bercovicz takes their chance by helping the drunk onto the back of his carridge and pretending to know him. Noodles later came across Max as he was moving into his new house. Max and Noodles size each other up and Max flaunts the pocket watch he stole from the drunk which Noodles then stea...","Leonard Shelby is a man with anterograde amnesia which renders his brain unable to store new memories. He takes photos to reach his aim which is killing his wife murderer .","Carolyn Burnham Wife of Lester, and real-estate agent. Sees her acquaintance Buddy Kane at a party, and wants to get closer with him. Catches her husband masturbating in bed with her, and they have a heated discussion about their dysfunctional relationship. Goes to lunch with Buddy, then to a motel to have sex with him. At home that night she gets into an argument with Lester at the dinner table, then goes to apologize to her daughter, but gets frustrated with her and slaps her in the face. Goes to a shooting range, then drives home to argue with Lester about a new car that he bought. He comes on to her but she finds another reason to yell at him. Her husband Lester, while working at a fast-food drive-thru, sees her kissing Buddy while driving through the fast-food place. Drives away to drop buddy off, then cries and screams in guilt. Begins rationalizing with herself, and grabs the gun from her glove compartment and proceeds to drive home and confront her husband. Before she enters th...","WALLE (short for Waste Allocation Lift Loader, Earth-Class) is the only robot of his kind left on Earth after a botched attempt at trying to clean the trash-covered planet. The WALLE units were left behind to clean the planet while humanity enjoyed a 5-year cruise. Before the last of the humans left Earth for good, claiming operation Cleanup wasn't working, they forgot to turn WALLE off. The 5-year cruise became a 700-year cruise with humans content to remain in space, waited on hand and foot by an army of robots care of the Buy N Large corporation. After 700 years of continuing his directive, i.e. cleaning the planet, WALL\"E developed one little glitch: a personality. He is extremely curious, friendly to his pet cockroach, Hal, and even a little bit lonely.He was played by Ben Burtt (original movie) and Later Dane A. Davis (for prequel and sequel).During the events of WALLE (2008), this robot meets a beautiful young probe named EVE. WALLE immediately falls in love with her and de...","Peter Clemenza (1890 - 1958) is a fictional character appearing in Mario Puzo's novel The Godfather and two of the three films based on it.In his young adulthood, in The Godfather Part II, Clemenza is portrayed by Bruno Kirby. In his later years, he is portrayed by Richard S. Castellano.Peter Clemenza is one of two (later three) caporegimes in the Corleone Family (the other being Salvatore Tessio). He rules over the family's territory in The Bronx. Although he is less intelligent than his friend and counterpart Tessio, he is said to be more brutal and direct in the book. In the film, he may be perceived at first as a fat, dim witted thug, but later on he is shown to be a formidable assassin.Clemenza became a friend of Vito Corleone after immigrating from Sicily, when Corleone held a package of guns for him to prevent their discovery by the police. Although he is a native of Italy, and in The Godfather II is shown speaking perfect colloquial Italian as a young man in his 20s, in The God..."]};
var testData2 = {Thing:[1,2]};
var thing = eval(testData2);
console.log(testData["Title"].length);
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
//CHARACTER played by ACTOR in FILM
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
//actorSelect(10); //num is indicative of how many actors to pull through
//parseData(10); //brings up what other players see.
//winner(JSONarr);

parseData(testData);


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

function parseData(information) {
//	dataPopulate(num)
	var response = information;
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
		document.getElementById("SelectPlayerButton").innerHTML = '<button id="ButtonSelect" class="btn btn-small" onclick="'
			+'charSelected('+index+')">Select Me</button>';
	}
	if(method=="guessSelected"){//
		document.getElementById("SelectPlayerButton").innerHTML = '<button id="ButtonSelect" class="btn btn-small" onclick="'
			+'guessSelected('+index+')">Select Me</button>';
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



