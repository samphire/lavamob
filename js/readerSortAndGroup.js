let draggingEle;
let targetEle;
let isDraggingStarted = false;
let isTargetTime = false;
let placeholder;
let mousePositionInEl;

const mouseDownHandler = function (e) {
    draggingEle = e.currentTarget;

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
        // console.log("scrollby: " + scrollby);
        // console.log("window.scrollY, heightOfParent, window.innerHeight, outerHeight, mousePositionInEl, e.pageY: " + window.scrollY + ", " + heightOfParent + ", " + window.innerHeight + ", " + window.outerHeight + ", " + mousePositionInEl + ", " + e.pageY);
        // console.log("e.pageY - mousePositionInEl - heightOfParent + elHeight: " + (e.pageY - mousePositionInEl - heightOfParent + elHeight));
        // if (window.scrollY + window.outerHeight < heightOfParent) {
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
    placeholder && placeholder.parentNode.removeChild(placeholder);
    isDraggingStarted = false;

    enumerateItems();

    if (targetEle) {
        // alert("source is " + draggingEle.innerText + " and target is " + targetEle.innerText);
        resetTarget();
    }

    // Remove the position styles
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
    document.querySelectorAll(".item").forEach((item) => {
        console.log(item.dataset.textid);
    })
}


const deleteTextNodes = () => {
    list.childNodes.forEach((nodey) => {
        if (nodey.nodeType === 3) {
            nodey.parentNode.removeChild(nodey);
        }
    })
};

const resetTarget = () => {
    targetEle?.style.removeProperty('background');
    targetEle = null;
    isTargetTime = false;
}

// deleteTextNodes();
