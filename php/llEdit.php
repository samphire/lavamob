<?php

include ("session.inc");

// $repnum = $_POST['repnum'];
// $ef = $_POST['ef'];
// $streak = $_POST['streak'];
// $lastIntervalDays = $_POST['lastIntervalDays'];
// $lapses = $_POST['lapses'];


// Build the prepared statement with placeholders
$sql = "UPDATE `learninglist`
        SET `repnum` = ?, `EF` = ?, `datenext` = ?, `streak` = ?, `lastIntervalDays` = ?, `lapses` = ?
        WHERE `wordid` = ? AND `userid` = ?";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    die("Prepare failed: " . mysqli_error($conn));
}

// Bind parameters: repnum (int), EF (float), datenext (string), streak (int), lastIntervalDays (int), lapses (int), wordid, (int), userid (int)
mysqli_stmt_bind_param(
    $stmt,
    "idsiiiii",  // i = integer, d = double, s = string
    $_POST['repnum'],
    $_POST['ef'],
    $_POST['datenext'], // e.g. "2025-09-13 10:30:00"
    $_POST['streak'],
    $_POST['lastIntervalDays'],
    $_POST['lapses'],
    $_POST['wordid'],
    $_POST['userid']
);

// Execute
if (!mysqli_stmt_execute($stmt)) {
    die("Execute failed: " . mysqli_stmt_error($stmt));
}

// Optionally check affected rows
if (mysqli_stmt_affected_rows($stmt) > 0) {
echo "success";
    // success
} else {
echo "no rows updated";
    // no rows updated (maybe wrong userid/wordid)
}

mysqli_stmt_close($stmt);