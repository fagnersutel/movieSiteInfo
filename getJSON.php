<?php
header('Content-type: application/json');
//header('Access-Control-Allow-Origin: *');

//echo($JSONtext);
$JSONFetch = "textJSON.txt";

if (isset($_GET['json'])) {
	$JSONFetch = $_GET['json'];
}

print $_GET['jsoncallback'] . '(' . file_get_contents($JSONFetch) . ')';
?>