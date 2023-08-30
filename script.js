var line_size = 16;
function update_paper_size(){
    document.getElementById("paper").style.height = line_size * 30 + "px";
}

function highlight_line(id_num){
    var item = document.getElementById("textline" + id_num);
    item.classList.add("editing");
    if (item.innerText == "") {
        item.innerText = "-\xa0";
    }
    /* From StackOverflow */
    var range = document.createRange()
    var sel = window.getSelection()
    
    range.setStart(item, 1)
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
    /* End of StackOverflow */
}

function unhighlight_line(id_num){
    var item = document.getElementById("textline" + id_num);
    item.classList.remove("editing");
    emptyline_detector = /^((-\s*)|(\s+))$/;
    if (emptyline_detector.test(item.innerText)) {
        item.innerText = "";
    }
}

function next_line(){
    var act_el = document.activeElement;
    if (act_el == document.body) {
        document.getElementById("textline1").focus();
    }
    const detector = /textline[1-9][0-9]*/;
    if (detector.test(act_el.id)) {
        var id_num = parseInt(act_el.id.slice(4,));
        if (id_num >= line_size) {
            act_el.blur();
            document.getElementById("textline1").focus();
        } else {
            console.log(id_num);
            document.getElementById("textline" + (id_num+1)).focus();
        }
        emptyline_detector = /^((-\s*)|(\s+))$/;
        if (emptyline_detector.test(act_el.innerText)) {
            act_el.innerText = "";
        }
    }
}

function previous_line(){
    var act_el = document.activeElement;
    if (act_el == document.body) {
        document.getElementById("textline1").focus();
    }
    const detector = /textline[1-9][0-9]*/;
    if (detector.test(act_el.id)) {
        var id_num = parseInt(act_el.id.slice(4,));
        if (id_num == 1) {
            act_el.blur();
            document.getElementById("textline" + line_size).focus();
        } else {
            document.getElementById("textline" + (id_num-1)).focus();
        }
        emptyline_detector = /(-\s*)|(\s+)/;
        emptyline_detector = /^((-\s*)|(\s+))$/;
        if (emptyline_detector.test(act_el.innerText)) {
            act_el.innerText = "";
        }
    }
}

var shift = false;
var ctrl = false;
document.addEventListener('keyup', function (event) {
    if (event.key === "Control") {
        ctrl = false;
    }
    if (event.key === 'Shift') {
        shift = false;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        next_line();
    }
    else if (event.key === 'ArrowDown') {
        event.preventDefault();
        next_line();
    }
    else if (event.key === 'ArrowUp') {
        event.preventDefault();
        previous_line();
    } else if (event.key === 'Shift') {
        if (!ctrl) {
            shift = true;
        }
    } else if (event.key === "Tab") {
        event.preventDefault();
        if (shift) {
            previous_line();
        } else {
            next_line();
        }
    }
    else if (event.key === "Control") {
        ctrl = true;
    }
});

window.addEventListener('focus', function(){
    ctrl = false;
    shift = false;
});

function localSave(){
    for (let i = 1; i <= 16; i++) {
        localStorage.setItem("textline" + i, document.getElementById("textline"+i).innerText);
    }
}

function localLoad(){
    for (let i = 1; i <= 16; i++) {
        document.getElementById("textline"+i).innerText = localStorage.getItem("textline" + i);
        emptyline_detector = /^((-\s*)|(\s+))$/;
        if (emptyline_detector.test(document.getElementById("textline"+i).innerText)) {
            document.getElementById("textline"+i).innerText = "";
        }
    }
}

function init(){
    update_paper_size();
    var paper = document.getElementById("paper");
    for (let i = 1; i <= 16; i++) {
        var writeableLine = document.createElement("p");
        writeableLine.contentEditable = true;
        writeableLine.id = "textline" + (i);
        writeableLine.className = "paperwriting";
        writeableLine.onfocus = function() {highlight_line(i);};
        writeableLine.onblur = function() {unhighlight_line(i);};
        paper.appendChild(writeableLine);
        document.getElementById("textline" + i).addEventListener("input", function() {
            localSave();
        }, false)
    }
    localLoad();
}

function resetAll(){
    localStorage.clear();
    localLoad();
}