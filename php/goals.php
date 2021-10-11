<?php
include ("session.inc");

$userid = $_GET['userid'];
$learned = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
//echo $learned ."<br>";
$learning = mysqli_query($conn, "SELECT COUNT(repnum) AS learning FROM learninglist WHERE userid=$userid")->fetch_object()->learning;
//echo $learning ."<br>";
$avgRepnum = mysqli_query($conn, "SELECT AVG(repnum) AS avgRepnum FROM learninglist WHERE userid=$userid")->fetch_object()->avgRepnum;
//echo $avgRepnum ."<br>";
$sql = "SELECT * FROM goals where userid=$userid";
//echo $sql;
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

while($row = mysqli_fetch_assoc($query)){
    $row['learned'] = $learned;
    $row['learning'] = $learning;
    $row['avgRepnum'] = $avgRepnum;
    array_push($goals, $row);
}

echo json_encode($goals);
