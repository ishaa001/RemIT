// const searchBar = document.querySelector('.search-bar');
// var searchIcon = document.getElementsByClassName('search-icon');
// // var placeholder = searchBar.getAttribute("placeholder");



// if (document.activeElement === searchBar) {
//     console.log("Hiii");
//     searchBar.classList.add('focusClass');
// }

var div = document.getElementById('nav-bar');
var add0 = document.getElementById('add0');

var add1 = document.getElementById('add1');


var name0 = document.getElementById('input-name0');
var addButton0 = document.getElementById('add-button0');
var cancelButton0 = document.getElementById('cancel-button0');

var name1 = document.getElementById('input-name1');
var addButton1 = document.getElementById('add-button1');
var cancelButton1 = document.getElementById('cancel-button1');


add1.style.opacity = 0;


add0.addEventListener("click", function () { pop('card0') });
add1.addEventListener("click", function () { pop('card1') });


function pop(cardId) {
    document.getElementById(cardId).style.visibility = "visible";
    document.getElementById('body').classList.add("body1");
}
div.onmousemove = function () {
    add1.style.opacity = 1;
}
div.onmouseout = function () {
    add1.style.opacity = 0;
}

var menu = document.getElementById("menu-icon");
var navbar = document.getElementById("nav-bar");
menu.addEventListener("click", toggle);

var flag = 0;
function toggle() {

    if (flag === 0) {
        navbar.style.left = "-20%";
        flag = 1;
    }
    else {
        navbar.style.left = "0px";
        flag = 0;
    }
}

name0.addEventListener("keyup", function () { disable('input-name0', 'add-button0') });
name1.addEventListener("keyup", function () { disable('input-name1', 'add-button1') });


function disable(inputId, buttonId) {
    if (document.getElementById(inputId).value === '') {
        document.getElementById(buttonId).disabled = true;
        document.getElementById(buttonId).style.opacity = 0.5;
    }
    else {
        document.getElementById(buttonId).disabled = false;
        document.getElementById(buttonId).style.opacity = 1;
    }
}
cancelButton0.addEventListener("click", function () { gone('card0') });
cancelButton1.addEventListener("click", function () { gone('card1') });

function gone(cardId) {
    document.getElementById(cardId).style.visibility = "hidden";
    document.getElementById('body').classList.remove("body1");
}

var dropButton = document.getElementById('project-button');
var projectList = document.getElementsByClassName('project-item')
var dropButton1 = document.getElementById('project-button1');
var projectList1 = document.getElementsByClassName('project-item1')
var dropButton2 = document.getElementById('project-button2');
var projectList2 = document.getElementsByClassName('project-item2')
var img1 = document.getElementById('myImageId1');
var img2 = document.getElementById('myImageId2');
var img3 = document.getElementById('myImageId3');
var img4 = document.getElementById('myImageId4');
var img5 = document.getElementById('myImageId5');
var img6 = document.getElementById('myImageId6');

dropButton.addEventListener("click", show);
dropButton1.addEventListener("click", show1);
dropButton2.addEventListener("click", show2);

var flag = 0;
function show() {
    if (flag == 0) {
        img1.style.visibility = 'hidden';
        img2.style.visibility = 'visible';
        flag = 1;
        for (var i = 0; i < 4; i++) {
            projectList[i].style.position = "relative";
            projectList[i].style.visibility = "visible";
        }
    }
    else if (flag == 1) {
        img2.style.visibility = 'hidden';
        img1.style.visibility = 'visible';
        flag = 0;
        for (var i = 0; i < 4; i++) {
            projectList[i].style.position = "absolute";
            projectList[i].style.visibility = "hidden";
        }
    }
}

function show1() {
    if (flag == 0) {
        img3.style.visibility = 'hidden';
        img4.style.visibility = 'visible';
        flag = 1;
        for (var i = 0; i < 4; i++) {
            projectList1[i].style.position = "relative";
            projectList1[i].style.visibility = "visible";
        }
    }
    else if (flag == 1) {
        img4.style.visibility = 'hidden';
        img3.style.visibility = 'visible';
        flag = 0;
        for (var i = 0; i < 4; i++) {
            projectList1[i].style.position = "absolute";
            projectList1[i].style.visibility = "hidden";
        }
    }
}

function show2() {
    if (flag == 0) {
        img5.style.visibility = 'hidden';
        img6.style.visibility = 'visible';
        flag = 1;
        for (var i = 0; i < 3; i++) {
            projectList2[i].style.position = "relative";
            projectList2[i].style.visibility = "visible";
        }

    }
    else if (flag == 1) {
        img6.style.visibility = 'hidden';
        img5.style.visibility = 'visible';
        flag = 0;
        for (var i = 0; i < 3; i++) {
            projectList2[i].style.position = "absolute";
            projectList2[i].style.visibility = "hidden";
        }
    }
}
