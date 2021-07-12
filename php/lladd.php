<?php
error_reporting(1);
header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header('Access-Control-Allow-Origin: *');

$textid = $_POST['textid'];
$userid = $_POST['userid'];
$word = $_POST['word'];
$wordid = $_POST['wordid'];
$headwordid = $_POST['headwordid'];
$headword = $_POST['headword'];
$tranny = $_POST['tranny'];

date_default_timezone_set('Asia/Seoul');
global $conn;
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
mysqli_query($conn, "SET NAMES utf8");
mysqli_query($conn, "SET CHARACTER SET utf8");

$sql = "INSERT INTO `reader3`.`learninglist`
        (`userid`,
        `wordid`,
        `word`,
        `headwordid`,
        `headword`,
        `tranny`,
        `textid`,
        `datenext`,
        `EF`,
        `repnum`)
        VALUES
        ({$userid},
        {$wordid},
        '{$word}',
        {$headwordid},
        '{$headword}',
        '{$tranny}',
        {$textid},'".date("Y-m-d H:i:s")."',
        2.5,
        1);";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");

echo "done";



