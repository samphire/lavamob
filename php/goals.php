<?php
include("session.inc");

$userid = $_GET['userid'];

$learned = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
$learning = mysqli_query($conn, "SELECT COUNT(repnum) AS learning FROM learninglist WHERE userid=$userid")->fetch_object()->learning;
$avgRepnum = mysqli_query($conn, "SELECT AVG(repnum) AS avgRepnum FROM learninglist WHERE userid=$userid")->fetch_object()->avgRepnum;
/* last 7 days */ $learned7 = mysqli_query($conn, "SELECT count(`userid`) AS learned7 FROM `learned` where `userid`=$userid and unix_timestamp(`dateAdded`) > (unix_timestamp(now()) - 86400 * 7)")->fetch_object()->learned7;
/* last 30 days */ $learned30 = mysqli_query($conn, "SELECT count(userid) AS learned30 FROM reader3.learned where userid=$userid and unix_timestamp(dateAdded) between (unix_timestamp(now()) - 86400 * 30) and unix_timestamp(now()) - 86400 * 8")->fetch_object()->learned30;
/* last 90 days */ $learned90 = mysqli_query($conn, "SELECT count(userid) AS learned90 FROM reader3.learned where userid=$userid and unix_timestamp(dateAdded) between (unix_timestamp(now()) - 86400 * 90) and unix_timestamp(now()) - 86400 * 31")->fetch_object()->learned90;
$sql = "SELECT * FROM goals where userid=$userid";
//echo $sql . "<br>";
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

if (mysqli_affected_rows($conn)) {
    while ($row = mysqli_fetch_assoc($query)) {
        $row['learned'] = $learned;
        $row['learning'] = $learning;
        $row['avgRepnum'] = $avgRepnum;
        $row['learned7'] = $learned7;
        $row['learned30'] = $learned30;
        $row['learned90'] = $learned90;
        $row['bobby'] = $bobby;
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
    $row['learned7'] = $learned7;
    $row['learned30'] = $learned30;
    $row['learned90'] = $learned90;
    array_push($goals, $row);
}

echo json_encode($goals);
