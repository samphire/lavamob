/**
 * Created by matthew on 9/14/2016.
 */

/*
 Description:
 paragraphArr strips out new line characters
 textArr is one item from paragraphArr split on spaces
 finalArr is a multidimensional array. Per paragraphArr element, it stores an array made up of startpunc elements, then the word with a red style attribute, then endpunc elements, and of course spaces
 luckArr is finalArr put into a single dimension
 makeSpriteArr is luckArr with inserted audio icon and call to playSound (including spriteNum)
 bobArr is the upload version of makeSpriteArr
 *
 *
 * */


var finalArr, makeSpriteArr, bobArr, luckArr, sound, spriteObj, spriteNum, lastPosi, lastPosx, sndArr, wordArr;
var userid = "1";
var lastPos = 0;
function parseText() {
    lastPos = 0;
    finalArr = new Array();
    makeSpriteArr = new Array();
    luckArr = new Array();
    bobArr = new Array();
    wordArr = new Array();
    var w = 0;
    var text = document.getElementById('text').value;
    var paragraphArr = text.split(/[\r\n]/g);
    var tmpArr = paragraphArr;
    for (var q = tmpArr.length; q > 0; q--) {
        if (tmpArr[q - 1].length < 1) {
            paragraphArr.splice(q - 1, 1);
        }
    }

    var textArr;
    var endPuncArr;
    for (w = 0; w < paragraphArr.length; w++) {
        finalArr[w] = new Array();
        textArr = paragraphArr[w].split(" ");
        for (var i = 0; i < textArr.length; i++) {
            var tmpString = "";
            endPuncArr = new Array();

            var startPunc = function recursiveStartPunc(myStr) {
                if (myStr.slice(0, 1).search(/[\`\~\#\(\{\[\"\'\<\u2026]/g) > -1) {
                    finalArr[w].push(myStr.slice(0, 1));
                    return startPunc(myStr.slice(1));
                }
                else {
                    return myStr;
                }
            };

            var endPunc = function recursiveEndPunc(myStr) {
                if (myStr.slice(-1).search(/[\!\?\,\.\:\;\)\}\"\'\]\u2026]/g) > -1) {
                    endPuncArr.push(myStr.slice(-1));
                    return endPunc(myStr.slice(0, myStr.length - 1));
                } else {
                    return myStr; // The actual word, stripped of punctuation
                }
            };

            tmpString = startPunc(textArr[i]);
            tmpString = endPunc(tmpString);
            wordArr.push(tmpString);
            // tmpString = "<span>" + tmpString + "</span>";

            finalArr[w].push(tmpString);
            for (var n = endPuncArr.length; n > 0; n--) {
                finalArr[w].push(endPuncArr[n - 1]);
            }

            if (i < (textArr.length - 1)) {
                finalArr[w].push(" ");
                console.log("Pushing [SPACE]")
            }
        }
        if (w < (paragraphArr.length - 1)) {
            finalArr[w].push("<br>");
            console.log("Pushing [LINEFEED]");
        }
    }

    for (var i = 0; i < finalArr.length; i++) {
        for (var x = 0; x < finalArr[i].length; x++) {
            luckArr.push(finalArr[i][x]);
        }
    }

    var checkString = "";

    for (var m = 0; m < luckArr.length; m++) {
        console.log(luckArr[m]);
        if (!luckArr[m].charAt(0).match(/[\s\`\~\#\(\{\[\"\'\<\u2026\!\?\,\.\:\;\)\}\"\'\]]/g)) {
            checkString += "<img src='play_hover.png' onclick='makeSprite(" + m + ")'>";
        }
        checkString += luckArr[m];
    }
    document.getElementById("result").innerHTML = checkString;
}

function loadAndPlay() {

    sndArr = new Array();
    var fileStrArr = document.getElementById("fileinput").value.split("\\");
    var fileStr = fileStrArr[fileStrArr.length - 1];
    sndArr.push(fileStr);

    sound = new Howl({
        src: sndArr,
        autoplay: false,
        loop: false
    });
    spriteObj = {};
    spriteNum = 0;
    sound.play();
}
var perf;
function playSound(sprite) {
    mySprite = sprite.toString();
    perf = new Howl({
        src: sndArr,
        sprite: spriteObj
    });
    perf.play(mySprite);
}

function makeSprite(pos) {
    spriteNum++;
    var start = Math.floor(sound.seek() * 1000 - 300);
    var bob = "";
    if (spriteNum > 1) {
        bob += spriteNum - 1;
        spriteObj[bob][1] = start - spriteObj[bob][0];
        spriteObj[spriteNum] = [start, 10000000];
    } else {
        spriteObj[spriteNum] = [start, 10000000];
    }
    console.log(JSON.stringify(spriteObj));

    for (var y = lastPos; y < pos; y++) {
        makeSpriteArr.push(luckArr[y]);
        bobArr.push(luckArr[y]);
    }
    lastPos = pos;

    makeSpriteArr.push("<img src='play_hover.png' onclick='playSound(" + spriteNum + ")'>");
    bobArr.push("^&" + spriteNum);
    for (var nm = 0; nm < makeSpriteArr.length; nm++) {
        console.log("makeSpriteArr:  " + makeSpriteArr[nm]);
    }

}

function finish() {
    sound.stop();
    for (var y = lastPos; y < luckArr.length; y++) { // complete makeSpriteArr to the end of the words in luckArr
        makeSpriteArr.push(luckArr[y]);
        bobArr.push(luckArr[y]);
    }
    var frog = "";
    for (var u = 0; u < makeSpriteArr.length; u++) {
        frog += makeSpriteArr[u];
    }
    document.getElementById("superResult").innerHTML = frog;
    uploadText();
}
function uploadText() {
    var plainText, puncParsedJsonArray, audioSpriteJson, puncParsedAudioJsonArray;
    plainText = document.getElementById("text").getAttribute("pasted");
    puncParsedJsonArray = luckArr;
    audioSpriteJson = spriteObj;
    puncParsedAudioJsonArray = bobArr;

    var uploadData = {};
    uploadData.plainText = plainText;
    uploadData.puncParsedJsonArray = puncParsedJsonArray;
    uploadData.audioSpriteObjString = JSON.stringify(audioSpriteJson);
    uploadData.puncParsedAudioJsonArray = puncParsedAudioJsonArray;
    uploadData.wordArray = wordArr
    uploadData.audioFilename = sndArr[0];
    uploadData = JSON.stringify(uploadData);
    console.log(uploadData);

    $.ajax({
        url: "http://localhost:8080/Reader/webresources" + "/text",
        headers: {"userid": userid}, // header must be enabled in cors filter on server
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: uploadData,
        crossDomain: true,
        success: function (data) {
            console.log("Uploaded Text Successfully");
        },
        error: function () {
            alert("Problem Uploading the Text");
        }
    });
}

function pastey(e) {
    var clipboardData;
    // e.preventDefault();
    // e.stopPropagation();
    clipboardData = e.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData("text/plain");
    document.getElementById("text").setAttribute("pasted", pastedData);
}

function test(){
    $.ajax({
        url: "http://localhost:8080/Reader/webresources" + "/text/dBOnly?textid=10049",
        type: "GET",
        accepts: "application/json",
        beforeSend: function(xhr){
            xhr.setRequestHeader("Accept", "application/json");
        },
        crossDomain: true,
        success: function (data) {
            console.log("Downloaded Text Successfully");
            console.log(JSON.stringify(data));
        },
        error: function () {
            alert("Problem Downloading the Text");
        }
    });
}