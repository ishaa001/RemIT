var div = document.getElementById('nav-bar');
var add4 = document.getElementById('add4');

var name4 = document.getElementById('input-name4');
var addButton4 = document.getElementById('add-button4');
var cancelButton4 = document.getElementById('cancel-button4');

add4.addEventListener("click", function () { pop('card4') });


// console.log("Hiiii");

function pop(cardId) {
    document.getElementById(cardId).style.visibility = "visible";
    document.getElementById('overlay').classList.add("overlay");
}

name4.addEventListener("keyup", function () { disable('input-name4', 'add-button4') });

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
cancelButton4.addEventListener("click", function () { gone('card4') });

function gone(cardId) {
    document.getElementById(cardId).style.visibility = "hidden";
    document.getElementById('overlay').classList.remove("overlay");
}