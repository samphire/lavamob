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

let finalArr, makeSpriteArr, finalArrWithAudio, singleDimensionalFinalArr, sound, spriteObj, spriteNum, sndArr, wordArr,
    textToEdit;

let lastPos = 0;
let files;

// const realWordRegex = /^[a-zA-Z]+$/;
// const realWordRegex = /^[a-zA-Z]+(?:'[a-zA-Z]+)*'?$/

const realWordRegex = /^\p{L}+(?:'\p{L}+)*'?$/u;



const hyphenWordRegex = /-/;
const hyphenUsedAsEmDash = /\s-\s/;

function prepareUpload(event) {
    files = event.target.files;
}

function uploadFiles(event) {
    event.stopPropagation();
    event.preventDefault();

    // start loading spinner

    let data = new FormData();
    $.each(files, function (key, value) {
        if (value instanceof Blob) {
            data.append(String(key), value);
        }
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
        success: function (data) {
            console.log(data.message);
            swal({
                timer: 2500,
                title: "성공!",
                text: data.message,
                icon: "success",
                showConfirmButton: false
            })
        },
        error: function (jqXHR, textStatus) {
            console.log('ERRORS: ' + textStatus);
            console.log(jqXHR)
            alert(JSON.parse(jqXHR.responseText).message);
        }
    });
}

function parseText() {
    let i;
// creates a version of the text with play buttons in between every single word, ready to create sprites.
    lastPos = 0;
    finalArr = []; // array containing words and punctuation, in order
    makeSpriteArr = [];
    singleDimensionalFinalArr = []; // just a single dimensional version of finalArr
    finalArrWithAudio = [];
    wordArr = []; // array containing ONLY words, without any punctuation

    let w = 0;
    let text = document.getElementById('createReaderTextPanel').value;

    // deal with the annoying character in Shiloh.pdf
    // const ShilohCharacterRegex = /(?<=\S)\u2014(?=\S)/g;
    // text = text.replaceAll(ShilohCharacterRegex, ' \u2014 ');
    // deal with annoying citations brackets in wikipedia
    text = text.replace(/(\S)(\[)/g, "$1 $2");
    // convert annoying curly typeset apostrophe to simple U+0027 (from U+2019)
    // text = text.replace(/\u2019/g, "\u0027");

    text = normalizeText(text);

    const paragraphRegex = /\r\n|\r|\n/g
    let paragraphArr = text.split(paragraphRegex);

    let tmpArr = paragraphArr;
    for (let q = tmpArr.length; q > 0; q--) {
        if (tmpArr[q - 1].length < 1) {
            paragraphArr.splice(q - 1, 1); // remove paragraph item if it has no content
        }
    }

    let textArr;
    let endPuncArr = [];
    for (w = 0; w < paragraphArr.length; w++) { // iterates through each paragraph
        finalArr[w] = []; // creates an empty array element for every paragraph
        textArr = paragraphArr[w].split(" "); // leaving only words and punctuation

        textArr = treatImagesInCreateReader(textArr);

        // printObject("textArr", textArr);

        for (i = 0; i < textArr.length; i++) { //iterating through the words of one paragraph, not yet stripped of punctuation

            // *** New check: if token is an image tag, push it as is and skip further processing ***
            if (textArr[i].startsWith("<img") && textArr[i].endsWith(">")) {
                finalArr[w].push(textArr[i]);
                if (i < (textArr.length - 1)) {
                    finalArr[w].push(" ");
                }
                continue;
            }

            let tmpString = "";
            // const startPuncRegex = /[`~#({\["'<\u2026\u201c]/g;
            // const endPuncRegex = /[!?,.:;)}"'>\]\u2026\u201d]/g;


            // chatGPT version:
            // Needs the 'u' flag
            // const startPuncRegex = /[\p{Ps}\p{Pi}<`~#\u2026]/gu;         // Ps = open brackets, Pi = initial quotes
            // const endPuncRegex   = /[\p{Pe}\p{Pf}>!?,.:;\u2026\u2019\u0027]/gu;      // Pe = close brackets, Pf = final quotes
//

            const startPuncRegex = /[\p{Ps}\p{Pi}\p{Quotation_Mark}<`~#\u2026]/gu;
            const endPuncRegex   = /[\p{Pe}\p{Pf}\p{Quotation_Mark}>!?,.:;\u2026]/gu;

            const startPunc = (myStr) => {// RECURSIVE FUNCTION
                // console.log('in startPunc recursive function: ' + myStr);
                if (myStr.slice(0, 1).search(startPuncRegex) > -1) { // u2026 is horizontal elipsis (...). u201c is left double quote. -1 is returned if the search does not find anything.
                    finalArr[w].push(myStr.slice(0, 1)); // one by one, the starting punctuation is added as an element to finalArr[w] (i.e. second dimension)
                    return startPunc(myStr.slice(1));
                } else {
                    return myStr; // The actual word, stripped of start punctuation, but still end punctuation there
                }
            };

            const endPunc = (myStr) => {
                // console.log('in endPunc recursive function: ' + myStr);
                if (myStr.slice(-1).search(endPuncRegex) > -1) {
                    endPuncArr.push(myStr.slice(-1));
                    return endPunc(myStr.slice(0, myStr.length - 1));
                } else {
                    return myStr; // The actual word, stripped of end punctuation
                }
            };

            tmpString = startPunc(textArr[i]);
            tmpString = endPunc(tmpString);

            // console.log("textArr[i]: " + textArr[i]);
            // console.log("tmpString: " + tmpString);
            // console.log("tmpString.search(realWordRegex): " + tmpString.search(realWordRegex));

            if (tmpString.search(realWordRegex) > -1) {
                wordArr.push(tmpString);
            }

            if (tmpString.search(hyphenWordRegex) > -1 && tmpString.search(/^-$/) === -1) { // This is a word that contains at least one hyphen
                let parts = tmpString.split("-");
                wordArr.push(...parts);
            }

            finalArr[w].push(tmpString);
            let crab = 0;

            for (let n = endPuncArr.length; n > 0; n--) {
                crab++;
                finalArr[w].push(endPuncArr[n - 1]); // push is adding onto the 2nd dimension array the punctuation held in endPunc
            }
            endPuncArr.length = 0;
            crab = 0;
            if (i < (textArr.length - 1)) {
                finalArr[w].push(" ");
            }
        }
        if (w < (paragraphArr.length - 1)) {
            finalArr[w].push("<br><br>");
        }
    }

    for (i = 0; i < finalArr.length; i++) {
        for (let x = 0; x < finalArr[i].length; x++) {
            singleDimensionalFinalArr.push(finalArr[i][x]); // so, in other words, the first dimension, paragraphs, is subsumed.
        }
    }

    let checkString = "";
    const regex4audioSpriteSelectPanel = /[\s`~#({\["'<\u2026!?,.:;)}\]]/g;

    for (let m = 0; m < singleDimensionalFinalArr.length; m++) {
        if (!singleDimensionalFinalArr[m].charAt(0).match(regex4audioSpriteSelectPanel)) {
            checkString += "<img alt='' src='play_hover.png' class='audioIcon' onclick='makeSprite(this, " + m + ")'>";
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

    // console.log(wordArr);
    // console.log(finalArr);
    // console.log(singleDimensionalFinalArr);

}

function loadAndPlay() { // Does what it says on the tin

    sndArr = [];
    let fileStrArr, fileStr;
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

let perf, testSprite, mySprite;

function playSound(sprite) {
    alert("hey");
    mySprite = sprite.toString();
    perf = new Howl({
        src: sndArr,
        sprite: spriteObj
    });
    testSprite = spriteObj;

    // console.log("testing the Sprite: " + testSprite);
    // console.log(testSprite['1']);
    // console.log(testSprite['1'][0]);
    // console.log(testSprite['1'][1]);
    perf.play(mySprite);
}

function makeSprite(obj, pos) {
    obj.style.backgroundColor = "#000";
    spriteNum++;
    let start = Math.floor(sound.seek() * 1000 - 300);
    let bob = "";
    if (spriteNum > 1) {
        bob += spriteNum - 1;
        spriteObj[bob][1] = start - spriteObj[bob][0];
        spriteObj[spriteNum] = [start, 10000000];
    } else {
        spriteObj[spriteNum] = [start, 10000000];
    }
    // console.log(JSON.stringify(spriteObj));

    for (let y = lastPos; y < pos; y++) {
        makeSpriteArr.push(singleDimensionalFinalArr[y]);
        finalArrWithAudio.push(singleDimensionalFinalArr[y]);
    }
    lastPos = pos;

    makeSpriteArr.push("<img alt='' src='play_hover.png' class='audioIcon' onclick='playSound(" + spriteNum + ")'>");
    finalArrWithAudio.push("^&" + spriteNum);
    for (let nm = 0; nm < makeSpriteArr.length; nm++) {
        // console.log("makeSpriteArr:  " + makeSpriteArr[nm]);
    }
}

function finish() {
    sound.stop();
    for (let y = lastPos; y < singleDimensionalFinalArr.length; y++) { // complete makeSpriteArr to the end of the words in singleDimensionalFinalArr
        makeSpriteArr.push(singleDimensionalFinalArr[y]);
        finalArrWithAudio.push(singleDimensionalFinalArr[y]);
    }
    let frog = "";
    for (let u = 0; u < makeSpriteArr.length; u++) {
        frog += makeSpriteArr[u];
    }
    $("#audioSpriteSelectPanel").hide();
    document.getElementById("superResult").innerHTML = frog;
    // printObject("finalArrWithAudio", finalArrWithAudio);
    uploadText();
}

//noinspection JSAnnotator
function uploadText() {
    let plainText, puncParsedJsonArray, puncParsedAudioJsonArray;
    plainText = document.getElementById("createReaderTextPanel").value;
    puncParsedJsonArray = singleDimensionalFinalArr;
    // printObject("finalArrWithAudio", finalArrWithAudio);
    puncParsedAudioJsonArray = finalArrWithAudio;
    let uniqueWordArr = Array.from(new Set(wordArr));
    let wordCount = uniqueWordArr.length;
    if (!textToEdit) textToEdit = 0;
    let uploadData = {};
    uploadData.userid = userid;
    uploadData.textName = $("#readerName").val();
    uploadData.textDesc = $("#readerDescription").val();
    uploadData.textToEdit = textToEdit;
    const sammy = textToEdit; // because textToEdit gets reset to zero!!! somewhere!!!
    uploadData.plainText = plainText;
    uploadData.puncParsedJsonArray = puncParsedJsonArray;
    uploadData.audioSpriteObjString = JSON.stringify(spriteObj);
    uploadData.puncParsedAudioJsonArray = puncParsedAudioJsonArray;
    uploadData.uniqueWordArray = uniqueWordArr;
    uploadData.wordCount = wordCount;

    if (typeof sndArr != 'undefined' && sndArr[0] != null) {
        const bob = sndArr[0].split("/");
        uploadData.audioFilename = bob[bob.length - 1];
    }
    // printObject("data object uploaded by uploadText()", uploadData);
    uploadData = JSON.stringify(uploadData);


    // const cleanedData = deepClean(uploadData); // cleans the structure of the json
    // uploadData = sanitizeForJSON(cleanedData); // removes problem characters for php upload

    // console.warn("uploadData AGAIN", uploadData);
    const myUrl = url2 + "/php/uploadText.php";
    $.ajax({
        url: myUrl,
        //headers: {"userid": userid}, // header must be enabled in cors filter on server
        type: "POST",
        // dataType: "text", // The type of data expected as a response
        contentType: "application/json; charset=UTF-8",
        data: uploadData,
        crossDomain: true,
        success: function () {
            console.log("Uploaded Text Successfully");
            // make entry in the activity log table if first creation
            if (sammy === 0) {
                jaxy(
                    "php/activityLog.php", "POST",
                    {
                        userid: userid,
                        activityType: 1,
                        extraInfo: wordCount,
                        textToEdit: sammy
                    },
                    "Updated activity log for voca test",
                    "Problem updating activity log for voca test"
                );
            }
            swal("Text Uploaded Successfully").then(function () {
                getReaderInfo();
                studyReader();
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

            alert(uploadData);

            // console.error("Upload failed");
            // console.error("Status code:", jqXHR.status);
            // console.error("Response text:", jqXHR.responseText);
            // console.error("Text status:", textStatus);
            // console.error("Error thrown:", errorThrown);
            alert("Upload failed");
            alert("Status code:", jqXHR.status);
            alert("Response text:", jqXHR.responseText);
            alert("Text status:", textStatus);
            alert("Error thrown:", errorThrown);
            alert("Problem Uploading the Text:\n" + jqXHR.status + " - " + errorThrown);
        }
    });
    // cleanup
    cleanupCreateReader();
}

function cleanupCreateReader() {
    document.getElementById("readerName").value = "";
    document.getElementById("readerDescription").value = "";
    textToEdit = 0;
    $("#audioSpriteSelectPanel").empty();
    $("#superResult").empty();
    document.getElementById("createReaderTextPanel").value = "";
    $("#createReaderTextPanel").show();
    if (document.getElementById("audioOpt")) {
        cleanupAudioOptAndDiv();
    }
    $('#btnUploadText').show()
}

// This is the only usage, so why is it in its own method???
function cleanupAudioOptAndDiv() {
    document.getElementById("audioCheck").checked = false;
    $("#audiodiv").hide();
}

function pastey(e) { // says it is unused, but it is...
    console.log("in pastey");
    let clipboardData;
    // e.preventDefault();
    // e.stopPropagation();
    clipboardData = e.clipboardData || window.clipboardData;
    printObject("clipboard data on paste", clipboardData);
    let pastedData = clipboardData.getData("text/plain");
    // alert(pastedData);
    document.getElementById("createReaderTextPanel").setAttribute("pasted", pastedData);
}

function imageCode(){
    const myTextarea = document.getElementById("createReaderTextPanel");
    const imgName = myTextarea.value.substring(myTextarea.selectionStart, myTextarea.selectionEnd);
    console.log(imgName);
    const newText = "<img src='readerimages/" + imgName + "' alt='an image' style='float: left; padding: 0 15px 15px 0'> ";
    myTextarea.setRangeText(newText);
}

