<?php
error_reporting(1);

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.

if(isset($_SERVER['HTTP_ORIGIN'])){
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

date_default_timezone_set('Asia/Seoul');
global $conn;
$conn = mysqli_connect("localhost", "samphire", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql');
$conn->set_charset("utf8");
