var testList, doneList, wrongList;
var soundRight = new buzz.sound("assets/sound/bells-1-half.mp3");
var soundWrong = new buzz.sound("assets/sound/saliva-2.mp3");
var soundFinished = new buzz.sound("assets/sound/perfect.mp3");

function test(list) {
    testList = list;
    doneList = new Array();
    wrongList = new Array();
    $("section").not("#vocaTest").hide();
    $("#vocaTest").show();
    testList.forEach(function (el, idx) {
        // for(var propt in el){
        //     alert(propt + ": " + el[propt]);
        // }
        var qType;
        // decide type
        qType = 3;
        makeQuestion(qType, el.word, el.tranny, idx);
    });
    $(".testItem:first-of-type").show().find(".inputAnswer input").focus();
}

function makeQuestion(type, word, tran, idx) {
    var countdistinct;
    var arr = new Array(100);
    for (var x = 0; x < arr.length; x++) {
        arr[x] = 0;
    }
    var randArray;
    type = (testList.length < 6 && testList.length > 3 && type === 3) ? 1 : type;
    type = (testList.length < 6 && testList.length > 3 && type === 4) ? 2 : type;
    if (type < 3) { // 4 random
        randArray = new Array(4);
        do {
            for (var i = 0; i < 4; i++) {
                randArray[i] = Math.floor(Math.random() * testList.length);
                arr[randArray[i]] += 1;
            }
            countdistinct = 0;
            for (var i2 = 0; i2 < 100; i2++) {
                if (arr[i2] > 0) {
                    countdistinct += 1;
                }
            }
        } while (countdistinct < 4);
        // OK, got 4 random numbers within the length of testList
    } else if (type < 5) { // 6 random
        randArray = new Array(5);
        randWordArray = new Array(5);
        newArray = new Array(6);
        newArray[0] = testList.splice(idx, 1)[0];
        do {
            for (var i = 0; i < 5; i++) {
                randArray[i] = Math.floor(Math.random() * testList.length);
                arr[randArray[i]] += 1;
            }
            countdistinct = 0;
            for (var i2 = 0; i2 < 100; i2++) {
                if (arr[i2] > 0) {
                    countdistinct += 1;
                }
            }
        } while (countdistinct < 5);
        // OK, got 5 random numbers within the length of testList
        for(var y=0;y<randArray.length; y++){
            newArray[y+1] = testList[y];
        }
        newArray = shuffle(newArray);
        alert(newArray[0].word);
    }

    switch (type) {
        case 1: // Korean word shown, choose from 4 tranny
            var htmlstr = "<div class = '4grid'><div class = 'gridItem'>" + +"</div></div>";
            break;
        case 2: // English word shown, choose from 4 tranny
            break;
        case 3: // Korean word shown, choose from 6 tranny
            alert("case 3");

            var htmlstr = "<div class = '4grid'><div class = 'gridItem'>" + +"</div></div>";


            break;
        case 4: // English word shown, choose from 6 tranny
            break;
        case 5: // Typing
            var bobby = tran.replace("'", "&apos;");
            var htmlstr = "<div class='testItem' style='display:none;'><div class='testWord'>" + word + "</div><div class='inputAnswer'>" +
                "<input type='text' onkeydown='javascript: if(event.keyCode == 13) checkResult(event, \x22" + bobby + "\x22, this, " + idx;
            var bob = ")'/>";
            htmlstr += bob;
            $("#vocaTest").append(htmlstr);
            break;
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
