/**
 * Created by matthew on 7/28/2016.
 */

var userid = 0;
var selectedTextid;
var selectedReaderObj;
var selectedReaderText;
var llData, nowList;
var naverPopup;
var howlSpriteObj;
var howl;
var url = "http://www.notborder.org:8080/Reader/webresources";
// var url = "http://localhost:8080/Reader/webresources";
var naverPre = "http://m.endic.naver.com/search.nhn?query=";
var naverPost = "&searchOption=mean";

function login(){

    $.ajax({
        type: "GET",
        crossDomain: true,
        url: "http://www.notborder.org/lavamob/login.php?user_email=" + document.getElementById("user").value + "&pass_word=" + document.getElementById("pass").value,
        success: function(data){
            userid = data;
            $(".login").hide();
            $("#welcome").show();
            $("#menu").show();
            getReaderInfo();
        }
    });
}


function getReaderInfo() {
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
        url: url + "/textinfo",
        data: {"userid": userid}
    }).done(function (resultjson) {
        // alert(JSON.stringify(resultjson));
        $.each(resultjson.readers, function (idx, val) {
            htmlstr = "<div class='item'>&nbsp;<div class='readerlistitem' onclick='getReader(" + val.id + ")'>" + val.name + "</div>";
            htmlstr += "<div class='readerlistitemvocab' onclick='getVocab(" + val.id + ")'>V</div></div>";
            $('#selectReader').append(htmlstr);
        });
    }).fail(function (jqXHR, status, err) {
        // alert("some problem");
        // alert(status);
        // alert(jqXHR.status);
        // alert(err);
        console.log("failed ajax call in getReaderInfo");
    });
}


function getReader(textid) {
    $("#reader").show();
    selectedTextid = textid;
    getLL(textid);
}

function downloadReader() {
    $.ajax({
        type: "GET",
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        url: url + "/text/dBOnly?textid=" + selectedTextid
    }).done(function (resultjson) {
        console.log(JSON.stringify(resultjson));
        selectedReaderObj = resultjson;

        //Initialize sound
        howl = null;
        howlSpriteObj = null;

        var finalTextArr = selectedReaderObj.puncParsedJsonArray;

        if (resultjson.audioFilename) { // If there is audio, set up Howl and the sprite object
            console.log('there is audio');
            finalTextArr = selectedReaderObj.puncParsedAudioJsonArray;
            var sndArr = new Array();
            sndArr.push(resultjson.audioFilename); // simplify this for goodness sake, insert on instantiation
            howlSpriteObj = JSON.parse(resultjson.audioSpriteObjString);
            howl = new Howl({
                src: sndArr,
                sprite: howlSpriteObj
            });
        }

        // make selected reader text !!!!!!!!!!
        //recursively use indexof to alter the value of

        var constituteText = function (myStr, start) { //Decorates each word with customPop, and sets css if word is in learning list
            var infoArr = myStr.split("^/");
            var inList = false;
            var foundidx = finalTextArr.indexOf(infoArr[0], start); // don't I need to use 'start' here?
            if (foundidx > -1) {
                llData.list.forEach(function (el) {
                    if (el.wordid === parseInt(infoArr[1])) {
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
        console.log("Printing finalTextArr");
        selectedReaderText = "";
        finalTextArr.forEach(function (el, idx) {
            if (el.indexOf("^&") > -1) {
                finalTextArr[idx] = "<img src=\"play_hover.png\" onclick=\"playSound(" + el.slice(2) + ")\">";
                selectedReaderText += finalTextArr[idx];
                console.log(finalTextArr[idx]);
            } else {
                selectedReaderText += el;
                console.log(el);
            }
        });
        console.log(selectedReaderText);

        // alert("ajax call success to web service for texts: \n\n" + JSON.stringify(resultjson));
        // selectedReaderText = selectedReaderText.replace(/customPop\(/g, "customPop(this,");
        // getLL(textid);


        $('#selectReader').hide();
        $('#reader').append("<div class='readerPanel'></div>");
        $('#reader .readerPanel').append(selectedReaderText);

    }).fail(function (jqXHR, status, err) {
        // alert("some problem");
        // alert(status);
        // alert(jqXHR.status);
        // alert(err);
        console.log("failed ajax call in getReader");
    });
}

function getLL(textid) {
    console.log("In getLL with textid " + textid);
    $.ajax({
        url: url + "/lladd",
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
            // alert(JSON.stringify(llData));
            // convert to object with parse, split reader text, add class if word in ll, show reader text
            // var textArr = selectedReaderText.split("</span>");
            // // make Array from learning list wordids
            // var listo = new Array();
            // llData.list.forEach(function (el) {
            //     if (el.textid === selectedTextid) { // only items in selectedtext
            //         listo.push(el.wordid);
            //     }
            // });
            //
            // textArr.forEach(function (el, idx) { // color purple all words found in wordlist
            //     var a = el.indexOf(",");
            //     var b = el.indexOf(",", a + 1);
            //     var c = el.indexOf("'", b + 2);
            //     var wid = el.substring(b + 2, c);
            //     listo.forEach(function (el2) {
            //         if (parseInt(wid) === el2) {
            //             textArr[idx] = textArr[idx].replace(/\'word\'/g, '"word clicked"');
            //         }
            //     });
            // });
            // //reconstitute selectedReaderText from the array
            // var newStr = "";
            // textArr.forEach(function (el, idx) {
            //     newStr += el + "</span>";
            // });
            // selectedReaderText = newStr;
            //
            // $('#selectReader').hide();
            // $('#reader').append(selectedReaderText);
        },
        error: function () {
            alert("oops");
        }
    });
}

function customPop(el, word, wordid, headwordid, headword, tranche) {
    if ($(el).hasClass("clicked")) {
        var tom = llData.list.find(function (currentValue, index, arr) {
            return currentValue.wordid === parseInt(wordid);
        });
        swal(tom.word + "\n" + tom.tranny);
        return;
    }
    $(el).addClass("clicked");

    var dicUrl = "http://endic.naver.com/search.nhn?query=" + word;
    var name = "dictionary";
    var specs = "width=500, height=500, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
    naverPopup = window.open(dicUrl, name, specs);

    swal({
        title: 'Add to List',
        html: '<input id="llWord" class="llWord" autofocus>' +
        '<input id="tranny" class="tranny">',
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
            url: url + "/lladd",
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
                // alert("some problem");
                // alert(status);
                // alert(jqXHR.status);
                // alert(err);
                console.log("failed ajax call in customPop. Probably duplicate ll upload failed db constraint duplicate primary key. Check glassfish log\n" + err);
            })
        });
    }, function () {
        console.log("cancelled");
    });
}

function studyReader() {
    $("section").hide();
    $("#selectReader").show();
}

function createReader() {
    $('section').hide();
    $('#createReader').show();
}

function getVocab(textid) {

    $.ajax({
        url: url + "/lladd",
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
            var thisTextLL = new Array();
            llData.list.forEach(function (el) {
                if (el.textid === textid) { // only items in selectedtext
                    thisTextLL.push(el);
                }
            });
            $("#selectReader").hide();
            $("#vocab").show();
            var htmlstr = "";
            thisTextLL.forEach(function (el, idx) {
                htmlstr += "<div class='vocabitem'><div class='vocabitemWord'>" + el.word + "</div><img src='assets/img/icons/naver.png' onclick='showDic(\"" + el.word + "\")'>" +
                    "<div class='vocabitemTranny'>" + el.tranny + "</div><div class='vocabInfo'>next review: " + el.datenext.substr(0, 16) + ", repnum: " + el.repnum + ", ef: " + el.ef + "</div></div>";
            });
            $("#vocab").append(htmlstr);
            $("#selectReader").hide();
            $("#vocab").show();
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
            url: url + "/lladd",
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
            url: url + "/lladd",
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

                    var d = convertDateToNumber(el.datenext);
                    var t = el.datenext.split(/[- :]/);
                    var datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
                    var d = Date.parse(datestr);
                    // alert("Now: "+Date.now() + "\nitem datenext" + d);
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
                nowList.push(el);
            }
        });
        makeVocaTest();
    }
}
function makeVocaTest() {
    console.log("In makevVocaTest. then promise is next");

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
        $("section").hide();
        $("#vocaTest").show();
        test(nowList);
    });
}

function playSound(sprite) {
    howl.stop();
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
            var fuck = "";


            var $wowElement = $(nodeArr).find(".section_card").find(".h_word").find("strong");

            // printObject("fook", $wowElement[0]);
            fuck += "<h1>" + $wowElement[0].outerHTML + "</h1>";

            fuck += "<h3>" + $wowElement.parent().parent().find(".desc_lst").find("a")[0].innerHTML + "</h3>";

            printObject("different method", $wowElement.parent().parent().find(".desc_lst").find("span")[0]);

            fuck += "<div>" + $wowElement.parent().parent().parent().find(".example_wrap").find("p")[0].innerHTML + "</div>";
            // printObject("real", $wowElement.parent().parent().parent().find(".example_wrap").find("p")[1]);
            fuck += "<div>" + $wowElement.parent().parent().parent().find(".example_wrap").find("p")[1].textContent.replace("발음듣기", "") + "</div>";

            document.getElementById("dicFrame").innerHTML = "<img id=\"closeIcon\" src=\"assets/img/icons/close.png\" onclick=\"$('#dicFrame').hide()\">" + fuck;
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
                                                                        fuck += "<h1>" + val.textContent.trim() + "</h1>";
                                                                    });
                                                                }
                                                                if (val.className == "desc_lst") {
                                                                    val.childNodes.forEach(function (val, idx) {
                                                                        // printObject("desclst", val);
                                                                        if (val.outerHTML) {
                                                                            // console.log(val.outerHTML);
                                                                            fuck += val.outerHTML;
                                                                        } else {
                                                                            // console.log(val.textContent.trim());
                                                                            fuck += "<span class='myDesc'>" + val.textContent.trim() + "</span>";
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
            // alert(fuck);
            document.getElementById("dicFrame").innerHTML = "<img id=\"closeIcon\" src=\"assets/img/icons/close.png\" onclick=\"$('#dicFrame').hide()\">" + fuck;
            $("#dicFrame").show();
            // document.getElementById("dicFrame").srcdoc = data;
        },
        fail: function () {
            alert("ajax no worky!");
        }
    });


}