<?php

include ("session.inc");

$userid = $_POST['userid'];
$activityType = $_POST['activityType'];

$sql = "INSERT INTO `reader3`.`activity_log` (`userid`, `activity_type`) VALUES($userid, $activityType)";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");

if(mysqli_affected_rows($conn) > 0){
    echo "success";
} else {
    echo "fail";
}
