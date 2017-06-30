/**
 * Created by matthew on 8/3/2016.
 */
function convertDateToNumber(date) {
    var t = date.split(/[- :]/);
    var datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
    return Date.parse(datestr); // milliseconds from jan 1st 1970
}

function printObject(msg, obj) {
    var myStr = "";
    for (prop in obj) {
        myStr += "\n\nProperty Name: " + prop + ", Value: " + obj[prop] + ", Type: " + typeof obj[prop] + "\n";
    }
    console.log("\n\n\n\n******* " + msg + " *******\n\n");
    console.log(myStr);
    console.log("\n\n******* " + msg + " ***END*\n\n\n\n");
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
    };
    reader.readAsText(input.files[0]);
}