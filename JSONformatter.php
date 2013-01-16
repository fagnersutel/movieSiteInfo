<?php
//header('Access-Control-Allow-Origin: *');
$JSONtext = JSON_decode(file_get_contents("finalJSONtest.txt"), true);
//echo($JSONtext);
$returnArr = array();
$finalArr = array();
$newJSON = array("ImageURL" => array(), "Name" => array(), "Actor" => array(), "Title" => array(), "Bio" => array());
$maxNum = 10;
$JSON = "";
	$numCheck = 0;
/*	array_push($newJSON["Actor"], $lulz['Characters'][0]['Actor'][$randMax]);
	array_push($newJSON["Name"], $lulz['Characters'][0]['Name'][$randMax]);
	array_push($newJSON["Title"], $lulz['Title']);
	array_push($newJSON["Image"], $lulz['Characters'][0]['ImageURL'][$randMax]);
	array_push($newJSON["Bio"], $lulz['Characters'][0]['Bio'][$randMax]); */

foreach ($JSONtext as $key => $records) {
	/*$arrayMax = sizeof($lulz['Characters'][0]['Actor']) - 1;
	
	array_push($newJSON["Actor"], $lulz['Characters'][0]['Actor'][$randMax]);
	array_push($newJSON["Name"], $lulz['Characters'][0]['Name'][$randMax]);
	array_push($newJSON["Title"], $lulz['Title']);
	array_push($newJSON["Image"], $lulz['Characters'][0]['ImageURL'][$randMax]);
	array_push($newJSON["Bio"], $lulz['Characters'][0]['Bio'][$randMax]);

	 */ 
	
		$titleToString = (string)$records['Title'];
		//array_push($returnArr,$titleToString, array("ImageURL" => array(), "Name" => array(), "Actor" => array(), "Bio" => array()));
		array_push($returnArr,array("Title" => array(), "ImageURL" => array(), "Name" => array(), "Actor" => array(), "Bio" => array()));
		foreach($records['Characters'][0]['Actor'] as $key => $actors){
			$actorRecord = $actors;
			$charName = $records['Characters'][0]['Name'][$key];
			$charBio = $records['Characters'][0]['Bio'][$key];
			$imageUrl = $records['Characters'][0]['ImageURL'][$key];
			
			if($actorRecord != "null" && $charName != "null" && $charBio != "null" && $imageUrl != "null"){
				array_push($returnArr[$numCheck]["ImageURL"], $imageUrl);	
				array_push($returnArr[$numCheck]["Name"], $charName);	
				array_push($returnArr[$numCheck]["Bio"], $charBio);	
				array_push($returnArr[$numCheck]["Actor"], $actors);	
				array_push($returnArr[$numCheck]["Title"], $titleToString);	
				
		}
	}
	$numCheck++;
}

foreach ($returnArr as $key => $records) {
	//echo($records[0]);
	$sizeBio = sizeof($records["Bio"]);
	$sizeImageUrl = sizeof($records["ImageURL"]);
	$sizeActor = sizeof($records["Actor"]);	
	$sizeName = sizeof($records["Name"]);
	
	if($sizeBio > 0 && $sizeActor > 0 && $sizeImageUrl > 0 && $sizeName > 0){
		//echo($key);
	array_push($finalArr,$records);
	}
}
 

echo(JSON_encode(($finalArr)));

//printf(JSON_encode($newJSON));
file_put_contents("formattedJSON.txt", (json_encode($finalArr)));
//array_push($newArr, array("html" => $JSON));
//echo(JSON_encode($finalArr));
?>