<html>
<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
$JSONRESULTS = array();
$data = file_get_contents("http://www.imdb.com/chart/top");
$topOneHundred = array();

if (file_exists("json_top_hundred")) {
	$topOneHundred = json_decode(file_get_contents("json_top_hundred"));
} else {
	$dom = new DOMDocument;
	@$dom -> loadHTML($data);
	$finder = new DomXPath($dom);
	//$nodes = $finder->query("//td");
	$nodes = $finder -> query("//a");
	$i = 1;
	foreach ($nodes as $key => $elementz) {
		if ($key > 83 && $key < 184) {
			echo($elementz -> nodeValue . "||" . "http://www.imdb.com" . $elementz -> getAttribute('href'));
			//echo("<br>");
			array_push($topOneHundred, array("Title" => $elementz -> nodeValue, "Link" => "http://www.imdb.com" . $elementz -> getAttribute('href'),"Characters" => array(array("Actor"=>array(),"Name"=>array(),"Bio"=>array(),"ImageURL"=>array()))));
		}
	}
	file_put_contents("json_top_hundred", json_encode($topOneHundred));
}
if(file_exists("json_top_films.txt") && file_exists("json_top_hundred")){
	$topOneHundredContents = json_decode(file_get_contents("json_top_hundred"));
	$topOneHundred = json_decode(file_get_contents("json_top_films.txt"));
		
}
//oneHundredWrite();
//make each thing in character an array
//echo(JSON_encode($topOneHundred));
//function oneHundredWrite(){
//errors on: the dark knight rises.				
foreach ($topOneHundred as $key=>$lulz) {
		file_put_contents("json_top_films.txt", JSON_encode($topOneHundred));
	
	print_r($key);	
	//increment this to the point where your sample quantity is finished.
	if($topOneHundred[$key]->Title == $topOneHundredContents[$key]->Title && $key > 29)
	//print_r($topOneHundred[$key]);
	if("x"=="x")
	{
$lulz->Characters[0]->Name = array();
$lulz->Characters[0]->Bio = array();
$lulz->Characters[0]->Actor = array();
$lulz->Characters[0]->ImageURL = array();
	
		$domFilm = new DOMDocument;
		@$domFilm -> loadHTML(file_get_contents($lulz -> Link));
		$finderFilm = new DomXPath($domFilm);

		$filmPic = $finderFilm -> query("//td[contains(@class, 'primary_photo')]");
		$filmActorName = $finderFilm -> query("//td[contains(@class, 'name')]");
		//$filmActorName = $filmActorName->query("//td[contains(@attribute, 'href')]");
		$filmCharacterName = $finderFilm -> query("//td[contains(@class, 'character')]");
		$filmCharacterNameLinks = $finderFilm -> query("//td[contains(@class,'character')]//a");
		foreach ($filmCharacterName as $key => $namedLinks) {
			$found = false;
			foreach ($filmCharacterNameLinks as $tests) {
				$a = $namedLinks->nodeValue;
				$b = $tests->nodeValue;
				if(strstr($a, $b)!=null){
					$found = true;
				}		
			}
			if ($found == true) {
				if($key < $filmCharacterNameLinks->length){
					echo($key);
					$charURL = 	"http://www.imdb.com".$filmCharacterNameLinks->item($key)->getAttribute('href');
					$actorName = $filmActorName->item($key)->nodeValue;
					$charName = $namedLinks->nodeValue;
					echo($charURL.":".$actorName.":".$charName);
					//echo("<br>");
					$newURL = $charURL."bio";
					$charBio = new DOMDocument;
					@$charBio -> loadHTML(file_get_contents($newURL));
					$bioFinder = new DomXPath($charBio);
					$characterBio = $bioFinder -> query("//div[@id = 'swiki.2.3.1']");
					$characterImage = $bioFinder -> query("//a[@name = 'headshot']");
					//echo($characterImage->length);
					if($characterImage -> length == 1){
						//img id="primary-img". Get src. attribute. 
						$imgURL = "http://www.imdb.com".$characterImage -> item(0) -> getAttribute('href');
						$charImage = new DOMDocument;
						@$charImage -> loadHTML(file_get_contents($imgURL));
						//echo($charImage->getElementById('primary-img'));
						$imageFinder = new DomXPath($charImage);
						$charImaged = $imageFinder -> query("//img[@id = 'primary-img']");
						//echo("|||".$charImaged->length."|||");
						$IMAGEURL = $charImaged->item(0)->getAttribute('src');
						//write code to add imageLink to array here.
						array_push($lulz->Characters[0]->ImageURL,$IMAGEURL);
						echo("pushed");
						echo("<br>");
					}
					else{
						$ImageOfPerson = null;
						array_push($lulz->Characters[0]->ImageURL,"null");
					}
					$Biography = $characterBio->item(0)->nodeValue;
					if(strlen($Biography)==4){
					$Biography == "null";	
					}
					else{
						//write to JSON here.
					}//Insert everything in to JSON here.
					//charURL is of character, actorName is actor of character, charName is character name,
					//Biography is IMDB's own biography. IMAGEURL is image of actors.
					//lulz->Title is the title of the film.	
//			array_push($topOneHundred, array("Title" => $elementz -> nodeValue, "Link" => "http://www.imdb.com" . $elementz -> getAttribute('href')));
//			file_put_contents("json_top_hundred", (json_encode($topOneHundred)));
					
				array_push($lulz->Characters[0]->Name,trim($charName));
				array_push($lulz->Characters[0]->Bio,trim($Biography));		
				array_push($lulz->Characters[0]->Actor,trim($actorName));		
				echo("pushedInfo");
				echo("<br>");
				}
			}
		//}
	}
	}
}
echo '	<script type="text/javascript">
   alert("DONE FOR NOW");
	</script>';
//}
?>


</html>