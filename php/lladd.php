<?php

include ("session.inc");

$textid = $_POST['textid'];
$userid = $_POST['userid'];
$word = $_POST['word'];
$wordid = $_POST['wordid'];
$headwordid = $_POST['headwordid'];
$headword = $_POST['headword'];
$tranny = $_POST['tranny'];

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
        2,
        0);";
$result = mysqli_query($conn, $sql) or die("problem with sql query: \n$sql");

echo "done";



