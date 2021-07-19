<?php
include("session.inc");

function mbStringToArray($word){
    $strl = mb_strlen($word);
    while($strl){
        $array[] = mb_substr($word, 0, 1, "UTF-8");
        $word = mb_substr($word, 1, $strl, "UTF-8");
        $strl = mb_strlen($word);
    }
    return $array;
}


$data = json_decode(file_get_contents('php://input'), true);
//print_r($data);

$percs = array(0, 0, 0, 0, 0, 0, 0, 0);
$uniqueInfoArray = array();

foreach ($data['uniqueWordArray'] as $word) {
    $sql = "SELECT words.id, headwords.id, headword, frequency 
            FROM words JOIN headwords
            ON words.headword_id=headwords.id
            WHERE word='{$word}'";

    print "\n\n\n\n sql is " . $sql;

    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_row($result);
    $numRows = mysqli_num_rows($result);
    print "\n\nthere are " . $numRows . " rows.\n\n";

    if ($numRows > 0) {
        print "query returned a single result";
        $uniqueInfoArray[] = $word . "^/" . $row[0] . "^/" . $row[1] . "^/" . $row[2] . "^/" . $row[3];
        if ($row[3] < 7) {
            $percs[$row[3] - 1]++;
            $percs[7] += $row[3];
        } else {
            $percs[6]++;
            $percs7 += 7;
        }
    } else {
        print "\nno query result. There must be a korean word.";
        $xWordid = 0;

        $charArr = mbStringToArray($word);

        foreach ($charArr as $bob) {
//            print "\n\nmb ord is: " . (mb_ord($bob));
            $xWordid += mb_ord($bob);
//            print "\n\n xwordid is " . $xWordid;
        }
        $uniqueInfoArray[] = $word . "^/" . $xWordid . "^/0^/SLARTIBARTFAST^/3";
    }
}
$ppxa = json_encode($data['puncParsedJsonArray'], JSON_UNESCAPED_UNICODE);
$ppAja = json_encode($data['puncParsedAudioJsonArray'], JSON_UNESCAPED_UNICODE);
$uia = json_encode($uniqueInfoArray, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$plainText = mysqli_real_escape_string($conn, $data['plainText']);
$ppja = mysqli_real_escape_string($conn, $ppxa); //  json encode with no flags...
echo "plainText:  " . $data['plainText'];
echo "after real escape string:  " . $bob;
print "\n\n uniqueInfoArray: {$uia}";


$sql = "INSERT INTO `text`(`name`,`description`,`wordcount`,`perc1`,`perc2`,`perc3`,`perc4`,`perc5`,`perc6`,`percREST`,
                   `rarityQuot`,`audio`,`video`,`plainText`,`puncParsedJsonArray`,`audioSpriteJson`,
                   `puncParsedAudioJsonArray`,`uniqueInfoArray`)"
    . "VALUES ('" . $data['textName'] . "', '" . $data['textDesc'] . "', " . $data['wordCount']
    . ", " . $percs[0] . ", " . $percs[1] . ", " . $percs[2] . ", " . $percs[3] . ", " . $percs[4] . ", " . $percs[5]
    . ", " . $percs[6] . ", " . intval($percs[7] / $data['wordCount'] * 100)
    . ", '" . $data['audioFilename'] . "', '" . $data['videoFilename'] . "', \"" . $plainText . "\", '" . $ppja . "', '"
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