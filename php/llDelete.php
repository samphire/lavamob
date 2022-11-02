<?php

include("session.inc");

$sql = "DELETE FROM `learninglist` WHERE `wordid`={$_POST['wordid']} AND `userid`={$_POST['userid']}";
$result = mysqli_query($conn, $sql) or die("problem with LL delete query: \n$sql");
echo mysqli_affected_rows($conn) . " deleted for user ${$_POST['userid']}";