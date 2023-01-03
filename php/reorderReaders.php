<?php
include("session.inc");

$data = json_decode(file_get_contents('php://input'), true);

foreach ($data as $item) {
    $sql = "update `reader3`.`usertext` set `pos`={$item['order']} where `userid`={$item['userid']} and `textid`={$item['textid']}";
    print "\n\n sql is " . $sql;
    mysqli_query($conn, $sql);
}