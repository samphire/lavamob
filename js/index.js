/**
 * Created by matthew on 7/28/2016.
 */

var readers;
var userid = 0;
let group = 0;
let username;
let wordScore;
var language;
var dicurl;
var goals;
var selectedTextid;
var selectedReaderObj;
var selectedReaderText;
let llData, nowList; //llData is all learninglist data. nowlist is the subset that is available at this date.
var naverPopup;
var howlSpriteObj;
var howl;
var naverPre = "http://m.endic.naver.com/search.nhn?query=";
var naverPost = "&searchOption=mean";
var readerYScroll = 0;
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions'; // Replace with the appropriate API endpoint

let reconstHyphenWord;
const realWordRegex1 = /^[a-zA-Z]+$/;
const hyphenWordRegex1 = /-/;

function login() {
    history.replaceState({page_id: 4, page: "welcome"}, null, "/lavamob");
    console.log("In login()");
    var urly = url2 + "/login.php?user_email=" + document.getElementById("userEmail").value + "&pass_word=" + document.getElementById("pass").value;
    console.log(urly);
    //alert(urly);
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: urly,
        async: false,
        success: function (data) {
            console.log("LOGIN: " + data);
            //alert("success");
            if (data == "fail login") {
                alert("username or password is incorrect");
                localStorage.clear();
                return;
            }
            const myData = JSON.parse(data);
            userid = myData[0];
            language = myData[1];
            group = myData[2];
            username = myData[3];
            localStorage.setItem("userEmail", document.getElementById("userEmail").value);
            localStorage.setItem("userid", userid);
            localStorage.setItem("language", language);
            localStorage.setItem("group", group);
            localStorage.setItem("username", username);

            console.log(localStorage);

            $(".login").hide();
            // document.getElementById('showusername').innerText = localStorage.getItem('username');
            document.getElementById('showusername').innerText = "user: " + username;
            console.log("username is " + username);
            $("#welcome").show();
            $("#menu").show();
            getReaderInfo();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("some problem with ajax login");
            //alert("fail");
            console.log(urly);
            console.log(textStatus + "\n" + errorThrown);
            alert(textStatus + "\n" + errorThrown);
        }
    });
}

function progress(percent, $element, boolAnimColor, col) {
    percent = percent > 100 ? 100 : percent;
    if (percent === 100) col = "#000000";
    let progressBarWidth = Math.floor(percent * $element.width() / 100);
    // $element.find('div').animate({width: progressBarWidth}, 500).html(percent + "%");
    $element.find('div').animate({width: progressBarWidth}, 500);
    if (boolAnimColor) $element.find('div').animate({backgroundColor: col}, 1800);
}

function getGoalsInfo() { // the returned object contains avg repnum and learned and learning count
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url2 + "/php/goals.php?userid=" + userid
    }).done(function (resultjson) {
            goals = JSON.parse(resultjson);
            console.log("resultjson from goals.php" + resultjson);
            let wordScore = 0;

            if (goals[0].goal_name !== 'blank') {

                const goalPlate = document.querySelector('#goalTemplate');
                for (let i = 0; i < goals.length; i++) {
                    let goalData = goals[i];
                    // Value of learned and learning combined
                    wordScore = calcValForGoal(goalData.learned, goalData.learning, goalData.avgRepnum);
                    let clone = goalPlate.content.cloneNode(true);
                    clone.querySelector('.goalName').textContent = goalData.goal_name;
                    clone.querySelector('.goalDescription').textContent = goalData.goal_description;
                    clone.querySelector('.startDate').textContent = "start: " + goalData.start_date;
                    clone.querySelector('.endDate').textContent = "end: " + goalData.end_date;

                    // Date value
                    const day = 1000 * 60 * 60 * 24;
                    const now = new Date();
                    const startDate = new Date(goalData.start_date);
                    const endDate = new Date(goalData.end_date);
                    const diff = Math.ceil((endDate - startDate) / day);
                    const timeProg = Math.ceil((((now - startDate) / day) / diff) * 100);

                    // Progress value
                    const range = goalData.unit_target_value - goalData.unit_start_value;
                    const valProg = Math.ceil((wordScore - goalData.unit_start_value) / range * 100);

                    // Colors
                    let col;
                    let percGood = valProg / timeProg;
                    if (percGood > 1.2) col = "#44ff4b";
                    if (percGood < 1.2) col = "#abce39";
                    if (percGood < 1.05) col = "#cecb39";
                    if (percGood < 0.9) col = "#ce9c39";
                    if (percGood < 0.75) col = "#ce3939";

                    const prog1 = clone.querySelector('.progressBar1');
                    const prog2 = clone.querySelector('.progressBar2');
                    goalPlate.parentNode.appendChild(clone);
                    progress(valProg, $(prog1), true, col);
                    progress(timeProg, $(prog2), false);
                }
            } else {
                // Value of learned and learning combined
                wordScore = calcValForGoal(goals[0].learned, goals[0].learning, goals[0].avgRepnum);
            }
            if (!isNaN(wordScore)) {
                document.querySelector("#learning").innerHTML = wordScore.toString(10);
            }
        }
    ).fail(function (jqXHR, status, err) {
        console.log("failed ajax call to get goals data");
    });
}

function updateWordscore() {
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url2 + "/php/goals.php?userid=" + userid
    }).done(function (resultjson) {
            goals = JSON.parse(resultjson);
            const wordScore = calcValForGoal(goals[0].learned, goals[0].learning, goals[0].avgRepnum);
            if (!isNaN(wordScore)) {
                document.querySelector("#learning").innerHTML = (wordScore);
            }
        }
    ).fail(function (jqXHR, status, err) {
        console.log("failed ajax call to get goals data");
    });
}

function getReaderInfo() {

    group = localStorage.getItem("group");

    $('#selectReader').empty();
    var htmlstr;
    $.ajax({
        type: "GET",
        crossDomain: true,
        accepts: {
            myType: "application/json"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        dataType: "json",
        // url: "https://notborder.org/lavamob/php/getTextInfo.php",
        url: url2 + "/php/getTextInfo.php",
        data: {"userid": userid}
    }).done(function (resultjson) {
        console.log("\n\nresultjson: " + JSON.stringify(resultjson) + "\n\n");
        if (!resultjson) {
            console.log("resultjson evaluates to false. Probably there are no readers");
            return;
        }

        let newEl = document.createElement("div");
        // newEl.style.color='red';


        $.each(resultjson.readers, function (idx, val) {
            if (val.groupid > 0) {
                $('#selectReader').append(createGroupItem(val));
                return;
            }
            $('#selectReader').append(createReaderItem(val));
        });
    }).fail(function (jqXHR, status, err) {
        console.log("failed ajax call in getReaderInfo" + status + err);
    });
}

function createReaderItem(data) {

    let mystr = `<div class='item' data-textid='${data.id}'>&nbsp;<div class='readerlistitem' onclick='getReader(${data.id})'>${data.name}</div>`;
    mystr += `<div class='itemStats'>${data.wordcount} words<br><span class='rarity'>${data.rarityQuot} rarity</span></div>`;
    mystr += `<i class="fa-solid fa-graduation-cap readerlistitemvocab" onclick='getVocab(` + data.id + `)'></i>`;
    mystr += `<i ` + (group === "USER" ? `style='visibility: hidden'` : ``) + ` class='fa fa-pencil-square-o' onclick='editReader(` + data.id + `)'></i>`;
    mystr += `<i class="fa-regular fa-trash-can" onclick='deleteReader(this.parentNode,` + data.id + `);'></i>`;
    mystr += `</div>`;
    return mystr;
}

//TODO: implement grouping of readers
function createGroupItem(data) {
    let mystr = `<div class='item'>&nbsp;<div class='readerlistitem'>${data.groupname}</div>`;
    mystr += `<div class='itemStats'>${data.wordcount} words<br><span class='rarity'>${data.rarityQuot} rarity</span></div>`;
    mystr += `<i style='visibility: hidden' class="fa-solid fa-graduation-cap readerlistitemvocab" onclick='getVocab(` + data.id + `)'></i>`;
    mystr += `<i style='visibility: hidden' class='fa fa-pencil-square-o' aria-hidden='true' onclick='editReader(` + data.id + `)'></i>`;
    mystr += `<i style='visibility: hidden' class="fa-regular fa-trash-can" onclick='deleteReader(this.parentNode,` + data.id + `);'></i>`;
    mystr += `</div>`;
    return mystr;
}

function editReader(textid) {
    console.info("in edit reader");
    $.ajax({
        type: "GET",
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        // url: url + "/text/forEdit?textid=" + textid
        url: url2 + "/php/getTextForEdit.php?textid=" + textid
    }).done(function (resultjson) {
        console.info(`text ${textid} fetched successfully`);
        selectedReaderObj = JSON.parse(resultjson);
        // printObject("Text For Edit", selectedReaderObj);
        document.getElementById("createReaderTextPanel").value = selectedReaderObj.plainText;


        // .innerText = resultjson.plainText;
        console.log("value set for 'text' div");
        document.getElementById("readerName").value = selectedReaderObj.name;
        document.getElementById("readerDescription").value = selectedReaderObj.description;

        createReader(textid);

    }).fail(function (jqXHR, status, err) {
        console.log("failed ajax call in getReader");
    });
}

function deleteReader(node, textid) {
    swal({
        title: 'Are you sure you want to remove Reader id ' + textid + ', ' + node.name + '?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Add all words to learned list',
        cancelButtonText: 'Just delete',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true
    }).then(function () {
        console.log('chose to add words to learned list');
        node.parentNode.removeChild(node);
        removeReader(textid, true);
    }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
            console.log('chose to just delete reader');
            node.parentNode.removeChild(node);
            removeReader(textid, false);
        }
    })
}

function getReader(textid) {
    history.pushState({page_id: 5, page: "studyText", textid: textid}, null, "/lavamob/studyText");
    console.log("push state page 5 studyText. History object size is " + History.length);
    selectedTextid = textid;
    getLL(textid);
    $("#reader").show();
}

function downloadReader() {
    console.log("in downloadReader()");
    $.ajax({
        type: "GET",
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        url: url2 + "/php/getText.php?textid=" + selectedTextid + "&userid=" + userid
        // url: url + "/text/dBOnly?textid=" + selectedTextid
    }).done(function (resultjson) {

            // *** using php ***
            selectedReaderObj = JSON.parse(resultjson);
            // selectedReaderObj.serial = selectedReaderObj.serial.toString();
            var shit = new Array();
            shit = eval(selectedReaderObj.puncParsedJsonArray);
            selectedReaderObj.puncParsedJsonArray = shit;
            shit = eval(selectedReaderObj.puncParsedAudioJsonArray);
            selectedReaderObj.puncParsedAudioJsonArray = shit;
            shit = eval(selectedReaderObj.uniqueInfoArray);
            selectedReaderObj.uniqueInfoArray = shit;

            //Initialize sound
            howl = null;
            howlSpriteObj = null;

            var finalTextArr;

            console.warn(selectedReaderObj.audio);
            console.warn(selectedReaderObj.audioSpriteJson);


            if (selectedReaderObj.audio) { // If there is audio, set up Howl and the sprite object
                console.log('there is audio');
                finalTextArr = selectedReaderObj.puncParsedAudioJsonArray;
                var sndArr = new Array();
                sndArr.push(audiourl + "/" + selectedReaderObj.audio); // simplify this for goodness sake, insert on instantiation
                howlSpriteObj = JSON.parse(selectedReaderObj.audioSpriteJson);
                howl = new Howl({
                    src: sndArr,
                    sprite: howlSpriteObj
                });
            } else {
                finalTextArr = selectedReaderObj.puncParsedJsonArray;
                // printObject(finalTextArr);
            }

            // make selected reader text !!!!!!!!!!
            //recursively use indexof to alter the value of

            var constituteText = function (myStr, start) { //Decorates each word with customPop, and sets css if word is in learning list
                var infoArr = myStr.split("^/");
                // console.log(infoArr);
                var inList = false;


                const customIndexOf = (arr, searchTerm, start) => {
                    for (let i = start; i < arr.length; i++) {
                        // Split the array element by hyphen
                        if (arr[i].match(hyphenWordRegex1)) {
                            // console.log(arr[i] + " is a hyphen word");
                            let parts = arr[i].split('-'); // maybe too expensive. Just look for hyphen and return after it
                            // console.log(parts[0] + ", " + parts[1] + ", searchTerm: " + searchTerm);
                            reconstHyphenWord = parts[0] + "-" + parts[1]; // reconstitute hyphenated word!!!
                            if (parts[1] === searchTerm) {
                                return i;
                            }
                        } else {
                            if (arr[i] === searchTerm) { // non hyphen words
                                return i;
                            }
                        }
                    }
                    return -1; // Return -1 if no match is found
                }


                var foundidx = customIndexOf(finalTextArr, infoArr[0], start);

                // console.log("infoArr[0]: " + infoArr[0] + ", foundidx: " + foundidx + ", start: " + start);
                // console.log([...finalTextArr]);

                if (foundidx > -1) {
                    llData.list.forEach(function (el) {
                        if (parseInt(el.wordid) === parseInt(infoArr[1])) {
                            inList = true;
                        }
                    });

                    if (finalTextArr[foundidx].match(hyphenWordRegex1)) {

                        if (inList) {
                            finalTextArr[foundidx] = "<span class=\"word clicked\" onclick=\"customPop(this, \'" + reconstHyphenWord + "\', \'" + infoArr[1] + "\', \'" + infoArr[2] + "\', \'" + infoArr[3] + "\', \'" + infoArr[4] + "\');\">" + reconstHyphenWord + "</span>";
                        } else {
                            finalTextArr[foundidx] = "<span class=\"word\" onclick=\"customPop(this, \'" + reconstHyphenWord + "\', \'" + infoArr[1] + "\', \'" + infoArr[2] + "\', \'" + infoArr[3] + "\', \'" + infoArr[4] + "\');\">" + reconstHyphenWord + "</span>";
                        }
                        try {
                            constituteText(myStr, foundidx + 1); // recursive, because the word may occur more than once in the text, indexOf only returns the first occurrence
                        } catch (a) {
                            console.log("Error in constitute text. Maybe foundidx+1 is greater than the length of the array");
                        }
                    } else {
                        if (inList) {
                            finalTextArr[foundidx] = "<span class=\"word clicked\" onclick=\"customPop(this, \'" + infoArr[0] + "\', \'" + infoArr[1] + "\', \'" + infoArr[2] + "\', \'" + infoArr[3] + "\', \'" + infoArr[4] + "\');\">" + infoArr[0] + "</span>";
                        } else {
                            finalTextArr[foundidx] = "<span class=\"word\" onclick=\"customPop(this, \'" + infoArr[0] + "\', \'" + infoArr[1] + "\', \'" + infoArr[2] + "\', \'" + infoArr[3] + "\', \'" + infoArr[4] + "\');\">" + infoArr[0] + "</span>";
                        }
                        try {
                            constituteText(myStr, foundidx + 1); // recursive, because the word may occur more than once in the text, indexOf only returns the first occurrence
                        } catch (a) {
                            console.log("Error in constitute text. Maybe foundidx+1 is greater than the length of the array");
                        }
                    }
                }
            };

            for (var x = 0; x < selectedReaderObj.uniqueInfoArray.length; x++) {
                // console.log("sending to constituteText: " + selectedReaderObj.uniqueInfoArray[x]);
                constituteText(selectedReaderObj.uniqueInfoArray[x], 0);
            }


            // for (let x = 0; x < finalTextArr; x++) {
            //     if (finalTextArr[x].match(realWordRegex1) || finalTextArr[x].match(hyphenWordRegex1)) {
            //         console.log("sending to constituteText: " + finalTextArr[x]);
            //         constituteText(finalTextArr[x], 0);
            //     }
            // }


            selectedReaderText = "";
            finalTextArr.forEach(function (el, idx) {
                if (el.indexOf("^&") > -1) {
                    finalTextArr[idx] = "<img src=\"play_hover.png\" class=\"audioIcon\" onclick=\"playSound(" + el.slice(2) + ")\">";
                    selectedReaderText += finalTextArr[idx];
                } else {
                    selectedReaderText += el;
                }
            });
            console.log(selectedReaderObj.audio);
            $('#selectReader').hide();
            $('#reader').empty();
            $('#reader').append("<div class='readerTitle'>" + selectedReaderObj.name + "</div>");
            if (selectedReaderObj.audio) {
                $('#reader').append("<a href='" + audiourl + "/" + selectedReaderObj.audio + "'><svg id='downloadIcon' viewBox='0 0 30 30'><path d=\"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z\"></path></svg></a>");
            }
            $('#reader').append("<img id='printerIcon' src='assets/img/icons/printer.png' onclick='window.print()'>");
            $('#reader').append("<div class='readerDesc'>" + selectedReaderObj.description + "</div>");
            $('#reader').append("<div class='readerPanel'></div>");
            if (selectedReaderObj.audio) {
                $('#reader .readerPanel').append("<div class='audioOptions' onclick='howl.stop()'>" +
                    "<input type='radio' name='audioOptions' id='continousAudioCheck'>&nbsp;&nbsp;<img src='assets/img/icons/continue.png'>" +
                    "<input type='radio' name='audioOptions' id='loopAudio'>&nbsp;&nbsp;<img src='assets/img/icons/loop.png'>" +
                    "<input type='radio' name='audioOptions'>&nbsp;&nbsp;Stop!</div><br>");
            }
            $('#reader .readerPanel').append(selectedReaderText);
            $('#reader .readerPanel').append("<br><br><br><br><br>");
            document.documentElement.scrollTop = readerYScroll;
        }
    ).fail(function (jqXHR, status, err) {
        console.log("failed ajax call in getReader");
    });
}

function getLL(textid) {
    console.log("In getLL with textid " + textid);
    $.ajax({
        url: url2 + "/php/getLL.php",
        type: "GET",
        dataType: "json",
        data: {"userid": userid},
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {
            llData = data;
            console.log("Set llData. Type of list: " + typeof llData.list);
            downloadReader();
        },
        error: function () {
            alert("error fetching learning list at /php/getLL.php");
        }
    });
}

function customPop(el, word, wordid, headwordid, headword, tranche) {
    if ($(el).hasClass("clicked")) {
        var tom = llData.list.find(function (currentValue, index, arr) {
            return parseInt(currentValue.wordid) === parseInt(wordid);
        });
        // swal(tom.word + "\n" + tom.tranny);

        swal({
            title: `${tom.word} </br> ${tom.tranny}`,
            html: "이것을 삭제하시겠습니까?",
            showConfirmButton: true,
            showCancelButton: true
        })
            .then((value) => {
                swal({
                    title: '확실합니까?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '해보자!'
                })
                    .then((result) => {
                        if (result) {
                            fetch(url2 + '/php/llDelete.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: 'wordid=' + encodeURIComponent(tom.wordid) + '&userid=' + encodeURIComponent(tom.userid)
                            })
                                .then(response => response.text())
                                .then(data => {
                                    swal({
                                        title: '항목이 삭제되었습니다.',
                                        timer: 1500,
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        icon: 'success'
                                    });
                                    $(".readerPanel").remove();
                                    getLL(selectedTextid);
                                });
                        }
                    });
            });

        return;
    }

    readerYScroll = document.documentElement.scrollTop;

    // var dicUrl = "http://endic.naver.com/search.nhn?query=" + word;
    // var dicUrl = "https://dict.naver.com/rukodict/#/search?query=" + word;
    // var dicUrl = "https://www.bing.com/translator/?from=en&to=ru&text=" + word;

    language = localStorage.getItem('language');

    switch (language) {
        case '2':
            dicurl = "https://translate.google.com/?hl=ru&sl=en&tl=ru&text=" + word;
            break;
        case '3':
            dicurl = "https://zh.dict.naver.com/#/search?query=" + word;
            break;
        case '1':
        case '4':
            dicurl = "https://en.dict.naver.com/#/search?range=all&query=" + word;
            break;
        case '5':
            dicurl = "https://translate.google.com/?hl=th&sl=en&tl=th&text=" + word;
            break;
        case '6':
            dicurl = "https://translate.google.com/?hl=fr&sl=en&tl=fr&text=" + word;
            break;
        default:
            dicurl = "https://en.dict.naver.com/#/search?range=all&query=" + word;
    }
    var name = "dictionary";
    var specs = "width=500, height=500, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
    naverPopup = window.open(dicurl, name, specs);

    swal({
        title: 'Add to List',
        html: '<input id="llWord" class="llWord" autofocus>' +
            '<input id="tranny" class="tranny" placeholder="type here">',
        showCancelButton: true,
        onOpen: function (el) {
            $(el).find('.llWord').val(word);
        },
        preConfirm: function () {
            return new Promise(function (resolve) {
                resolve($(".tranny").val());
            });
        }
    }).then(function (data) {
        $.ajax({
            type: "POST",
            // url: url + "/lladd",
            url: url2 + "/php/lladd.php",
            crossDomain: true,
            data: {
                "userid": userid,
                "textid": selectedTextid,
                // "word": word,
                "word": document.getElementById("llWord").value,
                "wordid": wordid,
                "headwordid": headwordid,
                "headword": headword,
                "tranny": data,
                "thouTranch": 5
            },
            success: function (result) {
                $(el).addClass("clicked");
                $(".readerPanel").remove();
                getLL(selectedTextid);
            },
            error: (function (jqXHR, status, err) {
                console.log("failed ajax call in customPop. Probably duplicate ll upload failed db constraint duplicate primary key. Check glassfish log\n" + err);
            })
        });
    }, function () {
        console.log("cancelled");
    });
}

function studyReader() {
    history.pushState({page_id: 2, page: "readers"}, null, "/lavamob/studyReader");
    console.log("push state page 2 readers History object size is " + History.length);
    $("section").hide();
    $("#reader").empty();
    $("#selectReader").show();

    const section = document.getElementById('selectReader');
    section.querySelectorAll('.item').forEach((item) => {
        console.log('adding event listeners');
        item.addEventListener('mousedown', mouseDownHandler);
    });
}

function createReader(textid) {
    if (textid === 0) {
        cleanupCreateReader();
    }
    history.pushState({page_id: 1, page: "create"}, null, "/lavamob/createReader");
    textToEdit = textid;
    $('section').hide();
    $('#createReader').show();
}

function getVocab(textid) {
    console.log("In getVocab");
    // make entry in the activity log table
    jaxy(
        "php/activityLog.php", "POST",
        {
            userid: userid,
            activityType: 3,
            extraInfo: 1
        },
        "Updated activity log for voca test",
        "Problem updating activity log for voca test"
    );


    $.ajax({
        url: url2 + "/php/getLL.php",
        type: "GET",
        dataType: "json",
        data: {"userid": userid},
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {
            console.log("successfully retrieved ll data");
            llData = data;
            let thisTextLL = [];
            llData.list.forEach(function (el) {
                // console.log(el);
                // console.log(el.textid);
                if (el.textid === textid) { // only items in selectedtext
                    // console.log("this one is in our text");
                    thisTextLL.push(el);
                }
            });

            $("#vocab").empty();

            if (thisTextLL.length > 0) {

                var htmlstr = "";
                thisTextLL.forEach(function (el, idx) {
                    htmlstr += "<div class='vocabitem'><div class='vocabitemWord'>" + el.word + "</div><img src='assets/img/icons/naver.png' onclick='showDic(\"" + el.word + "\")'>" +
                        "<div class='vocabitemTranny'>" + el.tranny + "</div><div class='vocabInfo'>next review: " + el.datenext.substr(0, 16) + ", repnum: " + el.repnum + ", ef: " + el.ef + "</div></div>";
                });
                $("#vocab").append(htmlstr);
                $("#selectReader").hide();
                history.pushState({page_id: 6, page: "readVocab"}, null, "/lavamob/readVocab");
                console.log("History object size is " + History.length);
                $("#vocab").show();
            } else {
                swal("이 텍스트에 대한 어휘 항목이 없습니다");
            }

        },
        error: function () {
            alert("oops");
        }
    });

}

function completeText() {
    swal("not implemented");
}

function getLLData() {
    // spaced repetition !!!
    if (!llData) {
        // alert("llData was empty");
        $.ajax({
            url: url2 + "/php/getLL.php",
            type: "GET",
            dataType: "json",
            data: {"userid": userid},
            crossDomain: true,
            accepts: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {
                // alert(JSON.stringify(data));
                llData = data;
            }
        });
    }
}

function makeNowList() {
    nowList = [];
    llData.list.forEach(function (el, idx) {
        let arr = el.datenext.split(/[- :]/);
        let incomingSQLDate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]); // constructor to make javascript date from mysql date
        const nowWithTimezone = getCurrentTimezoneDate(new Date());
        if (incomingSQLDate < nowWithTimezone) {
            nowList.push(el);
        }
    });
    console.log("size of nowList is " + nowList.length);
}

function studyVocab() {
    console.log("In study vocab, makeVocaTest is next");
    console.log(llData);
    $("#vocaTest").empty();
    if (!llData) {
        console.log("There was no llData. Downloading now...");
        $.ajax({
            url: url2 + "/php/getLL.php",
            type: "GET",
            dataType: "json",
            data: {"userid": userid},
            crossDomain: true,
            accepts: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/json");
                console.log('ajax request header set');
            },
            success: function (data) {
                console.log('in success function of studyVocab function line 633');
                llData = data;
                makeNowList();
                makeVocaTest();
            }
        }).done(function () {
            console.log('success');
        }).fail(function () {
            console.log('error');
        }).always(function () {
            console.log('complete');
        });
        w
    } else {
        console.log("There was llData");
        // reusing nowList. LLData is untouched
        makeNowList();
        makeVocaTest();
    }
}

function makeVocaTest() {
    console.log("In makeVocaTest. then promise is next");

    swal({
        text: "You have " + nowList.length + " items to review"
    }).then(function () {
        // console.log("In then promise. test is next");
        if (nowList.length < 7) {
            swal({text: "Sorry, there are not enough items to make a test"});
            $("section").hide();
            $("#welcome").show();
            return;
        }

        history.pushState({page_id: 3, page: "vocab"}, null, "/lavamob/testVocab");
        console.log("push state page 3 vocab History object size is " + History.length);
        $("section").hide();
        $("#vocaTest").show();
        test(nowList);
    });
}

function playSound(sprite) {
    howl.stop();
    if (document.getElementById("loopAudio").checked) {
        console.log("loop is checked");
        howl._sprite.myNewSprite = [howl._sprite[sprite][0], howl._sprite[sprite][1], true];
        howl.play('myNewSprite');
        return;
    }
    if (document.getElementById("continousAudioCheck").checked) {
        console.log("continuousAudio is checked");
        howl._sprite.myNewSprite = [howl._sprite[sprite][0], 1000000];
        howl.play('myNewSprite');
        return;
    }
    sprite = sprite.toString();
    howl.play(sprite);
}

function showDic(word) {
    var url = naverPre + word + naverPost;

    $.ajax({
        type: "GET",
        crossdomain: true,
        url: "http://www.notborder.org/lavamob/lizard.php?word=" + word,
        success: function (data) {
            // alert(data);
            var nodeArr = $.parseHTML(data);
            // printObject("downloaded node array", nodeArr);
            var htmlString = "";


            var $wowElement = $(nodeArr).find(".section_card").find(".h_word").find("strong");

            // printObject("fook", $wowElement[0]);
            htmlString += "<h1>" + $wowElement[0].outerHTML + "</h1>";

            htmlString += "<h3>" + $wowElement.parent().parent().find(".desc_lst").find("a")[0].innerHTML + "</h3>";

            // printObject("different method", $wowElement.parent().parent().find(".desc_lst").find("span")[0]);

            htmlString += "<div>" + $wowElement.parent().parent().parent().find(".example_wrap").find("p")[0].innerHTML + "</div>";
            // printObject("real", $wowElement.parent().parent().parent().find(".example_wrap").find("p")[1]);
            htmlString += "<div>" + $wowElement.parent().parent().parent().find(".example_wrap").find("p")[1].textContent.replace("발음듣기", "") + "</div>";

            document.getElementById("dicFrame").innerHTML = "<img id=\"closeIcon\" src=\"assets/img/icons/close.png\" onclick=\"$('#dicFrame').hide()\">" + htmlString;
            $("#dicFrame").show();

            return;

            nodeArr.forEach(function (val, idx) {
                // printObject("each object", val);
                // console.log(val.id);
                if (val.id == "wrap") {
                    alert("found wrap");
                    val.childNodes.forEach(function (val, idx) {
                        if (val.id == "content") {
                            alert("found content");

                            val.childNodes.forEach(function (val, idx) {
                                // printObject("content", val);
                                if (val.className == "entry_wrap") {
                                    alert("found entry_wrap");

                                    val.childNodes.forEach(function (val, idx) {
                                        // printObject("entry wrap", val);
                                        if (val.className == "section_card") {
                                            alert("found section_card");
                                            val.childNodes.forEach(function (val, idx) {
                                                printObject("section_card ... frist", val);
                                                if (val.className == "entry_search_body" || val.className == "entry_search_word top kr") {
                                                    alert("found entry_search_body or entry_search_word");
                                                    val.childNodes.forEach(function (val, idx) {
                                                        // printObject("entry_search_body", val);
                                                        if (val.className == "word_wrap") {
                                                            alert("found word_wrap");
                                                            val.childNodes.forEach(function (val, idx) {
                                                                if (val.className == "h_word") {
                                                                    alert("found h_word");
                                                                    val.childNodes.forEach(function (val, idx) {
                                                                        // printObject("at last", val);
                                                                        // console.log("textContent: " + val.textContent.trim());
                                                                        htmlString += "<h1>" + val.textContent.trim() + "</h1>";
                                                                    });
                                                                }
                                                                if (val.className == "desc_lst") {
                                                                    val.childNodes.forEach(function (val, idx) {
                                                                        // printObject("desclst", val);
                                                                        if (val.outerHTML) {
                                                                            // console.log(val.outerHTML);
                                                                            htmlString += val.outerHTML;
                                                                        } else {
                                                                            // console.log(val.textContent.trim());
                                                                            htmlString += "<span class='myDesc'>" + val.textContent.trim() + "</span>";
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                return;
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            document.getElementById("dicFrame").innerHTML = "<img id=\"closeIcon\" src=\"assets/img/icons/close.png\" onclick=\"$('#dicFrame').hide()\">" + htmlString;
            $("#dicFrame").show();
            // document.getElementById("dicFrame").srcdoc = data;
        },
        fail: function () {
            alert("ajax no worky!");
        }
    });

}

function removeReader(textid, addWords) {

    $.ajax({
        // type: "DELETE",
        type: "GET",
        url: url2 + "/php/deleteText.php?userid=" + userid + "&textid=" + textid + "&isAddToLearned=" + addWords,
        crossDomain: true,
        dataType: "text",
        success: function (result) {
            msg = addWords ? "Reader has been removed.\nWords have been added to learned list." : "Reader has been removed.";
            swal(msg);
        },
        error: (function (jqXHR, status, err) {
            swal("some problem");
        })
    });

}
