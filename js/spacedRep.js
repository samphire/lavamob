var testList, doneList, wrongList;
var numPerSession = 7;
var randItems;// contains 4 or 6 items from which to choose for types 1 - 4

var soundRight = new buzz.sound("assets/sound/correct.mp3");
var soundWrong = new buzz.sound("assets/sound/wrong2.mp3");
var soundFinished = new buzz.sound("assets/sound/perfect.mp3");
var currentVocabIndex = 0;  //global variable to be used by functions in vocab test. corresponds to the index of the item in testList array, which is a whole json object representing the entirety of the database table fields.

function test(list) {
    // console.log("In test");
    // console.log("list length is: " + list.length);
    testList = list;// all the elements for this date

    let testListtmp = testList.slice(0);

    testListtmp.forEach(function (val, idx) {
        val.idxInTestList = idx; // add property to each object for when getting random 4 or 6 and need to retrieve the object being tested because random4 method uses splice and removes items from the array
    });

    var sessionList = [];
    let htmlstr;
    doneList = [];
    wrongList = [];
    var htmlstrArray = new Array(20);
    htmlstrArray.forEach(function (val, idx, arr) { // initialize the array with empty strings so as not to get error when printing the array
        arr[idx] = "";
    });

    // MAKE ROUTINE FOR CASE WHERE THERE ARE FEWER THAN 7 WORDS
    var sizeArr = testListtmp.length;

    for (var q = 0; q < numPerSession; q++) {
        var rand = Math.floor(Math.random() * sizeArr);
        var myItem = testListtmp.splice(rand, 1)[0]; //removes items from the array testListtmp
        sessionList.push(myItem);
        sizeArr--;
    } //sessionList now contains numPerSession words to test

    testListtmp = null;

    sessionList.forEach(function (val, idx) {

            if (idx == 0) {
                currentVocabIndex = val.idxInTestList;
            }

            var idxToPlace = 0;
            switch (val.repnum) {
                default:
                    console.log("This is default in the switch statement");
                    if (val.EF > 2.5) {
                        console.log("value of ef is greater than 2.5");
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                        htmlstrArray[idxToPlace] = makeQ(4, val);
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                        htmlstrArray[idxToPlace] = makeQ(5, val);
                    } else {
                        if (val.EF < 1.5) {
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
                    // console.log("repnum is zero");
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 1:
                    // console.log("In case 1");
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    // console.log("about to make a type 2 question");
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    // // console.log("about to make a type 5 question");
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 2:
                    // console.log("In case 2");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 3:
                    // console.log("In case 3");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 4:
                    // console.log("In case 4");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 5:
                    // console.log("In case 5");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 6:
                    // console.log("In case 6");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 7:
                    // console.log("In case 7");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    // idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    // htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 8:
                    // console.log("In case 8");
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
    // console.log("Size of htmlstrArray is " + htmlstrArray.length);
    htmlstrArray.forEach(function (el, idx) {
        // console.log("Appending the following string: " + el + "\n\nat index " + el.idxInTestList + "\n\n");
        $("#vocaTest").append(el);
    });

    $('#vocaTest').append("<div id='testItemActions'><img id='redbutton' src='assets/img/icons/redbutton.png' onclick='$(\".slidey\").toggleClass(\"slidey-active\")'>" +
        "<div class='slidey'>" +
        "<img src='assets/img/icons/emoticons/hard.png' onclick='manageLL(1)'>" +
        "<img src='assets/img/icons/emoticons/easy.png' onclick='manageLL(2)'>" +
        "<img src='assets/img/icons/emoticons/learned.png' onclick='manageLL(3)'>" +
        "<img src='assets/img/icons/emoticons/getlost.png' onclick='manageLL(4)'>" +
        "<img src='assets/img/icons/emoticons/visittext.png' onclick='manageLL(5)'>" +
        "</div></div>");
    $("#vocaTest").show();
    $(".testItem:first-of-type").toggleClass("visible").find(".inputAnswer input").focus();
}

function manageLL(type) {
    switch (type) {
        case 1:
            alert("type 1");
            break;
        case 2:
            alert("type 2");
            break;
        case 3:
            alert("type 3");
            delLLItem(testList[currentVocabIndex], "" + 3);
            break;
        case 4:
            alert("type 4");
            delLLItem(testList[currentVocabIndex], 4 + "");
            break;
        case 5:
            alert("type 5");
            break;
    }
    $(".slidey.slidey-active").toggleClass("slidey-active");
    var $el = $(".testItem.visible");
    $el.toggleClass("visible");
    if ($el.next()[0] !== undefined) {
        $el.next().show().find(".inputAnswer input").focus();
        currentVocabIndex = $el.next()[0].dataset.idxintestlist;
    }
}


function makeQ(type, val) {
    var returnStr;
    switch (type) {

        case 1: // Korean word shown, choose from 4 tranny
            returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class='wordToTest'>" + val.word + "</div>";
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
            returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class='wordToTest'>" + val.tranny + "</div>";
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
            returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class='wordToTest'>" + val.word + "</div>";
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
            returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class='wordToTest'>" + val.tranny + "</div>";
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
            returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class='wordToTest'>" + val.tranny + "</div><div class='inputAnswer'>" +
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
    // $el.hide();
    // alert(($el).next().length);
    $el.toggleClass("visible");
    if ($el.next()[0] !== undefined && $el.next()[0].id != "testItemActions") {
        $el.next().toggleClass("visible").find(".inputAnswer input").focus();
        currentVocabIndex = $el.next()[0].dataset.idxintestlist;
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
    // console.log("New Date \(should be 5 in the morning\) is: " + newDate);
    const mySQLDate = newDate.toJSON().slice(0, 19).replace('T', ' ')
    console.log(mySQLDate);
    return mySQLDate;
}

function updateItem(right, idx) {
    let myEl = testList[idx];
    // console.log("updateItem: " + printObject("before updating", testList[idx]));
    myEl.repnum += 1;
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
                myEl.EF *= 1.1;
                break;
            case 7:
                myEl.datenext = calcDateNext(myEl.EF); //I assume that the list was learned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 8:
                myEl.datenext = calcDateNext(myEl.EF); //I assume that the list was learned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 9:
                myEl.datenext = calcDateNext(myEl.EF); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 10:
                myEl.datenext = calcDateNext(myEl.EF * 1.2); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 11:
                myEl.datenext = calcDateNext(myEl.EF * 1.5); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 12:
                myEl.datenext = calcDateNext(myEl.EF * 1.5); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            default:
                myEl.datenext = calcDateNext(myEl.EF * myEl.repnum);
                myEl.EF *= 1.1;
        }

    } else {
        switch (myEl.repnum) {

            default:
                myEl.datenext = calcDateNext(0);
                break;
            case 6:
                // alert("in case 6");
                // myEl.EF *= .6;
                alert("ef is: " + myEl.EF);
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 1;
                break;
            case 7:
                // alert("in case 7");
                // myEl.EF *= .6;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 2;
                break;

            case 8:
                // alert("in case 8");
                myEl.EF *= .9;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 2;
                break;
            case 9:
                // alert("in case 9");
                myEl.EF *= .8;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 3;
                break;
            case 10:
                // alert("in case 10");
                myEl.EF *= .7;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 4;
                break;
            case 11:
                // alert("in case 11");
                myEl.EF *= .6;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 6;
                break;
            case 12:
                // alert("in case 12");
                myEl.EF *= .5;
                myEl.datenext = calcDateNext(0);
                myEl.repnum = 6;
                break;
        }
    }
    updateLLItem(myEl);
}

function updateLLItem(myLLItem) {
    // console.log("datenext is" + myLLItem.datenext);
    // myLLItem.datenext = myLLItem.datenext.getTime();
    // console.log("datenext is" + myLLItem.datenext);
    // printObject("check myLLItem's data before ajaxing via post", myLLItem);
    // console.log(" wordid is type: " + typeof myLLItem.wordid + ", value: " + myLLItem.wordid);

    // console.warn("EF is " + myLLItem.EF);
    // console.warn("datenext is " + myLLItem.datenext);

    $.ajax({
        type: "POST",
        url: url2 + "/php/llEdit.php",
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: {
            "userid": userid,
            "wordid": myLLItem.wordid,
            "ef": myLLItem.EF,
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

function delLLItem(myLLItem, type) {

    printObject("LLItem to delete", myLLItem);
    console.log("Type of deletion is: " + type);
    console.log("type is type " + typeof type);
    console.log(" wordid is type: " + typeof myLLItem.wordid + ", value: " + myLLItem.wordid);

    myLLItem.headwordid = 6;


    $.ajax({
        type: "DELETE",
        url: url + "/lladd?userid=" + userid + "&wordid=" + myLLItem.wordid +
            "&headwordid=" + myLLItem.headwordid + "&type=" + type,
        crossDomain: true,
        success: function (result) {
            console.log("LearningList Item removed successfully");
        },
        error: function (jqXHR, status, err) {
            alert("some problem: " + status + ", " + jqXHR.status + ", " + err);
        }
    });
}
