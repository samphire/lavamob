<?php
error_reporting(1);
date_default_timezone_set('Asia/Seoul');
global $conn;
$userid = $_GET['userid'];
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
$actual = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
$sql = "SELECT * FROM goals where userid=$userid";
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

while($row = mysqli_fetch_assoc($query)){
    $row['actual'] = $actual;
    array_push($goals, $row);
}
header('Access-Control-Allow-Origin: *');
echo json_encode($goals);