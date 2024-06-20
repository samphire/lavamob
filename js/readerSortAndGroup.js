let draggingEle;
let targetEle;
let isDraggingStarted = false;
let isTargetTime = false;
let placeholder;
let mousePositionInEl;
let draggingEleWidth;

const mouseDownHandler = function (e) {  // captures whatever is clicked, whether reordering or not
    draggingEle = e.currentTarget;
    draggingEleWidth = e.currentTarget.style.width;
    console.log(e.currentTarget.innerText + " is captured with width " + draggingEleWidth);

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect();
    mousePositionInEl = e.clientY - rect.top;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    const draggingRect = draggingEle.getBoundingClientRect();
    if (!isDraggingStarted) {
        isDraggingStarted = true;
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextElementSibling);
        draggingEle.style['padding-top'] = 0;
    }

    // Set position for dragging element
    draggingEle.style.position = 'absolute';
    draggingEle.style.width = '' + draggingRect.width + 'px';
    console.log( "draggingEle.style.width: " + draggingRect.width);

    // sets position of element
    draggingEle.style.top = `${Math.round(e.pageY - mousePositionInEl)}px`;

    // enable scrolling while dragging
    // going up
    if (e.pageY - window.scrollY < 100) {
        const scrollby = window.scrollY < 30 ? -window.scrollY : -30;
        window.scrollBy(0, scrollby);
    }

    const heightOfParent = document.getElementById('selectReader').getBoundingClientRect().height;
    // going down
    if (window.innerHeight - (e.pageY - window.scrollY) < 100) {
        const scrollby = heightOfParent - e.pageY < 20 ? heightOfParent - e.pageY : 20; // eventually is zero
        window.scrollBy(0, scrollby);
        // }
    }

    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;
    if (!isTargetTime && nextEle && (draggingRect.bottom > nextEle.getBoundingClientRect().top)) {
        isTargetTime = true;
        targetEle = nextEle;
    }

    if (!isTargetTime && prevEle && (draggingRect.top < prevEle.getBoundingClientRect().bottom)) {
        isTargetTime = true;
        targetEle = prevEle;
    }

    if (targetEle) {
        targetEle.style['background'] = 'blue';
    }

    if (targetEle) {
        if ((draggingRect.top > targetEle.getBoundingClientRect().bottom) || (draggingRect.bottom < targetEle.getBoundingClientRect().top)) {
            resetTarget();
        }
    }

    if (prevEle && isAbove(draggingEle, prevEle)) { // going up and fires twice!!!
        // console.log("swap 1");
        resetTarget();
        swap(placeholder, draggingEle);
        swap(placeholder, prevEle);
        return;
    }
    if (nextEle && isAbove(nextEle, draggingEle)) { // going down, fires once only
        // console.log("swap2");
        resetTarget();
        swap(nextEle, placeholder);
        swap(nextEle, draggingEle);
    }
};

const mouseUpHandler = function () {
    console.log("In mouseUpHandler");
    document.removeEventListener('mousemove', mouseMoveHandler);
    placeholder && placeholder.parentNode.removeChild(placeholder);
    isDraggingStarted = false;

    enumerateItems();

    if (targetEle) {
        resetTarget();
    }

    // Remove the position styles
    console.warn("removing top, left and position properties. Affects width?");
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    draggingEle = null;

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    // listNodesInOrder();
};

const isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
}

const swap = (nodeA, nodeB) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
}

function enumerateItems() {
    let orderArr = []; // modern way to instantiate an array
    let order = 0;
    document.querySelectorAll(".item").forEach((item) => {
        let myObj = {};
        myObj.textid = item.dataset.textid;
        myObj.userid = userid;
        myObj.order = order++;
        orderArr.push(myObj);
    });

    let orderingData = JSON.stringify(orderArr);
    const myUrl = url2 + "/php/reorderReaders.php";

    // How about using this opportunity to try a different way of uploading than ajax... er... fetch?
    $.ajax({
        url: myUrl,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        data: orderingData,
        crossDomain: true,
        success: function () {
            console.log("Uploaded Reordering Data Successfully");
        },
        error: function () {
            console.error("Problem Uploading Reordering Data:");
        }
    });
}

const resetTarget = () => {
    console.log('resetting target');
    targetEle?.style.removeProperty('background');
    // document.removeEventListener('mousemove', mouseMoveHandler);
    // document.removeEventListener('mouseup', mouseUpHandler);
    // targetEle = null;
    isTargetTime = false;
}
