<?php
include ("session.inc");
$userid = $_GET['userid'];

$sql = "SELECT id, name, description, wordcount, rarityQuot, audio, groupid, groupname, pos FROM text JOIN usertext ON text.id = usertext.textid WHERE usertext.userid=$userid ORDER BY pos DESC";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$textsInfo = array();
while($row = mysqli_fetch_assoc($result)){
    array_push($textsInfo, $row);
}
$bob = json_encode($textsInfo);

echo "{\"readers\":" . $bob.  "}";
