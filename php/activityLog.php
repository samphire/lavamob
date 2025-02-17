<?php

include ("session.inc");

$userid = $_POST['userid'];
$activityType = $_POST['activityType'];
$extra = $_POST['extraInfo'] ?? 0;

$sql = "INSERT INTO `reader3`.`activity_log` (`userid`, `activity_type`, `extra_info`) VALUES($userid, $activityType, IFNULL('$extra', NULL)) "
    . "ON DUPLICATE KEY UPDATE `extra_info` = `extra_info` + " . $_POST['extraInfo'];

$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
if(mysqli_affected_rows($conn) > 0){
    echo "success";
} else {
    echo "fail";
}
