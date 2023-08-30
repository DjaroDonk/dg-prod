var line_size = 16;
function update_paper_size(){
    document.getElementById("paper").style.height = line_size * 30 + "px";
}

function highlight_line(id_num){
    var item = document.getElementById("line" + id_num);
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
    var item = document.getElementById("line" + id_num);
    item.classList.remove("editing");
}

function next_line(){
    var act_el = document.activeElement;
    if (act_el == document.body) {
        document.getElementById("line1").focus();
    }
    const detector = /line[1-9][0-9]*/;
    if (detector.test(act_el.id)) {
        var id_num = parseInt(act_el.id.slice(4,));
        console.log("line" + (id_num+1));
        document.getElementById("line" + (id_num+1)).focus();
    }

}

function init(){
    update_paper_size();
    var paper = document.getElementById("paper");
    for (let i = 0; i < 16; i++) {
        var writeableLine = document.createElement("p");
        writeableLine.contentEditable = true;
        writeableLine.id = "line" + (i+1);
        writeableLine.className = "paperwriting";
        writeableLine.onfocus = function() {highlight_line(i+1);};
        writeableLine.onblur = function() {unhighlight_line(i+1);};
        paper.appendChild(writeableLine);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        next_line();
    }
});