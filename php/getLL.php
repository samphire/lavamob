<?php
include ("session.inc");
$userid = $_GET['userid'];
// $sql = "SELECT userid, textid, word, tranny, repnum, headwordid, headword, EF, datenext, wordid FROM learninglist WHERE userid=".$userid." order by datenext";
$sql = "SELECT * FROM learninglist WHERE userid=".$userid." order by datenext";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$LL = array();
header('Access-Control-Allow-Origin: *');
while($row = mysqli_fetch_assoc($result)){
    array_push($LL, $row);
}
$bob = json_encode($LL, JSON_NUMERIC_CHECK);
echo "{\"list\":" . $bob.  "}";
