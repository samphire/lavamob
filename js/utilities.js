/**
 * Created by matthew on 8/3/2016.
 */
function convertDateToNumber(date) {
    let t = date.split(/[- :]/);
    let datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
    return Date.parse(datestr); // milliseconds from jan 1st 1970
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
