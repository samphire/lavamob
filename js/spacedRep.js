let testList, doneList, wrongList;
// const numPerSession = 7;
const numPerSession = 5;
// const flashCardsToInclude = 5;
const flashCardsToInclude = 3;
let randItems;// contains 4 or 6 items from which to choose for types 1 - 4

const soundRight = new buzz.sound("assets/sound/correct.mp3");
const soundWrong = new buzz.sound("assets/sound/wrong2.mp3");
const soundFinished = new buzz.sound("assets/sound/perfect.mp3");
let currentVocabIndex = 0;  //global variable to be used by functions in vocab test. corresponds to the index of the item in testList array, which is a whole json object representing the entirety of the database table fields.

function test(list) {
    testList = list;// all the elements for this date

    let testListtmp = testList.slice(0);

    testListtmp.forEach(function (val, idx) {
        val.idxInTestList = idx; // add property to each object for when getting random 4 or 6 and need to retrieve the object being tested because random4 method uses splice and removes items from the array
    });

    let sessionList = [];
    doneList = [];
    wrongList = [];
    let htmlStrArray = new Array(64);
    htmlStrArray.forEach(function (val, idx, arr) { // initialize the array with empty strings so as not to get error when printing the array
        arr[idx] = "";
    });

    // TODO  MAKE ROUTINE FOR CASE WHERE THERE ARE FEWER THAN 7 WORDS

    const flashCardList = testListtmp.filter((val) => val.repnum === 0);
    const nonFlashCardList = testListtmp.filter((val) => val.repnum !== 0);

    const flashCardLimit = flashCardList.length < flashCardsToInclude ? flashCardList.length : flashCardsToInclude;
    console.log("Limit of flash cards is " + flashCardLimit);

    for (let i = 0; i < flashCardLimit; i++) { // Add flashCardsToInclude flashcards chosen at random
        let rand = Math.floor(Math.random() * flashCardList.length);
        sessionList.push(flashCardList.splice(rand, 1)[0]);
    }

    for (let q = 0; q < numPerSession; q++) {
        let rand = Math.floor(Math.random() * nonFlashCardList.length);
        if (nonFlashCardList.length > 0) {
            sessionList.push(nonFlashCardList.splice(rand, 1)[0]);
        }
    } //sessionList now contains flashCardsToInclude plus numPerSession words to test

    console.log("Size of sessionList is now " + sessionList.length);
    console.log("start to print sessionList");
    console.log(sessionList);
    console.log("end of sessionList");

    sessionList.forEach(function (val, idx) {
            console.log("in sessionList.foreach...");
            if (idx === 0) {
                currentVocabIndex = val.idxInTestList;
            }
            let idxToPlace = 0;
            console.log(val);
            switch (val.repnum) {
                default:
                    console.log("This is default in the switch statement");
                    if (val.EF > 2.5) {
                        console.log("value of ef is greater than 2.5");
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                        htmlStrArray[idxToPlace] = makeQ(4, val);
                        randItems = makeRand6(val);
                        idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                        htmlStrArray[idxToPlace] = makeQ(5, val);
                    } else {
                        if (val.EF < 1.5) {
                            console.log("value of ef is less than 1.5");
                            idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                            htmlStrArray[idxToPlace] = makeFlashCard(val);
                            randItems = makeRand4(val);
                            idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                            htmlStrArray[idxToPlace] = makeQ(1, val);
                            randItems = makeRand4(val);
                            idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 5);
                            htmlStrArray[idxToPlace] = makeQ(2, val);
                        } else {
                            console.log("value of ef is greater than 1.5 and less than 2.5");
                            idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                            htmlStrArray[idxToPlace] = makeFlashCard(val);
                            randItems = makeRand6(val);
                            idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                            htmlStrArray[idxToPlace] = makeQ(3, val);
                            idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 5);
                            htmlStrArray[idxToPlace] = makeQ(4, val);
                        }
                    }
                    break;

                case 0:
                    console.log("in case 0");
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeFlashCard(val);
                    break;

                case 1:
                    console.log("In case 1");
                    randItems = makeRand4(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    // console.log("about to make a type 2 question");
                    htmlStrArray[idxToPlace] = makeQ(2, val);
                    break;
                case 2:
                    console.log("In case 2");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(1, val);
                    break;
                case 3:
                    console.log("In case 3");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 4:
                    // console.log("In case 4");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 5:
                    // console.log("In case 5");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 6:
                    // console.log("In case 6");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 7:
                    // console.log("In case 7");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    break;
                case 8:
                    // console.log("In case 8");
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, 0);
                    htmlStrArray[idxToPlace] = makeQ(3, val);
                    randItems = makeRand6(val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 3);
                    htmlStrArray[idxToPlace] = makeQ(4, val);
                    idxToPlace = findFirstEmptySlot(htmlStrArray, idxToPlace + 4);
                    htmlStrArray[idxToPlace] = makeQ(5, val);
                    break;
            }
        }
    );
    $("section").not("#vocaTest").hide(); //is this duplicating work of makeVocaTest()?
    htmlStrArray.forEach(function (el, idx) {
        $("#vocaTest").append(el);
    });

    $('#vocaTest').append("<div id='testItemActions' data-curIdx='0'><img id='redbutton' src='assets/img/icons/redbutton.png' onclick='$(\".slidey\").toggleClass(\"slidey-active\");document.querySelector(\"#testItemActions\").dataset.curIdx=currentVocabIndex'>" +
        "<div class='slidey'>" +
        "<span data-tooltip='mark as `difficult` item'><img src='assets/img/icons/emoticons/hard.png' onclick='manageLL(1)'></span>" +
        "<span data-tooltip='mark as `easy` item'><img src='assets/img/icons/emoticons/easy.png' onclick='manageLL(2)'></span>" +
        "<span data-tooltip='remove from test list and add to learned list'><img src='assets/img/icons/emoticons/learned.png' onclick='manageLL(3)'></span>" +
        "<span data-tooltip='just remove from test list'><img src='assets/img/icons/emoticons/getlost.png' onclick='manageLL(4)'></span>" +
        "<span data-tooltip='I want to study this word'><img src='assets/img/icons/emoticons/visittext.png' onclick='manageLL(5)'></span>" +
        "</div></div>");
    $("#vocaTest").show();
    $(".testItem:first-of-type").toggleClass("visible").find(".inputAnswer input").focus();
}

async function manageLL(type) {
    let myEl = testList[currentVocabIndex];
    console.log(myEl);
    let $el = $(".testItem.visible");
    switch (type) {
        case 1: // hard... lower the repnum and the EF
            swal("EF changed from " + Math.round(myEl.EF * 10) / 10 + " to " + Math.round((myEl.EF / .2)) / 10 + " and repnum from " + myEl.repnum + " to " + Math.ceil(myEl.repnum / 2));
            myEl.EF = myEl.EF / 2;
            myEl.repnum = Math.ceil(myEl.repnum / 2);
            break;
        case 2: // easy... increase the EF
            swal("EF changed from " + Math.round(myEl.EF * 10) / 10 + " to " + Math.round((myEl.EF * 20)) / 10 + " and repnum from " + myEl.repnum + " to " + (myEl.repnum + 2));
            myEl.EF = myEl.EF * 2;
            myEl.repnum += 2;
            break;
        case 3:
            swal(myEl.word + " has been deleted from the test system and added to the 'learned' list");
            removeFromDOM(currentVocabIndex);
            deleteAndAdd(myEl);
            goToNext($el);
            break;
        case 4:
            swal(myEl.word + " has been removed from the test list");
            removeFromDOM(currentVocabIndex);
            deleteLLItem(myEl);
            goToNext($el);
            break;
        case 5: // AI example sentences
            const aiResponse = await getExampleSentence(myEl.word);
            swal(aiResponse);
            break;
    }
    $(".slidey.slidey-active").toggleClass("slidey-active");
    // goToNext($el);
}

function makeFlashCard(val) {
    let returnStr;
    returnStr = "<div class = 'testItem' data-idxintestlist='" + val.idxInTestList + "'><div class = 'card'><div class = 'card__inner' onclick='classList.toggle(\"is-flipped\")'><div class = 'card__face card__face--front'><h2>"
        + val.word + "</h2></div><div class='card__face card__face--back'><h2>" + val.tranny + "</h2></div></div></div>";

    returnStr += "<div class='buttonDiv'><button class='btn btn-know' onclick='flashy(true, " + val.idxInTestList + ")'>I know it!</button><button class='btn btn-dunno' onclick='flashy(false, " + val.idxInTestList + ")'>I don't know...</button></div></div>";
    return returnStr;
}

function flashy(result, index) {
    if (result) {
        doneList.push(testList[index]);
    } else {
        wrongList.push(testList[index]);
    }

    let $el = $(event.target).parent().hasClass("testItem") ? $(event.target).parent() : $(event.target).parent().parent();
    $el.toggleClass("visible");
    if ($el.next()[0] !== undefined && $el.next()[0].id !== "testItemActions") {
        $el.next().toggleClass("visible").find(".inputAnswer input").focus();
        currentVocabIndex = $el.next()[0].dataset.idxintestlist;
    } else {
        endTest();
    }
}

function makeQ(type, val) {
    let returnStr;
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

function goToNext($el) {
    $el.toggleClass("visible");
    if ($el.next()[0] !== undefined && $el.next()[0].id !== "testItemActions") {
        $el.next().toggleClass("visible").find(".inputAnswer input").focus();
        currentVocabIndex = $el.next()[0].dataset.idxintestlist;
    } else {
        endTest();
    }
}

function checkResult(event, result, index) { // this is actually the main routine during the test
    event.preventDefault();
    event.stopImmediatePropagation();
    if (result) {
        soundRight.play();
        doneList.push(testList[index]);
    } else {
        soundWrong.play();
        alert(testList[index].word + "\n" + testList[index].tranny);
        wrongList.push(testList[index]);
    }
    let $el = $(event.target).parent().hasClass("testItem") ? $(event.target).parent() : $(event.target).parent().parent();
    goToNext($el);
}

function endTest() {
    console.log("##### in endTest() #####")

    // deduplicate lists
    doneList = [...new Set(doneList)];
    wrongList = [...new Set(wrongList)];

    console.log("##### Done List #####");
    console.log(doneList);
    console.log("##### Wrong List #####");
    console.log(wrongList);

    doneList.forEach((val, idx) => {
        updateItem(true, val.idxInTestList)
    })

    wrongList.forEach((val, idx) => {
        updateItem(false, val.idxInTestList)
    })

    console.log("All processing for end of Test Vocabulary is finished. Here is the nowList for you to check that previous items are not included");
    console.log(nowList);

    $("section").not("#welcome").hide();
    $("#welcome").show();
    swal("End of Test\nYour score is " + Math.floor(doneList.length / (doneList.length + wrongList.length) * 100) + "%");
    $("#vocaTest").empty();
    updateWordscore();
}

function calcDateNext(daysInterval) { //returns a MySQL date string for use in MySQL queries
    if (daysInterval > 9) {
        const oldInterval = daysInterval;
        const randy = Math.random() * daysInterval / 5;
        daysInterval = daysInterval - daysInterval / 10 + randy;
    }
    let toAdd = daysInterval * 24 * 60 * 60 * 1000; // convert to milliseconds
    const todaySQLDate = getCurrentTimezoneDate(new Date()); // converts today's date to include timezone offset
    let nowms = todaySQLDate.getTime(); // converts to milliseconds
    let newDateInMilliseconds = nowms + toAdd; // adds the interval
    let newDate = new Date(newDateInMilliseconds); // converts from milliseconds to date object
    newDate.setHours(5);
    newDate.setMinutes(0);

    return newDate.getFullYear() + "-" + (newDate.getMonth() + 1).toString().padStart(2, '0') + "-"
        + newDate.getDate().toString().padStart(2, '0') + " " + newDate.getHours().toString().padStart(2, '0') + ":"
        + newDate.getMinutes().toString().padStart(2, '0') + ":" + newDate.getSeconds().toString().padStart(2, '0');
}

function updateItem(right, idx) {

    // remove item from nowList

    nowList = nowList.filter((el) => el.idxInTestList != idx);

    let myEl = testList[idx];
    // console.log("updateItem: " + printObject("before updating", testList[idx]));
    console.log("in updateItem. word is " + myEl.word + "\nrepnum is " + myEl.repnum + ", which will be incremented IF right");

    if (right) {
        myEl.repnum += 1;

        switch (myEl.repnum) {
            case 1:
                myEl.EF *= 1.1;
                myEl.datenext = calcDateNext(0);
                break;
            case 2:
                myEl.EF *= 1.1;
                myEl.datenext = calcDateNext(0);
                break;
            case 3:
                myEl.EF *= 1.1;
                myEl.datenext = calcDateNext(1); //I assume that the list was learned to perfection today!
                break;
            case 4:
                myEl.datenext = calcDateNext(myEl.EF); //I assume that the list was learned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 5:
                myEl.EF *= 1.1;
                myEl.datenext = calcDateNext(myEl.EF + 1); //I assume that the list was learned to perfection today!
                break;
            case 6:
                myEl.EF *= 1.1;
                myEl.datenext = calcDateNext(myEl.EF * 2); //I assume that the list was lwarned to perfection today!
                break;
            case 7:
                myEl.datenext = calcDateNext(myEl.EF * 3); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 8:
                myEl.datenext = calcDateNext(myEl.EF * 4.5); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            case 9:
                myEl.datenext = calcDateNext(myEl.EF * 7); //I assume that the list was lwarned to perfection today!
                myEl.EF *= 1.1;
                break;
            default:
                myEl.datenext = calcDateNext(myEl.EF * myEl.repnum);
                myEl.EF *= 1.1;
        }

    } else {
        switch (myEl.repnum) {

            default:
                myEl.repnum /= 2;
                myEl.EF /= 2;
                myEl.datenext = calcDateNext(0);
                break;
            case 0:
            case 1:
            case 2:
            case 3:
                myEl.repnum = 0;
                myEl.EF = 2;
                myEl.datenext = calcDateNext(0);
                break;
            case 4:
            case 5:
                myEl.repnum = 3;
                myEl.datenext = calcDateNext(0);
                break;
            case 6:
                myEl.repnum = 4;
                myEl.datenext = calcDateNext(0);
                break;
            case 7:
                myEl.repnum = 4;
                myEl.datenext = calcDateNext(0);
                break;

            case 8:
                myEl.EF *= .9;
                myEl.repnum = 4;
                myEl.datenext = calcDateNext(0);
                break;
            case 9:
                myEl.EF *= .8;
                myEl.repnum = 5;
                myEl.datenext = calcDateNext(0);
                break;
            case 10:
                myEl.EF *= .7;
                myEl.repnum = 6;
                myEl.datenext = calcDateNext(0);
                break;
            case 11:
                myEl.EF *= .6;
                myEl.repnum = 7;
                myEl.datenext = calcDateNext(0);
                break;
            case 12:
                myEl.EF *= .5;
                myEl.repnum = 8;
                myEl.datenext = calcDateNext(0);
                break;
        }
    }
    updateLLItem(myEl);
}

function updateLLItem(myLLItem) {
    console.log("in updateLLItem");
    printObject("printing LLItem before post", myLLItem);
    console.warn("datenext is " + myLLItem.datenext);

    jaxy(url2 + "/php/llEdit.php", "POST",
        {
            "userid": userid,
            "wordid": myLLItem.wordid,
            "ef": myLLItem.EF,
            "datenext": myLLItem.datenext,
            "repnum": myLLItem.repnum
        },
        "Learning List Item successfully updated",
        "Problem updating Learning List Item"
    );
}

function deleteLLItem(myLLItem) {
    jaxy(url2 + "/php/llDelete.php", "POST",
        {
            "userid": userid,
            "wordid": myLLItem.wordid
        },
        "Learning List Item successfully deleted",
        "Problem deleting learning list item"
    );
}

function deleteAndAdd(myLLItem) {
    jaxy(url2 + "/php/llDeleteAndAdd.php", "POST",
        {
            "userid": userid,
            "wordid": myLLItem.wordid,
            "headwordid": myLLItem.headwordid,
            "repnum": myLLItem.repnum
        },
        "learning list item successfully deleted and added to learned list",
        "problem deleting and adding learning list item"
    );
}

// function delLLItem(myLLItem, type) { // This appears to require web service, which is no longer operational!!!
//
//     printObject("LLItem to delete", myLLItem);
//     console.log("Type of deletion is: " + type);
//     console.log("type is type " + typeof type);
//     console.log(" wordid is type: " + typeof myLLItem.wordid + ", value: " + myLLItem.wordid);
//
//     myLLItem.headwordid = 6;
//
//
//     $.ajax({
//         type: "DELETE",
//         url: url + "/lladd?userid=" + userid + "&wordid=" + myLLItem.wordid +
//             "&headwordid=" + myLLItem.headwordid + "&type=" + type,
//         crossDomain: true,
//         success: function (result) {
//             console.log("LearningList Item removed successfully");
//         },
//         error: function (jqXHR, status, err) {
//             alert("some problem: " + status + ", " + jqXHR.status + ", " + err);
//         }
//     });
// }
