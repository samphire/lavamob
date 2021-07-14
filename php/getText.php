<?php
include ("session.inc");
$textid = $_GET['textid'];

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
