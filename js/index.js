/**
 * Created by matthew on 7/28/2016.
 */
var readers;
var userid = 0;
var goals;
var selectedTextid;
var selectedReaderObj;
var selectedReaderText;
var llData, nowList;
var naverPopup;
var howlSpriteObj;
var howl;


var naverPre = "http://m.endic.naver.com/search.nhn?query=";
var naverPost = "&searchOption=mean";
var readerYScroll = 0;

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
            userid = data;
            localStorage.setItem("userEmail", document.getElementById("userEmail").value);
            localStorage.setItem("userid", userid);
            $(".login").hide();
            document.getElementById('showusername').innerText = localStorage.getItem('userEmail');
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
    if (percent == 100) col = "#000000";
    var progressBarWidth = percent * $element.width() / 100;
    // $element.find('div').animate({width: progressBarWidth}, 500).html(percent + "%");
    $element.find('div').animate({width: progressBarWidth}, 500);
    if (boolAnimColor) $element.find('div').animate({backgroundColor: col}, 1800);

}

function getGoalsInfo() {

    $.ajax({
        type: "GET",
        crossDomain: true,
        url: url2 + "/php/goals.php?userid=" + userid
    }).done(function (resultjson) {
        goals = JSON.parse(resultjson);

        console.log(resultjson);

        var goalPlate = document.querySelector('#goalTemplate');
        for (var i = 0; i < goals.length; i++) {
            var goalData = goals[i];
            var clone = goalPlate.content.cloneNode(true);
            var blob = clone.querySelector('.goalName');
            blob.textContent = goalData.goal_name;
            blob = clone.querySelector('.goalDescription');
            blob.textContent = goalData.goal_description;
            blob = clone.querySelector('.startDate');
            blob.textContent = "start: " + goalData.start_date;
            blob = clone.querySelector('.endDate');
            blob.textContent = "end: " + goalData.end_date;

            // Date value
            var day = 1000 * 60 * 60 * 24;
            var now = new Date();
            var startDate = new Date(goalData.start_date);
            var endDate = new Date(goalData.end_date);
            var diff = Math.ceil((endDate - startDate) / day);
            var timeProg = Math.ceil((((now - startDate) / day) / diff) * 100);

            // Progress value
            var range = goalData.unit_target_value - goalData.unit_start_value;
            var valProg = Math.ceil(goalData.actual / range * 100);
            console.log("goal unit_start_value: " + goalData.unit_start_value + "\ngoal unit_target_value: " + goalData.unit_target_value
                + "\ngoal actual value: " + goalData.actual + "\nvalProg: " + valProg + "\ntimeProg: " + timeProg);

            // Colors
            var col = '';
            var percGood = valProg / timeProg;
            if (percGood > 1.2) col = "#44ff4b";
            if (percGood < 1.2) col = "#abce39";
            if (percGood < 1.05) col = "#cecb39";
            if (percGood < 0.9) col = "#ce9c39";
            if (percGood < 0.75) col = "#ce3939";

            var prog1 = clone.querySelector('.progressBar1');
            var prog2 = clone.querySelector('.progressBar2');
            goalPlate.parentNode.appendChild(clone);
            progress(valProg, $(prog1), true, col);
            progress(timeProg, $(prog2), false);


        }

    }).fail(function (jqXHR, status, err) {
        console.log("failed ajax call to get goals data");
    });


}

function getReaderInfo() {
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
        //url: url + "/textinfo",
        url: "https://notborder.org/lavamob/php/getTextInfo.php",
        data: {"userid": userid}
    }).done(function (resultjson) {
        console.log("\n\nresultjson: " + JSON.stringify(resultjson) + "\n\n");
        console.log("\n\nresultjson.readers[0]:\n" + JSON.stringify(resultjson.readers[0]) + "\n\n");
        // alert(JSON.stringify(resultjson));
        if (!resultjson) {
            console.log("resultjson evaluates to false. Probably there are no readers");
            return;
        }
        $.each(resultjson.readers, function (idx, val) {
            htmlstr = "<div class='item'>&nbsp;<div class='readerlistitem' onclick='getReader(" + val.id + ")'>" + val.name + "</div>";
            htmlstr += "<div class='readerlistitemvocab' onclick='getVocab(" + val.id + ")'>V</div>";
            htmlstr += "<i class='fa fa-pencil-square-o fa-2x' aria-hidden='true' onclick='editReader(" + val.id + ")'></i>";
            // htmlstr += "<img class='delreader' onclick='var el = this.parentNode; this.parentNode.parentNode.removeChild(el);deleteReader(" + val.id + ");' src='assets/img/icons/mission_complete.png'>";
            htmlstr += "<img class='delreader' onclick='deleteReader(this.parentNode," + val.id + ");' src='assets/img/icons/mission_complete.png'>";
            htmlstr += "</div>";
            $('#selectReader').append(htmlstr);
        });
    }).fail(function (jqXHR, status, err) {
        console.log("failed ajax call in getReaderInfo" + status + err);
    });
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
        printObject("Text For Edit", selectedReaderObj);
        document.getElementById("text").value = selectedReaderObj.plainText;


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
        title: 'Are you sure you want to remove Reader id ' + textid + '?',
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
        node.parentNode.removeChild(node);
        removeReader(textid, true); // TODO make ajax call to webservice to remove text from usertext table for this user, and to assign all words to the user's 'learned' list
    }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
            node.parentNode.removeChild(node);
            removeReader(textid, false);
        }
    })
}

function getReader(textid) {
    history.pushState({page_id: 5, page: "studyText", textid: textid}, null, "/lavamob/studyText");
    console.log("push state page 5 studyText");
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
        url: url2 + "/php/getText.php?textid=" + selectedTextid
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

        // //*** using glassfish ***
        // selectedReaderObj = resultjson;


        printObject("All Properties of resultjson", selectedReaderObj);
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
            var inList = false;
            var foundidx = finalTextArr.indexOf(infoArr[0], start); // don't I need to use 'start' here?
            if (foundidx > -1) {
                llData.list.forEach(function (el) {
                    if (parseInt(el.wordid) === parseInt(infoArr[1])) {
                        inList = true;
                    }
                });
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
        };

        for (var x = 0; x < selectedReaderObj.uniqueInfoArray.length; x++) {
            constituteText(selectedReaderObj.uniqueInfoArray[x], 0);
        }
        selectedReaderText = "";
        finalTextArr.forEach(function (el, idx) {
            if (el.indexOf("^&") > -1) {
                finalTextArr[idx] = "<img src=\"play_hover.png\" onclick=\"playSound(" + el.slice(2) + ")\">";
                selectedReaderText += finalTextArr[idx];
            } else {
                selectedReaderText += el;
            }
        });

        $('#selectReader').hide();
        $('#reader').empty();
        $('#reader').append("<div class='readerPanel'></div>");
        if (selectedReaderObj.audio) {
            $('#reader .readerPanel').append("<div style='position: relative;' class='audioOptions' onclick='howl.stop()'>" +
                "<input type='radio' name='audioOptions' id='continousAudioCheck'>&nbsp;&nbsp;Continuous Audio?" +
                "<input type='radio' name='audioOptions' id='loopAudio'>&nbsp;&nbsp;Loop?" +
                "<input type='radio' name='audioOptions'>&nbsp;&nbsp;none</div><br>");
        }
        $('#reader .readerPanel').append(selectedReaderText);
        document.documentElement.scrollTop = readerYScroll;
    }).fail(function (jqXHR, status, err) {
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
        swal(tom.word + "\n" + tom.tranny);
        return;
    }
    $(el).addClass("clicked");
    readerYScroll = document.documentElement.scrollTop;

    var dicUrl = "http://endic.naver.com/search.nhn?query=" + word;
    var name = "dictionary";
    var specs = "width=500, height=500, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
    naverPopup = window.open(dicUrl, name, specs);

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
    console.log("push state page 2 readers");
    $("section").hide();
    $("#reader").empty();
    $("#selectReader").show();
}

function createReader(textid) {
    history.pushState({page_id: 1, page: "create"}, null, "/lavamob/createReader");
    console.log("push state page 1 create");
    textToEdit = textid;
    $('section').hide();
    $('#createReader').show();
}

function getVocab(textid) {
    console.log("In getVocab");
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
                console.log(el);
                console.log(el.textid);
                if (el.textid === textid) { // only items in selectedtext
                    console.log("this one is in our text");
                    thisTextLL.push(el);
                }
            });

            $("#vocab").empty();

            if(thisTextLL.length > 0) {

                var htmlstr = "";
                thisTextLL.forEach(function (el, idx) {
                    htmlstr += "<div class='vocabitem'><div class='vocabitemWord'>" + el.word + "</div><img src='assets/img/icons/naver.png' onclick='showDic(\"" + el.word + "\")'>" +
                        "<div class='vocabitemTranny'>" + el.tranny + "</div><div class='vocabInfo'>next review: " + el.datenext.substr(0, 16) + ", repnum: " + el.repnum + ", ef: " + el.ef + "</div></div>";
                });
                $("#vocab").append(htmlstr);
                $("#selectReader").hide();
                history.pushState({page_id: 6, page: "readVocab"}, null, "/lavamob/readVocab");
                $("#vocab").show();
            } else{
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

function studyVocab() {
    console.log("In study vocab, makeVocaTest is next");
    llData = null;
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
            },
            success: function (data) {
                llData = data;
                // alert(JSON.stringify(data));
                nowList = new Array();
                console.log("size of json array is: " + llData.list.length);
                llData.list.forEach(function (el, idx) {

                    var d = convertDateToNumber(el.datenext); // this is overwritten below... delete this line?
                    var t = el.datenext.split(/[- :]/);
                    var datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
                    var d = Date.parse(datestr);
                    // alert("Now: "+Date.now() + "\nitem datenext" + d);
                    console.log("Checking nowlist. value of d is: " + d + ", value of now is: " + Date.now());
                    if (d < Date.now()) {
                        nowList.push(el);
                    }
                });
                makeVocaTest();
            }
        });
    } else {
        nowList = new Array();
        llData.list.forEach(function (el, idx) {
            var t = el.datenext.split(/[- :]/);
            var datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
            var d = Date.parse(datestr);
            // alert(Date.now() + "\n" + d);
            if (d < Date.now()) {
                // alert('hey');
                nowList.push(el);
            }
        });
        makeVocaTest();
    }
}

function makeVocaTest() {
    console.log("In makeVocaTest. then promise is next");

    swal({
        text: "You have " + nowList.length + " items to review"
    }).then(function () {
        console.log("In then promise. test is next");
        if (nowList.length < 7) {
            swal({text: "Sorry, there are not enough items to make a test"});
            $("section").hide();
            $("#welcome").show();
            return;
        }

        history.pushState({page_id: 3, page: "vocab"}, null, "/lavamob/testVocab");
        console.log("push state page 3 vocab");
        $("section").hide();
        $("#vocaTest").show();
        test(nowList); //why am I passing nowList? It is a global variable.
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

            printObject("different method", $wowElement.parent().parent().find(".desc_lst").find("span")[0]);

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
