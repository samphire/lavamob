/**
 * Created by matthew on 9/14/2016.
 */

/*
 Description:
 paragraphArr strips out new line characters
 textArr is one item from paragraphArr split on spaces
 finalArr is a multidimensional array. Per paragraphArr element, it stores an array made up of startpunc elements, then the word with a red style attribute, then endpunc elements, and of course spaces
 singleDimensionalFinalArr is finalArr put into a single dimension
 makeSpriteArr is singleDimensionalFinalArr with inserted audio icon and call to playSound (including spriteNum)
 finalArrWithAudio is the upload version of makeSpriteArr
 *
 *
 * */


var finalArr, makeSpriteArr, finalArrWithAudio, singleDimensionalFinalArr, sound, spriteObj, spriteNum, lastPosi, lastPosx, sndArr, wordArr, textToEdit;
// var userid = userid;
var url = "http://www.notborder.org:8080/Reader/webresources";
// var url = "http://localhost:8080/Reader/webresources";
var audiourl = "http://www.notborder.org/readeraudio";
// var audiourl = "http://localhost/readeraudio";
var lastPos = 0;
function parseText() { // creates a version of the text with play buttons in between every single word, ready to create sprites.
    lastPos = 0;
    finalArr = new Array(); // array containing words and punctuation, in order
    makeSpriteArr = new Array();
    singleDimensionalFinalArr = new Array(); // just a single dimensional version of finalArr
    finalArrWithAudio = new Array();
    wordArr = new Array(); // array containing ONLY words, without any punctuation
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
        for (var i = 0; i < textArr.length; i++) { //iterating through the words of one paragraph, not yet stripped of punctuation
            var tmpString = "";
            endPuncArr = new Array();

            var startPunc = function recursiveStartPunc(myStr) {
                if (myStr.slice(0, 1).search(/[\`\~\#\(\{\[\"\'\<\u2026\u201c]/g) > -1) {
                    finalArr[w].push(myStr.slice(0, 1));
                    return startPunc(myStr.slice(1));
                }
                else {
                    return myStr; // The actual word, stripped of start punctuation, but still end punctuation there
                }
            };

            var endPunc = function recursiveEndPunc(myStr) {
                if (myStr.slice(-1).search(/[\!\?\,\.\:\;\)\}\"\'\]\u2026\u201d]/g) > -1) {
                    endPuncArr.push(myStr.slice(-1));
                    return endPunc(myStr.slice(0, myStr.length - 1));
                } else {
                    return myStr; // The actual word, stripped of end punctuation
                }
            };

            tmpString = startPunc(textArr[i]);
            tmpString = endPunc(tmpString); // so tmpString is now ... THE WORD (without punctuation)
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
            singleDimensionalFinalArr.push(finalArr[i][x]);
        }
    }

    var checkString = "";

    for (var m = 0; m < singleDimensionalFinalArr.length; m++) {
        console.log(singleDimensionalFinalArr[m]);
        if (!singleDimensionalFinalArr[m].charAt(0).match(/[\s\`\~\#\(\{\[\"\'\<\u2026\!\?\,\.\:\;\)\}\"\'\]]/g)) {
            checkString += "<img src='play_hover.png' onclick='makeSprite(" + m + ")'>";
        }
        checkString += singleDimensionalFinalArr[m];
    }

    if ($("#audioCheck").is(":checked")) {
        $("#text").hide();
        document.getElementById("result").innerHTML = checkString; // Don't worry. this text is never uploaded. It's just for the gui to make sound sprites.
        $("#result").show();
    } else {
        uploadText();
    }
}

function loadAndPlay() { // Does what it says on the tin

    sndArr = new Array();
var fileStrArr, fileStr;
    if (document.getElementById("fileinput")) {
        fileStrArr = document.getElementById("fileinput").value.split("\\");
        fileStr = audiourl + "/" + fileStrArr[fileStrArr.length - 1];
    } else{
        fileStr = audiourl + "/" + selectedReaderObj.audio;
    }

    console.log(fileStr)
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

var perf, mySprite;

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
        makeSpriteArr.push(singleDimensionalFinalArr[y]);
        finalArrWithAudio.push(singleDimensionalFinalArr[y]);
    }
    lastPos = pos;

    makeSpriteArr.push("<img src='play_hover.png' onclick='playSound(" + spriteNum + ")'>");
    finalArrWithAudio.push("^&" + spriteNum);
    for (var nm = 0; nm < makeSpriteArr.length; nm++) {
        console.log("makeSpriteArr:  " + makeSpriteArr[nm]);
    }
}

function finish() {
    sound.stop();
    for (var y = lastPos; y < singleDimensionalFinalArr.length; y++) { // complete makeSpriteArr to the end of the words in singleDimensionalFinalArr
        makeSpriteArr.push(singleDimensionalFinalArr[y]);
        finalArrWithAudio.push(singleDimensionalFinalArr[y]);
    }
    var frog = "";
    for (var u = 0; u < makeSpriteArr.length; u++) {
        frog += makeSpriteArr[u];
    }
    document.getElementById("superResult").innerHTML = frog;
}

//noinspection JSAnnotator
function uploadText() {
    var plainText, puncParsedJsonArray, audioSpriteJson, puncParsedAudioJsonArray;
    plainText = document.getElementById("text").value;
    printObject("take a look", document.getElementById("text"));
    console.log("plainText is: " + plainText);
    puncParsedJsonArray = singleDimensionalFinalArr;
    audioSpriteJson = spriteObj;
    puncParsedAudioJsonArray = finalArrWithAudio;

    var uploadData = {};
    uploadData.plainText = plainText;
    uploadData.puncParsedJsonArray = puncParsedJsonArray;
    uploadData.audioSpriteObjString = JSON.stringify(audioSpriteJson);
    uploadData.puncParsedAudioJsonArray = puncParsedAudioJsonArray;
    uploadData.wordArray = wordArr;
    if (typeof sndArr != 'undefined' && sndArr[0] != null) {
        uploadData.audioFilename = sndArr[0];
    }
    uploadData = JSON.stringify(uploadData);
    console.log(uploadData);
    var myUrl = url + "/text?textname=" + $("#readerName").val() + "&textdesc=" + $("#readerDescription").val() + "&textToEdit=" + textToEdit;
    // var myUrl = url + "/text?textname=" + $("#readerName").val() + "&textdesc=" + $("#readerDescription").val();
    console.log("Editing text number: " + textToEdit);
    $.ajax({
        url: myUrl,
        headers: {"userid": userid}, // header must be enabled in cors filter on server
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: uploadData,
        crossDomain: true,
        success: function (data) {
            console.log("Uploaded Text Successfully");
            swal("Text Uploaded Successfully").then(function () {
                getReaderInfo();
                studyReader();
            });
        },
        error: function () {
            alert("Problem Uploading the Text");
        }
    });
}

function pastey(e) {
    console.log("in pastey");
    var clipboardData;
    // e.preventDefault();
    // e.stopPropagation();
    clipboardData = e.clipboardData || window.clipboardData;
    printObject("clipboard data on paste", clipboardData);
    var pastedData = clipboardData.getData("text/plain");
    // alert(pastedData);
    document.getElementById("text").setAttribute("pasted", pastedData);
}
