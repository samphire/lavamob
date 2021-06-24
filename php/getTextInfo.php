<?php
error_reporting(1);
date_default_timezone_set('Asia/Seoul');
global $conn;
$userid = $_GET['userid'];
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');


$sql = "SELECT id, name, description, wordcount, rarityQuot, audio FROM text JOIN usertext ON text.id = usertext.textid WHERE usertext.userid=$userid";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$textsInfo = array();
header('Access-Control-Allow-Origin: *');
while($row = mysqli_fetch_assoc($result)){
    array_push($textsInfo, $row);
}
$bob = json_encode($textsInfo);
echo "{\"readers\":" . $bob.  "}";
