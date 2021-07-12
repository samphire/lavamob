<?php
error_reporting(1);
date_default_timezone_set('Asia/Seoul');
global $conn;
$userid = $_GET['userid'];
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
mysqli_query($conn, "SET NAMES utf8");
mysqli_query($conn, "SET CHARACTER SET utf8");

$sql = "SELECT userid, textid, word, tranny, repnum, headwordid, headword, EF, datenext, wordid FROM learninglist WHERE userid=".$userid;
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$LL = array();
header('Access-Control-Allow-Origin: *');
while($row = mysqli_fetch_assoc($result)){
    array_push($LL, $row);
}
$bob = json_encode($LL);
echo "{\"list\":" . $bob.  "}";
