<?php

include("session.inc");

$sql = "DELETE FROM `learninglist` WHERE `wordid`={$_POST['wordid']} AND `userid`={$_POST['userid']}";
$result = mysqli_query($conn, $sql) or die("problem with LL delete query: \n$sql");
$affected = mysqli_affected_rows($conn);
if($affected > 0){
    echo "success";
}else{
    echo "no rows were affected";
}
