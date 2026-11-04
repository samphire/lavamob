<?php

include("session.inc");

$wordid = (int)$_POST['wordid'];
$userid = (int)$_POST['userid'];

$sql = "DELETE FROM `learninglist` WHERE `wordid` = ? AND `userid` = ?";
$conn->execute_query($sql, [$wordid, $userid]) or die("problem with LL delete query");
$affected = $conn->affected_rows;
if($affected > 0){
    echo "successfully deleted " . $wordid;
}else{
    echo "no rows were affected";
}
