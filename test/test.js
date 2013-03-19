document.getElementById("thing").innerHTML = 'Game Finished, congratulations!<div id="winners"></div><input type="button" value="Re-start Game!" onclick="reset(gapi.hangout.getLocalParticipantId())">';

var JSONarr = {"TestThing":[2,0],"TestTwo":[1,0],"TestThree":[0,0],"TestThem":[2,0]} ;
var removes = ["guessedBy","myId","GameMode","charID","actorsChosen"];
//pointsSorter(JSONarr);
jsonOrganiser(JSONarr);

function jsonOrganiser(JSONinfo){
	console.log(removes);
	var points = new Array();
	var usefulBit = JSONinfo;		
	for (var key in usefulBit) {
		//    console.log("Key: " + key);
		points[key]=[0,0];
		//   console.log("Value: " + JSONinfo[key][0]);
	}
	console.log(JSON.stringify(points));
}



function pointsSorter(JSONinfo){
	var domString = "";
	var points = [];
	var name = [];
	for (var key in JSONinfo) {
//    console.log("Key: " + key);
    name.push(key);
    points.push(JSONinfo[key][0]);

    
 //   console.log("Value: " + JSONinfo[key][0]);
}
bubble_srt(points,name);    
    console.log(points);
    console.log(name);
    domString+="<ul>";
    for(var i = 0; i < points.length; i++){
    	domString+="<li><div class='player'>"+name[i]+"</div><div class='points'>"+points[i]+"</div>";
    }
    domString +="</ul>";
    document.getElementById("winners").innerHTML = domString;
}
   function bubble_srt(a,b) {
        //basic bubble sort sorting the 'a' array and shuffling around
        //the b array to match the a array.
        var n = a.length;
        var i;
        var j;
        var t = 0;
        var r = "";
        for (i = 0; i < n; i++) {
            for (j = 1; j < (n - i); j++) {
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




//console.log(JSON.stringify(JSONinfo));
//console.log(thing);
	

