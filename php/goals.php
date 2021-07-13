<?php

$actual = mysqli_query($conn, "SELECT COUNT(headwordid) AS numLearned FROM learned WHERE userid=$userid")->fetch_object()->numLearned;
$sql = "SELECT * FROM goals where userid=$userid";
$query = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");
$goals = array();

while($row = mysqli_fetch_assoc($query)){
    $row['actual'] = $actual;
    array_push($goals, $row);
}

echo json_encode($goals);