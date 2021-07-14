<?php
include ("session.inc");

$data = json_decode(file_get_contents('php://input'), true);
print_r($data);
echo "plain text is: " . $data['plainText'];

uploadData.plainText = plainText;
uploadData.puncParsedJsonArray = puncParsedJsonArray;
uploadData.audioSpriteObjString = JSON.stringify(spriteObj);
uploadData.puncParsedAudioJsonArray = puncParsedAudioJsonArray;
uploadData.wordArray = wordArr;
uploadData.uniqueInfoArray = new Array();
    if (typeof sndArr != 'undefined' && sndArr[0] != null) {
    var bob = sndArr[0].split("/");
    uploadData.audioFilename = bob[bob.length - 1];
    // uploadData.audioFilename = sndArr[0];
}

$sql="INSERT INTO `text`(`name`,`description`,`wordcount`,`perc1`,`perc2`,`perc3`,`perc4`,`perc5`,`perc6`,`percREST`,`rarityQuot`,`audio`,`video`,`plainText`,`puncParsedJsonArray`,`audioSpriteJson`,`puncParsedAudioJsonArray`,`uniqueInfoArray`)
VALUES (" . $data['name'] . ", " . $data['description'] . ", ",<{wordcount: }>,<{perc1: }>,<{perc2: }>,<{perc3: }>,<{perc4: }>,<{perc5: }>,<{perc6: }>,
<{percREST: }>,<{rarityQuot: }>,<{audio: }>,<{video: }>,
<{plainText: }>,
<{puncParsedJsonArray: }>,
<{audioSpriteJson: }>,
<{puncParsedAudioJsonArray: }>,
<{uniqueInfoArray: }>)";



INSERT INTO `usertext`(`userid`,`textid`) VALUES (<{userid: }>,<{textid: }>);
*/

?>