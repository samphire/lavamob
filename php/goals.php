<?php
include("session.inc");

$userid = $_GET['userid'];
//echo $userid . "<br>";

$learned = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
//echo $learned . "<br>";
$learning = mysqli_query($conn, "SELECT COUNT(repnum) AS learning FROM learninglist WHERE userid=$userid")->fetch_object()->learning;
//echo $learning . "<br>";
$avgRepnum = mysqli_query($conn, "SELECT AVG(repnum) AS avgRepnum FROM learninglist WHERE userid=$userid")->fetch_object()->avgRepnum;
//echo $avgRepnum . "<br>";
$sql = "SELECT * FROM goals where userid=$userid";
//echo $sql . "<br>";
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

if (mysqli_affected_rows($conn)) {
    while ($row = mysqli_fetch_assoc($query)) {
        $row['learned'] = $learned;
        $row['learning'] = $learning;
        $row['avgRepnum'] = $avgRepnum;
        array_push($goals, $row);
    }
} else {
    $row['id'] = 0;
    $row['userid'] = $userid;
    $row['goal_name'] = 'blank';
    $row['goal_description'] = 'blank';
    $row['start_date'] = null;
    $row['end_date'] = null;
    $row['unit_name'] = null;
    $row['unit_start_value'] = 0;
    $row['unit_target_value'] = 0;
    $row['complete'] = null;
    $row['learned'] = $learned;
    $row['learning'] = $learning;
    $row['avgRepnum'] = $avgRepnum;
    array_push($goals, $row);
}

echo json_encode($goals);
