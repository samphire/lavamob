<?php
include("session.inc");

$userid = $_GET['userid'];

$learned = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
$learning = mysqli_query($conn, "SELECT COUNT(repnum) AS learning FROM learninglist WHERE userid=$userid")->fetch_object()->learning;
$avgRepnum = mysqli_query($conn, "SELECT AVG(repnum) AS avgRepnum FROM learninglist WHERE userid=$userid")->fetch_object()->avgRepnum;
/* last 7 days */ $learned7 = mysqli_query($conn, "SELECT count(`userid`) AS learned7 FROM `learned` where `userid`=$userid and unix_timestamp(`dateAdded`) > (unix_timestamp(now()) - 86400 * 7)")->fetch_object()->learned7;
/* last 30 days */ $learned30 = mysqli_query($conn, "SELECT count(userid) AS learned30 FROM reader3.learned where userid=$userid and unix_timestamp(dateAdded) between (unix_timestamp(now()) - 86400 * 30) and unix_timestamp(now()) - 86400 * 8")->fetch_object()->learned30;
/* last 90 days */ $learned90 = mysqli_query($conn, "SELECT count(userid) AS learned90 FROM reader3.learned where userid=$userid and unix_timestamp(dateAdded) between (unix_timestamp(now()) - 86400 * 90) and unix_timestamp(now()) - 86400 * 31")->fetch_object()->learned90;
$sql2 = "SELECT voca_out_of_datedness, wordscore, lSize, llSize, round(top1k_perc/10, 0) as 1k, round(top2k_perc/10,0) as 2k, round(top3k_perc/10, 0) as 3k FROM chron_data where userid=$userid order by date desc limit 1";
$result = $conn->query($sql2);

$mud = $result->fetch_assoc();
list($voca_out_of_datedness, $wordscore, $lSize, $llSize, $_1k, $_2k, $_3k) = array_values($mud);

$sql = "SELECT * FROM goals where userid=$userid";
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

if (mysqli_affected_rows($conn)) {
    while ($row = mysqli_fetch_assoc($query)) { // I already have returned data, below I am adding my own custom fields to the result set
        $row['learned'] = $learned;
        $row['learning'] = $learning;
        $row['avgRepnum'] = $avgRepnum;
        $row['learned7'] = $learned7;
        $row['learned30'] = $learned30;
        $row['learned90'] = $learned90;
        $row['voca_out_of_datedness'] = $voca_out_of_datedness;
        $row['wordscore'] = $wordscore;
        $row['lSize'] = $lSize;
        $row['llSize'] = $llSize;
        $row['_1k'] = $_1k;
        $row['_2k'] = $_2k;
        $row['_3k'] = $_3k;
        array_push($goals, $row);
    }
} else { // There is no row returned from the query, so I am creating all of the fields from scratch below, with null and zero values
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
    $row['voca_out_of_datedness'] = $voca_out_of_datedness;
    $row['wordscore'] = $wordscore;
    $row['lSize'] = $lSize;
    $row['llSize'] = $llSize;
    $row['_1k'] = $_1k;
    $row['_2k'] = $_2k;
    $row['_3k'] = $_3k;
    array_push($goals, $row);
}

echo json_encode($goals);
