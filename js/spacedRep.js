var testList, doneList, wrongList;
var numPerSession = 2;
var randItems;// contains 4 or 6 items from which to choose for types 1 - 4

var soundRight = new buzz.sound("assets/sound/bells-1-half.mp3");
var soundWrong = new buzz.sound("assets/sound/saliva-2.mp3");
var soundFinished = new buzz.sound("assets/sound/perfect.mp3");

function test(list) {
    console.log("In test");
    console.log("list length is: " + list.length);
    testList = list;// all the elements for this date

    // printObject("testList 5", testList[5]);

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

    for (var q = 0; q < numPerSession; q++) {
        var rand = Math.floor(Math.random() * sizeArr);
        var myItem = testListtmp.splice(rand, 1)[0]; //removes items from the array testListtmp
        // printObject("from testListTmp, item to splice: " + JSON.stringify(myItem));
        // console.log(JSON.stringify(myItem));
        sessionList.push(myItem);
        sizeArr--;
    } //sessionList now contains numPerSession words to test

    testListtmp = null;
    console.log("sessionList contains " + sessionList.length + " items");

    sessionList.forEach(function (val, idx) {
            console.log("Item in sessionList - word: " + val.word + ", tranny: " + val.tranny + ",repnum: " + val.repnum);

            var idxToPlace = 0;
            switch (val.repnum) {
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
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 2:
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 3:
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 4:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 5:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 6:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    break;
                default:
                    randItems = makeRand4(val); //not sure about this!
                    if (val.EF > 2.5) {
                        htmlstr += makeQ(5, val);
                    } else {
                        if (val.EF < 1.5) {
                            idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                            htmlstrArray[idxToPlace] = makeQ(1, val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                            htmlstrArray[idxToPlace] = makeQ(2, val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                            htmlstrArray[idxToPlace] = makeQ(5, val);
                        } else {
                            idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                            htmlstrArray[idxToPlace] = makeQ(4, val);
                            idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                            htmlstrArray[idxToPlace] = makeQ(5, val);
                        }
                    }
            }
        }
    );
    $("section").not("#vocaTest").hide();
    console.log("Size of htmlstrArray is " + htmlstrArray.length);
    htmlstrArray.forEach(function (el, idx) {
        console.log("Appending the following string: " + el);
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
                returnStr += "<div class='gridItem'>" + rndVal.tranny + "</div>";
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 4: // English word shown, choose from 6 tranny
            returnStr = "<div class = 'testItem'><div class='wordToTest'>" + val.tranny + "</div>";
            console.log("randitems is: " + typeof randItems + ", size " + randItems.length);
            // randItems.forEach(function (rndVal, rndIdx) {
            //     returnStr += "<div class='grid6Word'>" + rndVal.word + "</div>";
            // });

            for (var boblo = 0; boblo < randItems.length; boblo++) {
                returnStr += "<div class='gridItem'>" + rndVal.word + "</div>";
            }


            returnStr += "</div>";
            return returnStr;
            break;
        case 5: // Typing
            return returnStr; //temporary!!!
            val.tranny = replaceApos(val.tranny);
            var htmlstr = "<div class='testItem' style='display:none;'><div class='testWord'>" + word + "</div><div class='inputAnswer'>" +
                "<input type='text' onkeydown='javascript: if(event.keyCode == 13) checkResult(event, \x22" + bobby + "\x22, this, " + idx;
            var bob = ")'/>";
            htmlstr += bob;
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
        wrongList.push(testList[index]);
        updateItem(false, index);
    }
    var $el = $(event.target).parent().hide();
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
                myEl.datenext = calcDateNext(2); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 7:
                myEl.datenext = calcDateNext(myEl.ef * 2); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 8:
                myEl.datenext = calcDateNext(myEl.ef * 4); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 9:
                myEl.datenext = calcDateNext(myEl.ef * 5); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 10:
                myEl.datenext = calcDateNext(MyEl.ef * 6); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 11:
                myEl.datenext = calcDateNext(MyEl.ef * 7); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            case 12:
                myEl.datenext = calcDateNext(MyEl.ef * 8); //I assume that the list was lwarned to perfection today!
                myEl.ef *= 1.2;
                break;
            default:
                myEl.datenext = calcDateNext(MyEl.ef * repnum);
                myEl.ef *= 1.2;
        }

    } else {
        switch (myEl.repnum) {

            case 6:
                alert("in case 6");
                myEl.ef *= .8;
                alert("ef is: " + myEl.ef);
                myEl.datenext = calcDateNext(0);
                myEl.repnum -=1;
                break;
            case 7:
                alert("in case 7");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=2;
                break;

            case 8:
                alert("in case 8");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=2;
                break;
            case 9:
                alert("in case 9");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=2;
                break;
            case 10:
                alert("in case 10");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=3;
                break;
            case 11:
                alert("in case 11");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=3;
                break;
            case 12:
                alert("in case 12");
                myEl.ef *= .8;
                myEl.datenext = calcDateNext(myEl.ef * 2);
                myEl.repnum -=4;
                break;
            default:
                myEl.datenext = calcDateNext(0);
        }
    }
    updateLLItem(myEl);
}

function updateLLItem(myLLItem) {
    myLLItem.datenext = myLLItem.datenext.getTime();

    printObject("check myLLItem's data before ajaxing via put",myLLItem);

    console.log(" wordid is type: " + typeof myLLItem.wordid + ", value: " + myLLItem.wordid);


    $.ajax({
        type: "POST",
        url: url + "/lladd/edit",
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: {
            "userid": 1,
            "word": myLLItem.word,
            "wordid": myLLItem.wordid,
            "tranny": myLLItem.tranny,
            "ef": myLLItem.ef,
            "datenext": myLLItem.datenext,
            "repnum": myLLItem.repnum
        },
        success: function(result){
            alert("success editing ll item");
        },
        error: function(jqXHR, status, err){
            alert("some problem: " + status + ", " + jqXHR.status + ", " + err);
        }
    });
}
