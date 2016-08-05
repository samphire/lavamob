var testList, doneList, wrongList;
var randItems;// contains 4 or 6 items from which to choose for types 1 - 4

var soundRight = new buzz.sound("assets/sound/bells-1-half.mp3");
var soundWrong = new buzz.sound("assets/sound/saliva-2.mp3");
var soundFinished = new buzz.sound("assets/sound/perfect.mp3");

function test(list) {
    testList = list;// all the elements for this date

    var testListtmp = testList;

    testListtmp.forEach(function (val, idx) {
        val.idxInTestList = idx; // add property to each object for when getting random 4 or 6 and need to retrieve the object being tested
    });
    var sessionList = new Array();
    var htmlstr;
    doneList = new Array();
    wrongList = new Array();
    var htmlstrArray = new Array(20);
    htmlstrArray.forEach(function (val, idx, arr) { // initialize the array with empty strings so as not to get error when printing the array
        arr[idx] = "";
    });

    //Choose 7 words from list
    // MAKE ROUTINE FOR CASE WHERE THERE ARE FEWER THAN 7 WORDS
    var sizeArr = testListtmp.length;
    for (var q = 0; q < 7; q++) {
        sessionList.push(testListtmp.splice(Math.floor(Math.random() * sizeArr), 1));
        sizeArr--;
    } //sessionList now contains 7 words to test
    testListtmp = null;

    sessionList.forEach(function (val, idx) {
            var idxToPlace = 0;
            switch (val.repnum) {
                case 1:
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 2:
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(2, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 3:
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(1, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 4:
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(3, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 4);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 5:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlstrArray, idxToPlace + 3);
                    htmlstrArray[idxToPlace] = makeQ(5, val);
                    break;
                case 6:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 7:
                    idxToPlace = findFirstEmptySlot(htmlstrArray, 0);
                    htmlstrArray[idxToPlace] = makeQ(4, val);
                    break;
                default:
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
    htmlstrArray.forEach(function (el, idx) {
        $("#vocaTest").append(el);
    });
    $("#vocaTest").show();
    $(".testItem:first-of-type").show().find(".inputAnswer input").focus();
}

function makeQ(type, val) {
    var returnStr;
    switch (type) {

        case 1: // Korean word shown, choose from 4 tranny
            returnStr = "<div class = 'testItem'><div class='wordItem'>" + val.word + "</div>";
            randItems.foreach(function (rndVal, rndIdx) {
                returnStr += "<div class='grid4Tran'>" + rndVal.tranny + "</div>";
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 2: // English word shown, choose from 4 tranny
            returnStr = "<div class = 'testItem'><div class='tranItem'>" + val.tranny + "</div>";
            randItems.foreach(function (rndVal, rndIdx) {
                returnStr += "<div class='grid4Word'>" + rndVal.word + "</div>";
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 3: // Korean word shown, choose from 6 tranny
            returnStr = "<div class = 'testItem'><div class='wordItem'>" + val.word + "</div>";
            randItems.foreach(function (rndVal, rndIdx) {
                returnStr += "<div class='grid6Tran'>" + rndVal.tranny + "</div>";
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 4: // English word shown, choose from 6 tranny
            returnStr = "<div class = 'testItem'><div class='tranItem'>" + val.tranny + "</div>";
            randItems.foreach(function (rndVal, rndIdx) {
                returnStr += "<div class='grid6Word'>" + rndVal.word + "</div>";
            });
            returnStr += "</div>";
            return returnStr;
            break;
        case 5: // Typing
            val.tranny = replaceApos(val.tranny);
            var htmlstr = "<div class='testItem' style='display:none;'><div class='testWord'>" + word + "</div><div class='inputAnswer'>" +
                "<input type='text' onkeydown='javascript: if(event.keyCode == 13) checkResult(event, \x22" + bobby + "\x22, this, " + idx;
            var bob = ")'/>";
            htmlstr += bob;
            return returnStr;
            break;
    }
}

function checkResult(event, tran, el, index) { // this is actually the main routine during the test
    event.preventDefault();
    event.stopImmediatePropagation();
    if (el.value === tran) {
        // soundRight.play();
        doneList.push(testList[index]);
        updateItem(true, index);
    } else {
        // soundWrong.play();
        wrongList.push(testList[index]);
        updateItem(false, index);
    }
    var $el = $(el).parent().parent().hide();
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

function calcDateNext(el, idx) {
    // alert(el.datenext + ": " + typeof el.datenext);
    var toAdd = el.datenext * 24 * 60 * 60 * 1000;
    var now = new Date().getTime();
    // alert(now);
    var newDateInMilliseconds = now + toAdd;
    // alert(newDateInMilliseconds);
    var newDateTemp = new Date(newDateInMilliseconds);
    // alert("newDateTemp is " + newDateTemp);
    newDateTemp.setHours(5);
    newDateTemp.setMinutes(0);

    alert("new newDateTemp is " + newDateTemp);
}

function updateItem(right, idx) {
    var myEl = testList[idx];
    if (right) {
        alert("yes");
        switch (myEl.repnum) {
            case 1:
                break;
        }
        myEl.repnum += 1
        testList[idx].ef
        testList[idx].datenext
    } else {
        alert("no");
        switch (myEl.repnum) {
            case 1:
                break;
            case 6:
                alert("in case 6");
                myEl.ef *= .8;
                alert("ef is: " + myEl.ef);
                myEl.datenext = myEl.ef; // datenext temporarily holds the number of days until next test
                alert("result of change is: " + myEl.datenext);
                break;
            case 7:
                alert("in case 7");
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;

            case 8:
                alert("in case 8");
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;
            case 9:
                alert("in case 9");
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;
            case 10:
                alert("in case 10");
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;
            case 11:
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;
            case 12:
                myEl.ef *= .8;
                myEl.datenext = myEl.ef * myEl.repnum - 5;
                break;
        }
    }
    myEl.repnum += 1;
    calcDateNext(myEl, idx);
    $.ajax({});
}
