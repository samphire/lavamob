<?php

include ("session.inc");

$sql = "UPDATE `learninglist` SET `repnum` = {$_POST['repnum']}, `EF` = {$_POST['ef']}, `datenext` = '{$_POST['datenext']}' "
        . "WHERE `wordid`={$_POST['wordid']} AND `userid`={$_POST['userid']} ";
$result = mysqli_query($conn, $sql) or die("problem with LL update query: \n$sql");

echo "done";



