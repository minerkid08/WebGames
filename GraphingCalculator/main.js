try{
    class Expr{
        type = "expr";
        expr = "";
    }
    class Num{
        type = "num";
        value = 0;
    }
    function tokenize(text){
        let terms = [];
        for(let i = 0; i < text.length; i++){
            let char = text[i];
            if(char == " "){
                continue;
            }
            if(!isNaN(char)){
                let num = "";
                while(!isNaN(char) || char == "."){
                    num = num + char;
                    i++;
                    char = text[i];
                }
                let term = new Num();
                term.value = parseFloat(num);
                terms[terms.length] = term;
            }
            if(char == "+" || char == "-" || char == "*" || char == "/" || char == "^"){
                let term = new Expr();
                term.expr = char;
                terms[terms.length] = term;
            }
        }
        return terms;
    }
    function parse(terms){
        let buf = 0;
        if(terms[0].type == "num"){
            buf = terms[0].value;
        }
        for(let i = 1; i < terms.length; i++){
            let term = terms[i];
            if(term.type == "expr"){
                i++;
                let term2 = terms[i];
                let num = 0;
                if(term2.type == "num"){
                    num = term2.value;
                }else{  
                    console.log("expected number, got " + term2.type + " , " + term2.expr);
                }
                if(term.expr == "+"){
                    buf = buf + num;
                }
                if(term.expr == "-"){
                    buf = buf - num;
                }
                if(term.expr == "*"){
                    buf = buf * num;
                }
                if(term.expr == "/"){
                    buf = buf / num;
                }
                if(term.expr == "^"){
                    buf = Math.pow(buf, num);
                }
            }
        }
        return buf;
    }
    function update(){
        let textBox = document.getElementById("expression");
        let text = textBox.value;
        let terms = tokenize(text);
        let out = parse(terms);
        alert(out);
    }
}catch(e){
    alert(e);
}