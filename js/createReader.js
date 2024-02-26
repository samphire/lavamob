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

let finalArr, makeSpriteArr, finalArrWithAudio, singleDimensionalFinalArr, sound, spriteObj, spriteNum, sndArr, wordArr, textToEdit;

let lastPos = 0;
let files;

function prepareUpload(event) {
    files = event.target.files;
}

function uploadFiles(event) {
    event.stopPropagation();
    event.preventDefault();

    // start loading spinner

    let data = new FormData();
    $.each(files, function (key, value) {
        data.append(key, value);
    });

    $.ajax({
        url: audiourl + '/upload.php?files',
        type: 'POST',
        data: data,
        crossDomain: true,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
            console.log("success");
            if (typeof data.error === 'undefined') { //i.e. there is no variable 'error' in the array... therefore success
                alert('success uploading file');
                console.log('should be data');
                console.log(data.success);
            } else {
                console.log('ERRORS: ' + data.error);
                alert('fail');
            }
        },
        error: function (jqXHR, textStatus, errorThrows) {
            console.log('ERRORS: ' + textStatus);
            alert('Console will show CORS error, but file is correctly uploaded!');
            // stop loading spinner
        }
    });
}

function parseText() { let i;
// creates a version of the text with play buttons in between every single word, ready to create sprites.
    lastPos = 0;
    finalArr = new Array(); // array containing words and punctuation, in order
    makeSpriteArr = new Array();
    singleDimensionalFinalArr = new Array(); // just a single dimensional version of finalArr
    finalArrWithAudio = new Array();
    wordArr = new Array(); // array containing ONLY words, without any punctuation
    var w = 0;
    var text = document.getElementById('createReaderTextPanel').value;
    var paragraphArr = text.split(/[\r\n]/g);
    var tmpArr = paragraphArr;
    for (var q = tmpArr.length; q > 0; q--) {
        if (tmpArr[q - 1].length < 1) {
            paragraphArr.splice(q - 1, 1); // remove paragraph item if it has no content
        }
    }

    var textArr;
    var endPuncArr;
    for (w = 0; w < paragraphArr.length; w++) {
        finalArr[w] = new Array();
        textArr = paragraphArr[w].split(" ");
        for (i = 0; i < textArr.length; i++) { //iterating through the words of one paragraph, not yet stripped of punctuation
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
            for (let n = endPuncArr.length; n > 0; n--) {
                finalArr[w].push(endPuncArr[n - 1]);
            }

            if (i < (textArr.length - 1)) {
                finalArr[w].push(" ");
                console.log("Pushing [SPACE]")
            }
        }
        if (w < (paragraphArr.length - 1)) {
            finalArr[w].push("<br><br>");
            console.log("Pushing [LINEFEED]");
        }
    }

    for (i = 0; i < finalArr.length; i++) {
        for (let x = 0; x < finalArr[i].length; x++) {
            singleDimensionalFinalArr.push(finalArr[i][x]);
        }
    }

    let checkString = "";

    for (let m = 0; m < singleDimensionalFinalArr.length; m++) {
        console.log(singleDimensionalFinalArr[m]);
        if (!singleDimensionalFinalArr[m].charAt(0).match(/[\s\`\~\#\(\{\[\"\'\<\u2026\!\?\,\.\:\;\)\}\"\'\]]/g)) {
            checkString += "<img src='play_hover.png' class='audioIcon' onclick='makeSprite(this, " + m + ")'>";
        }
        checkString += singleDimensionalFinalArr[m];
    }

    if ($("#audioCheck").is(":checked")) {
        $("#createReaderTextPanel").hide();
        document.getElementById("audioSpriteSelectPanel").innerHTML = checkString; // Don't worry. this text is never uploaded. It's just for the gui to make sound sprites.
        $("#audioSpriteSelectPanel").show();
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
    } else {
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

var perf, testSprite, mySprite;

function playSound(sprite) {
    alert("hey");
    mySprite = sprite.toString();
    perf = new Howl({
        src: sndArr,
        sprite: spriteObj
    });
    testSprite = spriteObj;

    console.log("testing the Sprite: " + testSprite);
    console.log(testSprite['1']);
    console.log(testSprite['1'][0]);
    console.log(testSprite['1'][1]);
    perf.play(mySprite);
}

function makeSprite(obj, pos) {
    obj.style.backgroundColor = "#000";
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

    makeSpriteArr.push("<img src='play_hover.png' class='audioIcon' onclick='playSound(" + spriteNum + ")'>");
    finalArrWithAudio.push("^&" + spriteNum);
    for (var nm = 0; nm < makeSpriteArr.length; nm++) {
        // console.log("makeSpriteArr:  " + makeSpriteArr[nm]);
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
    $("#audioSpriteSelectPanel").hide();
    document.getElementById("superResult").innerHTML = frog;
    printObject("finalArrWithAudio", finalArrWithAudio);
    uploadText();
}

//noinspection JSAnnotator
function uploadText() {
    let plainText, puncParsedJsonArray, puncParsedAudioJsonArray;
    plainText = document.getElementById("createReaderTextPanel").value;
    // console.log("plainText is: " + plainText);
    puncParsedJsonArray = singleDimensionalFinalArr;
    printObject("finalArrWithAudio", finalArrWithAudio);
    puncParsedAudioJsonArray = finalArrWithAudio;
    let uniqueWordArr = Array.from(new Set(wordArr));
    let wordCount = uniqueWordArr.length;
    // console.info("\nsize of wordArr: " + wordArr.length);
    // console.info("size of uniqueWordArr: " + wordCount);
    if (!textToEdit) textToEdit = 0;
    let uploadData = {};
    uploadData.userid = userid;
    uploadData.textName = $("#readerName").val();
    uploadData.textDesc = $("#readerDescription").val();
    uploadData.textToEdit = textToEdit;
    uploadData.plainText = plainText;
    uploadData.puncParsedJsonArray = puncParsedJsonArray;
    uploadData.audioSpriteObjString = JSON.stringify(spriteObj);
    uploadData.puncParsedAudioJsonArray = puncParsedAudioJsonArray;
    uploadData.uniqueWordArray = uniqueWordArr;
    uploadData.wordCount = wordCount;
    // uploadData.uniqueInfoArray = new Array();
    if (typeof sndArr != 'undefined' && sndArr[0] != null) {
        const bob = sndArr[0].split("/");
        uploadData.audioFilename = bob[bob.length - 1];
        // uploadData.audioFilename = sndArr[0];
    }
    printObject("data object uploaded by uploadText()", uploadData);
    // console.warn("upload data before JSON stringify: " + uploadData);
    uploadData = JSON.stringify(uploadData);
    // console.warn("upload data after JSON stringify: " + uploadData);
    // console.log(uploadData);
    const myUrl = url2 + "/php/uploadText.php";
    // console.log("Editing text number: " + textToEdit);
    // console.log("upload url is: " + myUrl);
    $.ajax({
        url: myUrl,
        //headers: {"userid": userid}, // header must be enabled in cors filter on server
        type: "POST",
        // dataType: "text", // The type of data expected as a response
        contentType: "application/json; charset=UTF-8",
        data: uploadData,
        crossDomain: true,
        success: function (data) {
            console.log("Uploaded Text Successfully");
            // make entry in the activity log table
            jaxy(
                "php/activityLog.php", "POST",
                {
                    userid: userid,
                    activityType: 1,
                    extraInfo: 1
                },
                "Updated activity log for voca test",
                "Problem updating activity log for voca test"
            );

            swal("Text Uploaded Successfully").then(function () {
                getReaderInfo();
                studyReader();
            });
        },
        error: function () {
            alert("Problem Uploading the Text:");
            console.warn(textToEdit + ", "+ userid + ", \n" + myUrl);
        }
    });
    // cleanup
    cleanupCreateReader();
}

function cleanupCreateReader(){
    document.getElementById("readerName").value = "";
    document.getElementById("readerDescription").value = "";
    textToEdit = 0;
    $("#audioSpriteSelectPanel").empty();
    $("#superResult").empty();
    document.getElementById("createReaderTextPanel").value = "";
    $("#createReaderTextPanel").show();
    if(document.getElementById("audioOpt")){
        cleanupAudioOptAndDiv();
    }
    $('#btnUploadText').show()
}

// This is the only usage, so why is it in it's own method???
function cleanupAudioOptAndDiv(){
    document.getElementById("audioCheck").checked = false;
    $("#audiodiv").hide();
}

function pastey(e) { // says it is unused, but it is...
    console.log("in pastey");
    var clipboardData;
    // e.preventDefault();
    // e.stopPropagation();
    clipboardData = e.clipboardData || window.clipboardData;
    printObject("clipboard data on paste", clipboardData);
    var pastedData = clipboardData.getData("text/plain");
    // alert(pastedData);
    document.getElementById("createReaderTextPanel").setAttribute("pasted", pastedData);
}
