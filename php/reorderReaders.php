<?php
include("session.inc");

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("UPDATE `reader3`.`usertext` SET `pos` = ? WHERE `userid` = ? AND `textid` = ?");
foreach ($data as $item) {
    $pos = (int)$item['order'];
    $userid = (int)$item['userid'];
    $textid = (int)$item['textid'];
    $stmt->bind_param("iii", $pos, $userid, $textid);
    $stmt->execute();
}
$stmt->close();
