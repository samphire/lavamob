var testList, doneList, wrongList;
var numPerSession = 7;
var randItems;// contains 4 or 6 items from which to choose for types 1 - 4

// var soundRight = new buzz.sound("assets/sound/bells-1-half.mp3");
// var soundWrong = new buzz.sound("assets/sound/saliva-2.mp3");
var soundRight = new buzz.sound("assets/sound/correct.mp3");
var soundWrong = new buzz.sound("assets/sound/wrong2.mp3");
var soundFinished = new buzz.sound("assets/sound/perfect.mp3");

function test(list) {
    console.log("In test");
    console.log("list length is: " + list.length);
    testList = list;// all the elements for this date

    var testListtmp = testList.slice(0);

    testListtmp.forEach(function (val, idx) {
        val.idxInTestList = idx; // add property to each object for when getting random 4 or 6 and need to retrieve the object being tested because random4 method uses splice and removes items from the array
    });

    var sessionList = [];
    var htmlstr;
    doneList = [];
    wrongList = [];
    var htmlstrArray = new Array(20);
    htmlstrArray.forEach(function (val, idx, arr) { // initialize the array with empty strings so as not to get error when printing the array
        arr[idx] = "";
    });

    // MAKE ROUTINE FOR CASE WHERE THERE ARE FEWER THAN 7 WORDS
    var sizeArr = testListtmp.length;

    console.log("Size of testListtmp is: " + sizeArr);

    for (var q = 0; q < numPerSession; q++) {
        console.log("In a for loop of size " + numPerSession);
        var rand = Math.floor(Math.random() * sizeArr);
        var myItem = testListtmp.splice(rand, 1)[0]; //removes items from the array testListtmp
        // printObject("from testListTmp, item to splice: " + JSON.stringify(myItem));
        // console.log(JSON.stringify(myItem));
        console.log("rand is " + rand + " and spliced item is " + myItem.word);
        sessionList.push(myItem);
        sizeArr--;
    } //sessionList now contains numPerSession words to test

    testListtmp = null;
    console.log("sessionList contains " + sessionList.length + " items");

    sessionList.forEach(function (val, idx) {
            console.log("Item in sessionList - word: " + val.word + ", tranny: " + val.tranny + ",repnum: " + val.repnum + ", ef: " + val.ef);

            var idxToPlace = 0;
            switch (val.repnum) {
                default:
                    // console.log("This is default in the switch statement");
                    console.log("In default. Word's repnum is " + val.repnum + " and ef is " + val.ef);
                    if (val.ef > 2.5) {
                        console.log("value of ef is greater than 2.5");
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                        htmlstrArray[idxToPlace] = makeQ(4, val);
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                        htmlstrArray[idxToPlace] = makeQ(5, val);
                    } else {
                        if (val.ef < 1.5) {
                            console.log("value of ef is less than 1.5");
                            randItems = makeRand4(val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                            htmlstrArray[idxToPlace] = makeQ(1, val);
                            randItems = makeRand4(val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                            htmlstrArray[idxToPlace] = makeQ(2, val);
                        } else {
                            console.log("value of ef is greater than 1.5 and less than 2.5");
                            randItems = makeRand6(val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                            htmlstrArray[idxToPlace] = makeQ(3, val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                            htmlstrArray[idxToPlace] = makeQ(4, val);
                        }
                    }
                    break;
                case 0:
                    console.log("repnum is zero");
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 1:
                    console.log("In case 1");
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    // console.log("about to make a type 2 question");
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    // console.log("about to make a type 5 question");
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 2:
                    console.log("In case 2");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 3:
                    console.log("In case 3");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 4:
                    console.log("In case 4");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 5:
                    console.log("In case 5");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 6:
                    console.log("In case 6");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 7:
                    console.log("In case 7");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 8:
                    console.log("In case 8");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
            }
        }
    );
    $("section").not("#vocaTest").hide(); //is this duplicating work of makeVocaTest()?
    console.log("Size of htmlstrArray is " + htmlstrArray.length);
    htmlstrArray.forEach(function (el, idx) {
        // console.log("Appending the following string: " + el);
        $("#vocaTest").append(el);
    });
    $("#vocaTest").show();
    $(".testItem:first-of-type").show().find(".inputAnswer input").focus();
}

function makeQ(type, val) {
    var returnStr;
    switch (type) {

        case 1: // Korean word shown, choose from 4 tranny
            returnStr = "<div class = 'testItem'><div class='wordToTest'>" + val.word + "</div>";
            randItems.forEach(function (rndVal) {
                if (rndVal.word === val.word) {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, true, " + val.idxInTestList + ")'>" + rndVal.tranny + "</div>";
                } else {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, false, " + val.idxInTestList + ")'>" + rndVal.tranny + "</div>";
                }
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 2: // English word shown, choose from 4 tranny
            returnStr = "<div class = 'testItem'><div class='wordToTest'>" + val.tranny + "</div>";
            randItems.forEach(function (rndVal) {
                if (rndVal.word === val.word) {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, true, " + val.idxInTestList + ")'>" + rndVal.word + "</div>";
                } else {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, false, " + val.idxInTestList + ")'>" + rndVal.word + "</div>";
                }
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 3: // Korean word shown, choose from 6 tranny
            returnStr = "<div class = 'testItem'><div class='wordToTest'>" + val.word + "</div>";
            randItems.forEach(function (rndVal) {
                if (rndVal.word === val.word) {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, true, " + val.idxInTestList + ")'>" + rndVal.tranny + "</div>";
                } else {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, false, " + val.idxInTestList + ")'>" + rndVal.tranny + "</div>";
                }
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 4: // English word shown, choose from 6 tranny
            returnStr = "<div class = 'testItem'><div class='wordToTest'>" + val.tranny + "</div>";
            randItems.forEach(function (rndVal) {
                if (rndVal.word === val.word) {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, true, " + val.idxInTestList + ")'>" + rndVal.word + "</div>";
                } else {
                    returnStr += "<div class='gridItem' onclick='checkResult(event, false, " + val.idxInTestList + ")'>" + rndVal.word + "</div>";
                }
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 5: // Typing
            // val.tranny = replaceApos(val.tranny);
            returnStr = "<div class='testItem'><div class='wordToTest'>" + val.tranny + "</div><div class='inputAnswer'>" +
                "<input class='typingInput' id='typingInput" + val.idxInTestList + "' type='text' onkeydown='if(event.keyCode == 13) " +
                "checkResult(event, document.getElementById(\"typingInput" + val.idxInTestList + "\").value == \"" + val.word + "\"?true:false, " + val.idxInTestList + ")'>";

            return returnStr;
            break;
    }
}

function checkResult(event, result, index) { // this is actually the main routine during the test
    event.preventDefault();
    event.stopImmediatePropagation();
    if (result) {
        // alert("right");
        soundRight.play();
        doneList.push(testList[index]);
        updateItem(true, index);
    } else {
        // alert("wrong");
        soundWrong.play();
        alert(testList[index].word + "\n" + testList[index].tranny);
        wrongList.push(testList[index]);
        updateItem(false, index);
    }
    var $el = $(event.target).parent().hasClass("testItem") ? $(event.target).parent() : $(event.target).parent().parent();
    $el.hide();
    // alert(($el).next().length);
    if ($el.next()[0] !== undefined) {
        $el.next().show().find(".inputAnswer input").focus();
    } else {
        endTest();
    }
}

function endTest() {
    $("section").not("#welcome").hide();
    $("#welcome").show();
    swal("End of Test\nYour score is " + Math.floor(doneList.length / (doneList.length + wrongList.length) * 100) + "%");
    $("#vocaTest").empty();
}

function calcDateNext(daysInterval) {
    var toAdd = daysInterval * 24 * 60 * 60 * 1000;
    var now = new Date().getTime();
    var newDateInMilliseconds = now + toAdd;
    var newDate = new Date(newDateInMilliseconds);
    newDate.setHours(5);
    newDate.setMinutes(0);
    console.log("New Date \(should be 5 in the morning\) is: " + newDate);
    return newDate;
}

function updateItem(right, idx) {
    var myEl = testList[idx];
    myEl.repnum += 1;
    console.log("updateItem");
    if (right) {

        switch (myEl.repnum) {
            case 1:
                myEl.datenext = calcDateNext(0);
                break;
            case 2:
                myEl.datenext = calcDateNext(0);
                break;
            case 3:
                myEl.datenext = calcDateNext(0);
                break;
            case 4:
                myEl.datenext = calcDateNext(0);
                break;
            case 5:
                myEl.datenext = calcDateNext(0);
                break;
            case 6:
                myEl.datenext = calcDateNext(2); //I assume that the list was learned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 7:
                myEl.datenext = calcDateNext(myEl.ef * 2); //I assume that the list was learned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 8:
                myEl.datenext = calcDateNext(myEl.ef * 4); //I assume that the list was learned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 9:
                myEl.datenext = calcDateNext(myEl.ef * 5); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 10:
                myEl.datenext = calcDateNext(myEl.ef * 6); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 11:
                myEl.datenext = calcDateNext(myEl.ef * 7); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 12:
                myEl.datenext = calcDateNext(myEl.ef * 8); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            default:
                myEl.datenext = calcDateNext(myEl.ef * myEl.repnum);
                myEl.ef *= 1.2;
        }

    } else {
        switch (myEl.repnum) {

            default:
                myEl.datenext = calcDateNext(0);
                break;
            case 6:
                // alert("in case 6");
                myEl.ef *= .8;
                alert("ef is: " + myEl.ef);
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 1;
                break;
            case 7:
                // alert("in case 7");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 2;
                break;

            case 8:
                // alert("in case 8");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 2;
                break;
            case 9:
                // alert("in case 9");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 2;
                break;
            case 10:
                // alert("in case 10");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 3;
                break;
            case 11:
                // alert("in case 11");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 3;
                break;
            case 12:
                // alert("in case 12");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum -= 4;
                break;
        }
    }
    updateLLItem(myEl);
}

function updateLLItem(myLLItem) {
    console.log("datenext is"  + myLLItem.datenext);
    myLLItem.datenext = myLLItem.datenext.getTime();
    console.log("datenext is"  + myLLItem.datenext);

    printObject("check myLLItem's data before ajaxing via put", myLLItem);

    console.log(" wordid is type: " + typeof myLLItem.wordid + ", value: " + myLLItem.wordid);


    $.ajax({
        type: "POST",
        url: url + "/lladd/edit",
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: {
            "userid": userid,
            "word": myLLItem.word,
            "wordid": myLLItem.wordid,
            "tranny": myLLItem.tranny,
            "ef": myLLItem.ef,
            "datenext": myLLItem.datenext,
            "repnum": myLLItem.repnum
        },
        success: function (result) {
            console.log("LearningList Item edited and uploaded successfully");
        },
        error: function (jqXHR, status, err) {
            alert("some problem: " + status + ", " + jqXHR.status + ", " + err);
        }
    });
}
