<?php
include("session.inc");
header('Access-Control-Allow-Methods: INSERT');
$userid = $_GET['userid'];
$textid = $_GET['textid'];

// Fetch the JSON array from text table
$sql = "SELECT `uniqueInfoArray` FROM `text` WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $textid);
$stmt->execute();
$stmt->bind_result($json);
$stmt->fetch();
$stmt->close();

// Decode JSON
$words = json_decode($json, true);

// Prepare insert statement once
$sql = "INSERT INTO learned (userid, headwordid) VALUES (?, ?)";
$insertStmt = $conn->prepare($sql);

foreach ($words as $item) {
    $wordParts = explode("^/", $item);

    // Ensure index exists before accessing
    if (isset($wordParts[2])) {
        $headwordid = (int)$wordParts[2];
        $insertStmt->bind_param("ii", $userid, $headwordid);
        $insertStmt->execute();
    }
}

$insertStmt->close();