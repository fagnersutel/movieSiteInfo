<?php

$JSONtext = JSON_decode(file_get_contents("json_top_films.txt"));
//echo($JSONtext);
$returnArr = array();
$maxNum = 10;

if (isset($_POST['difficulty'])) {
	echo("LOL");
	$maxNum = $_POST['difficulty'];
}

for($i = 0; $i < $maxNum; $i++){
	array_push($returnArr,$JSONtext[floor(rand(0,99))]);
}

echo("<div id='wrapper'>");
foreach($returnArr as $key=>$lulz){
	$arrayMax = sizeof($lulz->Characters[0]->Actor)-1;
	$randMax = floor(rand(0,$arrayMax));
	echo("<div class='charId' id='char".$key."'>".$lulz->Characters[0]->Actor[$randMax]." as ".$lulz->Characters[0]->Name[$randMax]." in ".$lulz->Title.".</div>");

	if($lulz->Characters[0]->ImageURL[$randMax] != "null"){
	echo("<img class='charImage' id = 'img".$key."'src ='".$lulz->Characters[0]->ImageURL[$randMax]."'>");	
	}
	echo("<div class='bio' id='bio".$key."'>".$lulz->Characters[0]->Bio[$randMax]."</div>");

}
echo("</div>");

?>