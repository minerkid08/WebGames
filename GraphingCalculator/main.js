import {parse, tokenize} from "./parser.js";
function update(){
    let textBox = document.getElementById("expression");
    let text = textBox.value;
    let terms = tokenize(text);
    let out = parse(terms);
    alert(out);
}