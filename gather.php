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
	array_push($returnArr, $JSONtext[floor(rand(0, sizeof($JSONtext) - 1))]);
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
}

test();

function test() {
	global $newJSON;
	for ($i = 0; $i < sizeof($newJSON['Actor']); $i++) {
		$testActor = $newJSON["Actor"][$i];
		$testName = $newJSON["Name"][$i];
			
		for ($z = 0; $z < sizeof($newJSON['Actor']); $z++) {
			if($z!=$i){
				if ($testActor == $newJSON["Actor"][$z] && $testName == $newJSON["Name"][$z]) {
					replace($i);
				}
			}
		}
	}
}

function replace($i) {
	global $JSONtext;
	global $newJSON;
	$newNum = floor(rand(0, sizeof($JSONtext) - 1));
	$newChar = floor(rand(0, sizeof($JSONtext[$newNum]['Actor']) - 1));
	$newJSON["Actor"][$i] = $JSONtext[$newNum]['Actor'][$newChar];
	$newJSON["Name"][$i] = $JSONtext[$newNum]['Name'][$newChar];
	$newJSON["Bio"][$i] = $JSONtext[$newNum]['Bio'][$newChar];
	$newJSON["Title"][$i] = $JSONtext[$newNum]['Title'][$newChar];
	$newJSON["Image"][$i] = $JSONtext[$newNum]['ImageURL'][$newChar];
}

if (isset($_GET['jsoncallback'])) {
	print $_GET['jsoncallback'] . '(' . JSON_encode($newJSON) . ')';
} else {
	print JSON_encode($newJSON);
}
?>