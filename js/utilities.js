/**
 * Created by matthew on 8/3/2016.
 */
function convertDateToNumber(date) {
    var t = date.split(/[- :]/);
    var datestr = t[0] + " " + t[1] + " " + t[2] + " " + t[7] + " " + t[3] + ":" + t[4] + ":" + t[5];
    return Date.parse(datestr); // milliseconds from jan 1st 1970
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}