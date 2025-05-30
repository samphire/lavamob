/**
 * Created by matthew on 8/3/2016.
 */

function convertDateToNumber(date) {
    let t = date.split(/[- :]/);
    let datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
    return Date.parse(datestr); // milliseconds from jan 1st 1970
}

const speakWord = (theWord) => {
    const utter = new SpeechSynthesisUtterance(theWord);
    utter.lang = "en-GB";
    speechSynthesis.speak(utter);
}

// function treatImagesInCreateReader(arr) {
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] === '<img') {
//             arr[i] = arr[i] + '\u0020' + arr[i + 1];
//             arr[i + 1] = 'deleteMePlease';
//         }
//     }
//     return arr.filter(el => el !== 'deleteMePlease');
// }

// New helper function to process image tags
function treatImagesInCreateReader(textArr) {
    let newArr = [];
    let insideImg = false;
    let imgToken = "";
    for (let token of textArr) {
        // If we're not already building an image tag and we detect one
        if (!insideImg && token.startsWith("<img")) {
            insideImg = true;
            imgToken = token;
            // If this token already completes the tag, push it immediately
            if (token.endsWith(">")) {
                newArr.push(imgToken);
                insideImg = false;
                imgToken = "";
            }
        } else if (insideImg) {
            // Append token to the current image tag
            imgToken += " " + token;
            if (token.endsWith(">")) {
                newArr.push(imgToken);
                insideImg = false;
                imgToken = "";
            }
        } else {
            // Regular token; just push it
            newArr.push(token);
        }
    }
    return newArr;
}


function printObject(msg, obj) {
    let myStr = "";
    for (let prop in obj) {
        myStr += "\n\nProperty Name: " + prop + ", Value: " + obj[prop] + ", \tType: " + typeof obj[prop];
    }
    console.log("\n\n\n\n******* " + msg + " *******\n\n");
    console.log(myStr);
    console.log("\n\n******* " + msg + " ***END*\n\n\n\n");
}

function getCurrentTimezoneDate(date) { //returns date object
    // const offset = new Date().getTimezoneOffset();
    // const dateWithOffset = date.getTime() - offset * 60 * 1000;
    // let dateWithTimezone = new Date(dateWithOffset).toJSON().slice(0, 19).replace('T', ' ');
    // return new Date(dateWithTimezone);
    return date;
//TODO get rid of this method, just delete it. There are only two usags
    // This method is a joke. It is only used ONCE
    // It takes a perfectly good date object, changes its value according to timezone, then assumes that a new date object has 'T' in its value.

}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

function findFirstEmptySlot(arr, idx) {
    for (var x = idx; x < arr.length; x++) {
        if (typeof arr[x] === 'undefined') return x;
    }
}

function makeRand4(elem) {
    var tmpTestList = testList.slice(0);
    var returnArray = new Array(4);

    returnArray[0] = tmpTestList.splice(elem.idxInTestList, 1)[0];

    for (var b = 1; b < returnArray.length; b++) {
        returnArray[b] = tmpTestList.splice(Math.floor(Math.random() * tmpTestList.length), 1)[0];
    }
    return shuffle(returnArray);
}

function makeRand6(elem) {
    var tmpTestList = testList.slice(0);
    var returnArray = new Array(6);
    returnArray[0] = tmpTestList.splice(elem.idxInTestList, 1)[0];

    for (var b = 1; b < returnArray.length; b++) {
        returnArray[b] = tmpTestList.splice(Math.floor(Math.random() * tmpTestList.length), 1)[0];
    }
    return shuffle(returnArray);
}

function replaceApos(str) {
    return str.replace("'", "&apos;");
}

function replaceSpriteData(event) {
    var input = event.target;
    var audioSpriteString = "{";
    var reader = new FileReader();
    reader.onload = function () {
        var textArr = reader.result.split("\r\n");
        var previous;
        for (var bob = 0; bob < textArr.length; bob++) {
            var ss = textArr[bob].split("\t");

            var a = Math.floor(Number(ss[0]) * 1000);

            if (bob == textArr.length - 1) {
                var theString = "\"" + bob + "\":[" + previous + "," + 100000 + "]";
            } else {
                var theString = "\"" + bob + "\":[" + previous + "," + (a - previous) + "]";
            }
            previous = a;
            if (bob > 0) {
                audioSpriteString += theString + ",";
            }
        }
        audioSpriteString = audioSpriteString.slice(0, -1);
        audioSpriteString += "}";
        console.log(audioSpriteString);

        spriteObj = JSON.parse(audioSpriteString);

        if (!textToEdit) {
            alert("No text has been selected to edit");
            console.log("textToEdit is null or undefined:\n" + typeof textToEdit);
            return;
        } else {
            console.log("textToEdit is " + textToEdit + ":\n" + typeof textToEdit);
            console.log("type of spriteObj is " + typeof spriteObj + "\n" + JSON.stringify(spriteObj));
        }

        $.ajax({
            url: url + "/text/replaceSpriteData?textid=" + textToEdit,
            headers: {"userid": userid}, // header must be enabled in cors filter on server
            type: "POST",
            contentType: "text/plain",
            data: JSON.stringify(spriteObj),
            processData: false,
            crossDomain: true,
            success: function (data) {
                swal("done");
            },
            error: function () {
                alert("Problem Uploading Sprite Data");
            }
        });
    };
    reader.readAsText(input.files[0]);
}

function jaxy(myUrl, type, data, successMessage, errorMessage) {
    $.ajax({
        type: type,
        url: myUrl,
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: data,
        success: function (result) {
            console.log(successMessage);
        },
        error: function (jqXHR, status, err) {
            console.log(errorMessage + "\n" + status + ", " + jqXHR.status + ", " + err);
        }
    });
}

function removeFromDOM(id) {
    const myNodeList = document.querySelectorAll(".testItem:not(.visible)");
    myNodeList.forEach((node, idx, bob) => {
        if (node.dataset.idxintestlist === id.toString()) {
            console.warn("Removing child node");
            node.parentNode.removeChild(node);
        }
    })
}

function calcValForGoal(learned, learning, avgRepnum) {
    console.log("learned: " + learned + ", learning: " + learning + ", avgRepnum: " + avgRepnum);
    return Math.floor(parseInt(learned) + (parseInt(learning) * parseFloat(avgRepnum) * 0.1));
}

async function getExampleSentence(promptWord) {
    const response = await fetch(url2 + "/php/openai.php?word=" + promptWord,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const responseData = await response.text();
    const myResponse = JSON.parse(responseData);
    return myResponse.choices[0].message.content;
}

function makeWelcomeInfo(wordscore, _1k, _2k, _3k) {

    const needle1 = document.querySelector("svg._1k");
    const needle2 = document.querySelector("svg._2k");
    const needle3 = document.querySelector("svg._3k");

    const nums = document.querySelectorAll(".text .number");
    const percs = document.querySelectorAll(".text .percsign");


    const needle1Num = nums[0];
    const needle1Perc = percs[0];
    const needle2Num = nums[1];
    const needle2Perc = percs[1];
    const needle3Num = nums[2];
    const needle3Perc = percs[2];

    const info = document.querySelector(".info");

    document.getElementById('wordscore').innerText = wordscore;

    needle1.style.rotate = '-180deg';
    needle2.style.rotate = '-180deg';
    needle3.style.rotate = '-180deg';
    document.getElementById('_1kNumber').innerText = _1k;
    document.getElementById('_2kNumber').innerText = _2k;
    document.getElementById('_3kNumber').innerText = _3k;
    info.style.animationDelay = "2s";

    const makeRot = () => {
        needle1.style.rotate = _1k * 1.8 - 180 + 'deg';
        needle2.style.rotate = ((_2k * 1.8) - 180) + 'deg';
        needle3.style.rotate = ((_3k * 1.8) - 180) + 'deg';
        needle1Num.style.animation = "fadeIn 3s";
        needle1Perc.style.animation = "fadeIn 3s";
        needle1Num.style.opacity = '100%';
        needle1Perc.style.opacity = '100%';
        needle2Num.style.animation = "fadeIn 3s";
        needle2Perc.style.animation = "fadeIn 3s";
        needle2Num.style.opacity = '100%';
        needle2Perc.style.opacity = '100%';
        needle3Num.style.animation = "fadeIn 3s";
        needle3Perc.style.animation = "fadeIn 3s";
        needle3Num.style.opacity = '100%';
        needle3Perc.style.opacity = '100%';
    };
    setTimeout(makeRot, 1000);
}

function deepClean(obj) {
    const seen = new WeakSet();

    const replacer = value => {
        if (typeof value === 'string') {
            return value
                .replace(/[\u202f\u00a0\u200b\u200e\u200f]/g, ' ') // replace narrow space, nbsp, zero-width space, LRM, RLM with normal space
                .normalize('NFC'); // normalize to prevent split emoji/codepoints
        }
        return value;
    };

    const traverse = input => {
        if (input && typeof input === 'object') {
            if (seen.has(input)) return; // avoid circular reference
            seen.add(input);

            if (Array.isArray(input)) {
                for (let i = 0; i < input.length; i++) {
                    input[i] = traverse(input[i]);
                }
            } else {
                for (const key in input) {
                    if (input.hasOwnProperty(key)) {
                        input[key] = traverse(input[key]);
                    }
                }
            }
        } else {
            return replacer(input);
        }
        return input;
    };
    return traverse(structuredClone(obj)); // use structuredClone to avoid mutating original
}

function sanitizeForJSON(obj) {
    const replacer = (key, value) => {
        if (typeof value === 'string') {
            // Normalize Unicode, escape dangerous chars, trim invisible junk
            return value
                .normalize('NFC')
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')   // Remove control chars
                .replace(/[\uD800-\uDFFF]/g, '')               // Strip unpaired surrogates
                .replace(/\\/g, '\\\\')                        // Escape backslashes
                .replace(/"/g, '\\"');                         // Escape double quotes
        }
        return value;
    };
    return JSON.stringify(obj, replacer);
}
