<?php

include("session.inc");

$sql = "DELETE FROM `learninglist` WHERE `wordid`={$_POST['wordid']} AND `userid`={$_POST['userid']}";
$result = mysqli_query($conn, $sql) or die("problem with LL delete query: \n$sql");
$sql = "INSERT INTO `learned` VALUES({$_POST['userid']}, {$_POST['headwordid']}, {$_POST['repnum']}, now(), 1, null, 0)";
$result = mysqli_query($conn, $sql) or die("problem with LL add to learned query: \n$sql");
$affected = mysqli_affected_rows($conn);
if($affected > 0){
    echo "success";
}else{
    echo "no rows were affected";
}
