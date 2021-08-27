<?php
error_reporting(1);

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
date_default_timezone_set('Asia/Seoul');
global $conn;
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
mysqli_query($conn, "SET NAMES utf8");
mysqli_query($conn, "SET CHARACTER SET utf8");