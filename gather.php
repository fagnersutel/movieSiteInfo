<?php
header('Content-type: application/json');
//header('Access-Control-Allow-Origin: *');
$JSONtext = JSON_decode(file_get_contents("formattedJSON.txt"), true);
//echo($JSONtext);
$returnArr = array();
$newJSON = array("Image" => array(), "Name" => array(), "Actor" => array(), "Title" => array(), "Bio" => array());
$maxNum = 10;
$JSON = "";

if (isset($_GET['difficulty'])) {
	$maxNum = $_GET['difficulty'];
}

for ($i = 0; $i < $maxNum; $i++) {
	array_push($returnArr, $JSONtext[floor(rand(0, sizeof($JSONtext)-1))]);
}


foreach ($returnArr as $key => $lulz) {
	$arrayMax = sizeof($lulz['Actor']) - 1;
	$randMax = floor(rand(0, $arrayMax));
	$imageVar = "";
	array_push($newJSON["Actor"], $lulz['Actor'][$randMax]);
	array_push($newJSON["Name"], $lulz['Name'][$randMax]);
	array_push($newJSON["Title"], $lulz['Title'][$randMax]);
	array_push($newJSON["Image"], $lulz['ImageURL'][$randMax]);
	array_push($newJSON["Bio"], $lulz['Bio'][$randMax]);
	test();
}
function test(){
	for($i = 0; $i < sizeof($newJSON); $i++){
		$testActor = $newJSON[$i]["Actor"];
		$testName = $newJSON[$i]["Name"];
		for($z = 0; $z < sizeof($newJSON); $z++){
			if($testActor == $newJSON[$z]["Actor"] && $testName == $newJSON[$i]["Name"]){
				replace($i);
			}
		}
	}
}

function replace($i){
	$newNum = floor(rand(0, sizeof($JSONtext)-1));
	$newChar = floor(rand(0,sizeof($newJSON[$newNum])-1));
	// $JSONtext[$newNum]["ImageURL"][$newChar];
	$newJSON[$i]["Actor"] = $JSONtext[$newNum]['Actor'][$newChar];
	$newJSON[$i]["Name"] = $JSONtext[$newNum]['Name'][$newChar];
	$newJSON[$i]["Bio"] = $JSONtext[$newNum]['Bio'][$newChar];
	$newJSON[$i]["Title"] = $JSONtext[$newNum]['Title'][$newChar];
	$newJSON[$i]["ImageURL"] = $JSONtext[$newNum]['ImageURL'][$newChar];
	test();
}

print $_GET['jsoncallback'] . '(' . JSON_encode($newJSON) . ')';
?>