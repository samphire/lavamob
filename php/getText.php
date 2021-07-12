<?php
error_reporting(1);


header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
	header('Pragma: no-cache'); // HTTP 1.0.
	header('Expires: 0'); // Proxies.


date_default_timezone_set('Asia/Seoul');
global $conn;
$textid = $_GET['textid'];
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
mysqli_query($conn, "SET NAMES utf8");
mysqli_query($conn, "SET CHARACTER SET utf8");


$sql = " SELECT SQL_NO_CACHE * FROM text WHERE id=".$textid;
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$text = array();
header('Access-Control-Allow-Origin: *');
while($row = mysqli_fetch_assoc($result)){
    array_push($text, $row);
}
$bob = json_encode($text[0], JSON_NUMERIC_CHECK | JSON_FORCE_OBJECT);
if($bob){
echo $bob;
} else{
echo json_last_error_msg();
}
