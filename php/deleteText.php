<?php
include("session.inc");
header('Access-Control-Allow-Methods: DELETE');
$userid = $_GET['userid'];
$textid = $_GET['textid'];
$isAddToLearned = $_GET['isAddToLearned'];

$isAddToLearned = filter_var($isAddToLearned, FILTER_VALIDATE_BOOLEAN);

if ($isAddToLearned) {
    $sql = "SELECT `uniqueInfoArray` FROM `text` WHERE id={$textid}";
    $result = mysqli_query($conn, $sql) or die("query problem in deleteText.php\n\n{$sql}\n\n");
    $words = json_decode(mysqli_fetch_row($result)[0]);

    foreach ($words as $item) {
        $word = explode("^/", $item);
        $headwordid = $word[2];
        $sql = "INSERT IGNORE INTO learned (userid, headwordid) VALUES ({$userid}, {$headwordid})";
        mysqli_query($conn, $sql);
//        echo(mysqli_error($conn));
    }
}

$sql = "DELETE from usertext where userid={$userid} and textid={$textid}";
mysqli_query($conn, $sql) or die("problem with usertext delete query: \n$sql");

// So... texts are never deleted. From time to time, we should have a cron job to remove (archive?) items from text where there are no current users.
