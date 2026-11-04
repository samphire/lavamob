<?php
include("session.inc");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function mbStringToArray($word)
{
    $strl = mb_strlen($word);
    while ($strl) {
        $array[] = mb_substr($word, 0, 1, "UTF-8");
        $word = mb_substr($word, 1, $strl, "UTF-8");
        $strl = mb_strlen($word);
    }
    return $array;
}

$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    die("JSON decode error: " . json_last_error_msg());
}

//print_r($data);

$percs = array(0, 0, 0, 0, 0, 0, 0, 0);
$uniqueInfoArray = array();

$wordSql = "SELECT words.id, headwords.id, headword, frequency
            FROM words JOIN headwords
            ON words.headword_id=headwords.id
            WHERE word = ?";

foreach ($data['uniqueWordArray'] as $word) {
    $result = $conn->execute_query($wordSql, [$word]);
    $row = mysqli_fetch_row($result);
    $numRows = mysqli_num_rows($result);
//    print "\n\nthere are " . $numRows . " rows.\n\n";

    if ($numRows > 0) {                 //TODO Fix the percentage stuff
//        print "query returned a single result";
        $uniqueInfoArray[] = $word . "^/" . $row[0] . "^/" . $row[1] . "^/" . $row[2] . "^/" . $row[3];
        if ($row[3] < 7) { // one of the top 6000 words
            $percs[$row[3] - 1]++;  // add 1 to the relevant frequency field (perc1 etc...)
            $percs[7] += $row[3];  // rarityQuot is simply the sum of the frequencies... good idea
        } else {
            $percs[6]++; // add 1 to percREST
            $percs[7] += 7;  // $row[3] values above 6 are all the same level of frequency
        }
    } else {
//        print "\no query result. There must be a korean word or a hyphenated word or a punctuation.";
        $xWordid = 0;

        $charArr = mbStringToArray($word);

        $stray = 1;
        foreach ($charArr as $bob) {
//            print "\n\nmb ord is: " . (mb_ord($bob));
            $xWordid += mb_ord($bob) * $stray;
            $stray++; // each place must have different factor, otherwise different words can add up to the same number!
//            print "\n\n xwordid is " . $xWordid;
        }
        $uniqueInfoArray[] = $word . "^/" . $xWordid . "^/{$xWordid}^/SLARTIBARTFAST^/3";
    }
}
$wordCount = (int)$data['wordCount'];
$ppxa = json_encode($data['puncParsedJsonArray'], JSON_UNESCAPED_UNICODE);
$ppAxa = json_encode($data['puncParsedAudioJsonArray'], JSON_UNESCAPED_UNICODE);

//$ppxa = json_encode($data['puncParsedJsonArray'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
//$ppAja = json_encode($data['puncParsedAudioJsonArray'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);


$uia = json_encode($uniqueInfoArray, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
//echo "\n\n\nplainText:  " . $data['plainText'];
//echo "after real escape string:  " . $bob;
//print "\n\n uniqueInfoArray: {$uia}";

//echo "\n\nname and desc are: " . $name . ", " . $desc;

//echo "\n\nvalue of percs[7] is " . $percs[7];

$sql = "INSERT INTO `text`(`name`,`description`,`wordcount`,`perc1`,`perc2`,`perc3`,`perc4`,`perc5`,`perc6`,`percREST`,
                   `rarityQuot`,`audio`,`video`,`plainText`,`puncParsedJsonArray`,`audioSpriteJson`,
                   `puncParsedAudioJsonArray`,`uniqueInfoArray`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$params = [
    $data['textName'] ?? '',
    $data['textDesc'] ?? '',
    $wordCount,
    $percs[0], $percs[1], $percs[2], $percs[3], $percs[4], $percs[5], $percs[6],
    intval($percs[7] / $wordCount * 100),
    $data['audioFilename'] ?? '',
    $data['videoFilename'] ?? '',
    $data['plainText'] ?? '',
    $ppxa,
    $data['audioSpriteObjString'] ?? '',
    $ppAxa,
    $uia,
];

$conn->execute_query($sql, $params) or (http_response_code(500) && die("\n\nERROR IN INSERT QUERY\n\n" . mysqli_error($conn)));

//echo "\nnew text item added";

$ed = (int)$data['textToEdit'];
$newid = $conn->insert_id;

//echo "\nOld id is {$ed} and new id is {$newid}";

if ($ed > 0) {
//    echo "\nold id is greater than zero, so deleting old text";
    $conn->execute_query("DELETE FROM `text` WHERE `id` = ?", [$ed]) or die("\n" . mysqli_error($conn));
    $conn->execute_query("UPDATE `text` SET `id` = ? WHERE `id` = ?", [$ed, $newid]) or die("\n" . mysqli_error($conn));
//    echo "\nupdated id";
} else {
    $conn->execute_query("INSERT INTO `usertext`(`userid`,`textid`) VALUES (?, ?)", [(int)$data['userid'], $newid])
        or die("\n" . mysqli_error($conn));
}
