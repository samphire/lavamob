/**
 * Created by matthew on 7/28/2016.
 */

var userid = 1;
var selectedTextid;
var selectedReaderText;
var llData, nowList;
var naverPopup;

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
        url: "http://localhost:8080/Reader/webresources/textinfo",
        data: {"userid": 1}
    }).done(function (resultjson) {
        // alert(JSON.stringify(resultjson));
        $.each(resultjson.readers, function (idx, val) {
            htmlstr = "<div class='item'>&nbsp;<div class='readerlistitem' onclick='getReader(" + val.serial + ", " + val.id + ")'>" + val.name + "</div>";
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


function getReader(serial, textid) {
    selectedTextid = textid;
    $.ajax({
        type: "GET",
        crossDomain: true,
        accepts: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        dataType: "json",
        url: "http://localhost:8080/Reader/webresources/text",
        data: {"serial": serial}
    }).done(function (resultjson) {
        selectedReaderText = resultjson.reader;
        // alert("ajax call success to web service for texts: \n\n" + JSON.stringify(resultjson));
        selectedReaderText = selectedReaderText.replace(/customPop\(/g, "customPop(this,");
        getLL(textid);
    }).fail(function (jqXHR, status, err) {
        // alert("some problem");
        // alert(status);
        // alert(jqXHR.status);
        // alert(err);
        console.log("failed ajax call in getReader");
    });
}

function getLL(textid) {
    $.ajax({
        url: "http://localhost:8080/Reader/webresources/lladd",
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
            // alert(JSON.stringify(llData));
            // convert to object with parse, split reader text, add class if word in ll, show reader text
            var textArr = selectedReaderText.split("</span>");
            // make Array from learning list wordids
            var listo = new Array();
            llData.list.forEach(function (el) {
                if (el.textid === selectedTextid) { // only items in selectedtext
                    listo.push(el.wordid);
                }
            });

            textArr.forEach(function (el, idx) { // color purple all words found in wordlist
                var a = el.indexOf(",");
                var b = el.indexOf(",", a + 1);
                var c = el.indexOf("'", b + 2);
                var wid = el.substring(b + 2, c);
                listo.forEach(function (el2) {
                    if (parseInt(wid) === el2) {
                        textArr[idx] = textArr[idx].replace(/\'word\'/g, '"word clicked"');
                    }
                });
            });
            //reconstitute selectedReaderText from the array
            var newStr = "";
            textArr.forEach(function (el, idx) {
                newStr += el + "</span>";
            });
            selectedReaderText = newStr;

            $('#selectReader').hide();
            $('#reader').append(selectedReaderText);
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

    var url = "http://endic.naver.com/search.nhn?query=" + word;
    var name = "dictionary";
    var specs = "width=500, height=500, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes";
    naverPopup = window.open(url, name, specs);


    swal({
        title: 'Add to List',
        html: '<input id="llWord" class="llWord" autofocus>' +
        '<input id="tranny" class="tranny">',
        onOpen: function (el) {
            $(el).find('.llWord').val(word);
        },
        preConfirm: function () {
            return new Promise(function (resolve) {
                // alert($(".tranny").val());
                resolve($(".tranny").val());
            });
        }
    }).then(function (data) {
        // swal("in ajax " + data);
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Reader/webresources/lladd",
            crossDomain: true,
            data: {
                "userid": 1,
                "textid": selectedTextid,
                "word": word,
                "wordid": wordid,
                "headwordid": headwordid,
                "headword": headword,
                "tranny": data,
                "thouTranch": 5
            },
            success: function (result) {
                getLL(selectedTextid);
            },
            error: (function (jqXHR, status, err) {
                // alert("some problem");
                // alert(status);
                // alert(jqXHR.status);
                // alert(err);
                console.log("failed ajax call in customPop. Probably duplicate ll upload failed db constraint duplicate primary key. Check glassfish log");
            })
        });
    }, function () {
        alert("sumtink wong");
    });
}

function studyReader() {
    $("#welcome").hide();
    $("#selectReader").show();
}

function getVocab(textid) {

    $.ajax({
        url: "http://localhost:8080/Reader/webresources/lladd",
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
                htmlstr += "<div class='vocabitem'><div class='vocabitemWord'>" + el.word +
                    "</div><div class='vocabitemTranny'>" + el.tranny + "</div></div>";
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
            url: "http://localhost:8080/Reader/webresources/lladd",
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
            }
        });
    }
}
function studyVocab() {
    if (!llData) {
        console.log("There was no llData. Downloading now...");
        $.ajax({
            url: "http://localhost:8080/Reader/webresources/lladd",
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
function makeVocaTest(){
    swal("You have " + nowList.length + " items to review");
    $("#welcome").hide();
    $("#vocaTest").show();

}