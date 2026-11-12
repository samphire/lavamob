<?php

include("session.inc");

$wordid = (int)$_POST['wordid'];
$userid = (int)$_POST['userid'];
$headwordid = (int)$_POST['headwordid'];
$repnum = (int)$_POST['repnum'];

$sql = "DELETE FROM `learninglist` WHERE `wordid` = ? AND `userid` = ?";
$conn->execute_query($sql, [$wordid, $userid]) or die("problem with LL delete query");
$sql = "INSERT INTO `learned` VALUES (?, ?, ?, now(), 1, null, 0)";
$conn->execute_query($sql, [$userid, $headwordid, $repnum]) or die("problem with LL add to learned query");
$affected = $conn->affected_rows;
if($affected > 0){
    echo "success";
}else{
    echo "no rows were affected";
}
