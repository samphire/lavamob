<?php
include("session.inc");
header('Access-Control-Allow-Methods: DELETE');
$userid = (int)$_GET['userid'];
$textid = (int)$_GET['textid'];
$isAddToLearned = $_GET['isAddToLearned'];

$isAddToLearned = filter_var($isAddToLearned, FILTER_VALIDATE_BOOLEAN);

echo "isAddToLearned: " . $isAddToLearned;

if ($isAddToLearned) {
    $result = $conn->execute_query("SELECT `uniqueInfoArray` FROM `text` WHERE id = ?", [$textid])
        or die("query problem in deleteText.php");
    $words = json_decode(mysqli_fetch_row($result)[0]);
    print("\n\n");
    print_r(sizeof($words));

    $stmt = $conn->prepare("INSERT INTO learned (userid, headwordid) VALUES (?, ?)");
    foreach ($words as $item) {
        print_r($item);
        $word = explode("^/", $item);
        $headwordid = (int)$word[2];
        $stmt->bind_param("ii", $userid, $headwordid);
        $stmt->execute();
        print("\n");
        echo($stmt->error);
    }
    $stmt->close();
}

$conn->execute_query("DELETE FROM usertext WHERE userid = ? AND textid = ?", [$userid, $textid])
    or die("problem with usertext delete query");

// So... texts are never deleted. From time to time, we should have a cron job to remove (archive?) items from text where there are no current users.
