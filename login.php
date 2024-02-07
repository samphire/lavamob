<?php
global $conn;
header('Access-Control-Allow-Origin: *');
$conn = mysqli_connect("localhost", "root", "Fk!i=a0@:K", "reader3") or die('Error connecting to mysql for conn');
$conn2 = mysqli_connect("localhost", "root", "Fk!i=a0@:K", "optikon") or die('Error connecting to mysql for conn2');
mysqli_query($conn, "SET NAMES utf8");
mysqli_query($conn, "SET CHARACTER SET utf8");
mysqli_query($conn2, "SET NAMES utf8");
mysqli_query($conn2, "SET CHARACTER SET utf8");
//$sql = "SELECT user_id FROM users WHERE user_email='".$_GET['user_email']."' AND pass_word=md5('".$_GET['pass_word']."')";
$sql = "SELECT user_id, user_name, group_name FROM `groups` join
(SELECT user_id, user_name, groups_group_id as `group_id` FROM users JOIN users_has_groups
ON users.user_id = users_has_groups.users_user_id
WHERE users.user_email='{$_GET['user_email']}' AND users.pass_word=md5('{$_GET['pass_word']}')) as bob
ON `groups`.group_id = bob.group_id;";
$query = mysqli_query($conn, $sql) or die("cannot log in from php. something error");
$numrows = mysqli_num_rows($query);


if ($numrows < 1 ) {
    echo "sql has failed. maybe has no group. Here is the sql \n$sql";
    exit("fail login");
}
list($userid, $username, $group) = mysqli_fetch_row($query);

$sql = "SELECT language_id FROM tbl_students where id='{$_GET['user_email']}'";
$languageid = mysqli_query($conn2, $sql)->fetch_object()->language_id;
$arr = array();
array_push($arr, $userid);
array_push($arr, $languageid);
array_push($arr, $group);
array_push($arr, $username);
echo json_encode($arr);
