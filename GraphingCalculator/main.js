import {parse, tokenize} from "./parser.js";
function update(){
    alert("run");
    let textBox = document.getElementById("expression");
    let text = textBox.value;
    alert(text);
    let terms = tokenize(text);
    let out = parse(terms);
    alert(out);
}