<?php

include ("session.inc");

$userid = $_POST['userid'];
$textid = $_POST['textid'];
$word = $_POST['word'];
$wordid = $_POST['wordid'];
$headwordid = $_POST['headwordid'];
$headword = $_POST['headword'];
$tranny = $_POST['tranny'];

// Build the prepared statement with placeholders
$sql = "INSERT INTO `reader3`.`learninglist`
        (`userid`, `textid`, `word`, `wordid`, `headwordid`, `headword`, `tranny`, `datenext`, `EF`, `repnum`)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 2, 0)";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    die("Prepare failed: " . mysqli_error($conn));
}

// Bind parameters: repnum (int), EF (float), datenext (string), streak (int), lastIntervalDays (int), lapses (int), wordid, (int), userid (int)
mysqli_stmt_bind_param(
    $stmt,
    "iisiiss",  // i = integer, d = double, s = string
    $userid,
    $textid,
    $word,
    $wordid,
    $headwordid,
    $headword,
    $tranny
);

// Execute
if (!mysqli_stmt_execute($stmt)) {
    die("Execute failed: " . mysqli_stmt_error($stmt));
}

// Optionally check affected rows
if (mysqli_stmt_affected_rows($stmt) > 0) {
    echo "success";
} else {
    echo "no rows updated";
}

mysqli_stmt_close($stmt);

echo "done";



