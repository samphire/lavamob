<?php
include("session.inc");

$data = json_decode(file_get_contents('php://input'), true);
print_r($data);

$percs = array(0, 0, 0, 0, 0, 0, 0, 0);
$uniqueInfoArray = array();

foreach ($data['uniqueWordArray'] as $word) {
    $sql = "SELECT words.id, headwords.id, headword, frequency 
            FROM words JOIN headwords
            ON words.headword_id=headwords.id
            WHERE word='{$word}'";

    try {
        $row = mysqli_fetch_row(mysqli_query($conn, $sql));
        $uniqueInfoArray[] = $word . "^/" . $row[0] . "^/" . $row[1] . "^/" . $row[2] . "^/" . $row[3];
        if ($row[3] < 7) {
            $percs[$row[3] - 1]++;
            $percs[7] += $row[3];
        } else {
            $percs[6]++;
            $percs7 += 7;
        }
    } catch (Exception $e) {
        echo $e->getCode() . ", " . $e->getMessage();
        $xWordid = 0;
        $charArr = str_split($word);
        foreach ($charArr as $bob) {
            $xWordid += mb_ord($bob);
        }
        $uniqueInfoArray[] = $word . "^/" . $xWordid . "^/0^/SLARTIBARTFAST^/3";
    }
}
$ppxa = json_encode($data['puncParsedJsonArray']);
$ppAja = json_encode($data['puncParsedAudioJsonArray'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
$uia = json_encode($uniqueInfoArray, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
$bob = mysqli_real_escape_string($conn, $data['plainText']);
$ppja = mysqli_real_escape_string($conn, $ppxa); //  json encode with no flags...
echo "plainText:  " . $data['plainText'];
echo "after real escape string:  " . $bob;



$sql = "INSERT INTO `text`(`name`,`description`,`wordcount`,`perc1`,`perc2`,`perc3`,`perc4`,`perc5`,`perc6`,`percREST`,
                   `rarityQuot`,`audio`,`video`,`plainText`,`puncParsedJsonArray`,`audioSpriteJson`,
                   `puncParsedAudioJsonArray`,`uniqueInfoArray`)"
    . "VALUES ('" . $data['textName'] . "', '" . $data['textDesc'] . "', " . $data['wordCount']
    . ", " . $percs[0] . ", " . $percs[1] . ", " . $percs[2] . ", " . $percs[3] . ", " . $percs[4] . ", " . $percs[5]
    . ", " . $percs[6] . ", " . intval($percs[7] / $data['wordCount'] * 100)
    . ", '" . $data['audioFilename'] . "', '" . $data['videoFilename'] . "', \"" . $bob . "\", '" . $ppja . "', '"
    . $data['audioSpriteObjString'] . "', '" . $ppAja . "', '" . $uia . "')";

echo $sql;
mysqli_query($conn, $sql) or die("\n" . mysqli_error($conn));

echo "\nnew text item added";

$ed = $data['textToEdit'];
$newid = $conn->insert_id;

echo "\nOld id is {$ed} and new id is {$newid}";

if ($ed > 0) {
    echo "\nold id is greater than zero, so deleting old text";
    $sql = "delete from `text` where `id`={$ed}";
    mysqli_query($conn, $sql) or die("\n" . mysqli_error($conn));
    $sql = "update `text` set `id`={$ed} where `id` = {$newid}";
    mysqli_query($conn, $sql) or die . ("\n" . mysqli_error($conn));
    echo "\nupdated id";
} else {
    $sql = "INSERT INTO `usertext`(`userid`,`textid`) VALUES (" . $data['userid'] . ", " . $newid . ")";
    mysqli_query($conn, $sql) or die("\n" . mysqli_error($conn));
}