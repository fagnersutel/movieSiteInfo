<?php
header('Content-type: application/json');
//header('Access-Control-Allow-Origin: *');
$JSONtext = JSON_decode(file_get_contents("json_top_films.txt"));
//echo($JSONtext);
$returnArr = array();
$newJSON = array("Image"=>array(),"Name"=>array(),"Actor"=>array(),"Title"=>array(), "Bio"=>array());
$maxNum = 10;
$JSON = "";
if (isset($_GET['difficulty'])) {
$maxNum = $_GET['difficulty'];
}
for ($i = 0; $i < $maxNum; $i++) {
array_push($returnArr, $JSONtext[floor(rand(0, 99))]);
}
foreach ($returnArr as $key => $lulz) {
$arrayMax = sizeof($lulz -> Characters[0] -> Actor) - 1;
$randMax = floor(rand(0, $arrayMax));
$imageVar = "";
array_push($newJSON["Actor"],$lulz -> Characters[0] -> Actor[$randMax]);
array_push($newJSON["Name"],$lulz -> Characters[0] -> Name[$randMax]);
array_push($newJSON["Title"], $lulz -> Title);
array_push($newJSON["Image"], $lulz -> Characters[0] -> ImageURL[$randMax]);
array_push($newJSON["Bio"], $lulz -> Characters[0] -> Bio[$randMax]);
}

//printf(JSON_encode($newJSON));

  print $_GET['jsoncallback']. '('.JSON_encode($newJSON).')';
//array_push($newArr, array("html" => $JSON));
//echo(JSON_encode($newArr));
?>