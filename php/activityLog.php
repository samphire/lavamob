<?php

include ("session.inc");

$userid = (int)$_POST['userid'];
$activityType = (int)$_POST['activityType'];
$extra = $_POST['extraInfo'] ?? 0;

$sql = "INSERT INTO `reader3`.`activity_log` (`userid`, `activity_type`, `extra_info`) VALUES (?, ?, ?) "
    . "ON DUPLICATE KEY UPDATE `extra_info` = `extra_info` + ?";

$conn->execute_query($sql, [$userid, $activityType, $extra, $extra]) or die("problem with activity log query");
if($conn->affected_rows > 0){
    echo "success";
} else {
    echo "fail";
}
