<?php
include ("session.inc");

// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);


$textid = $_GET['textid'];

$sql = " SELECT SQL_NO_CACHE * FROM text WHERE id=".$textid;
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$text = array();
header('Access-Control-Allow-Origin: *');
while($row = mysqli_fetch_assoc($result)){
    array_push($text, $row);
}
$bob = json_encode($text[0], JSON_NUMERIC_CHECK | JSON_FORCE_OBJECT);
if($bob){
    $sql = "INSERT IGNORE INTO `reader3`.`activity_log` (`userid`, `activity_type`, `extra_info`) VALUES(" . $_GET['userid'] . ", 2, $textid)";

        $result = mysqli_query($conn, $sql);
        if(mysqli_errno($conn) == 1062){
            $sql = "UPDATE `reader3`.`activity_log` SET `extra_info` = concat(concat(IFNULL(`extra_info`, ''), ','), concat(curtime(), $textid)) WHERE `userid` = " . $_GET['userid'] . " AND `activity_type` = 2 AND `date` = curdate()";
            mysqli_query($conn, $sql);
        }

    echo $bob;
} else{
    echo json_last_error_msg();
}

