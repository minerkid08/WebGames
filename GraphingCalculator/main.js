try{
    class Expr{
        type = "expr";
        expr = "";
    }
    class Num{
        type = "num";
        value = 0;
    }
    class Var{
        type = "var";
        value = "";
    }
    class Paran{
        type = "paran";
        open = false;
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
            if(char !== undefined){
                if(char.toLowerCase() != char.toUpperCase()){
                    let num = "";
                    while(!isNaN(char) || char.toLowerCase() != char.toUpperCase()){
                        num = num + char;
                        i++;
                        char = text[i];
                        if(char == " "){
                            break;
                        }
                        if(char === undefined){
                            break;
                        }
                    }
                    alert("var '" + num + "'");
                    let term = new Var();
                    term.value = num;
                    terms[terms.length] = term;
                }
            }
            if(char == "+" || char == "-" || char == "*" || char == "/" || char == "^"){
                let term = new Expr();
                term.expr = char;
                terms[terms.length] = term;
            }
            if(char == "("){
                let term = new Paran();
                term.open = true;
                terms[terms.length] = term;
            }
            if(char == ")"){
                let term = new Paran();
                term.open = false;
                terms[terms.length] = term;
            }
        }
        alert("parsed");
        return terms;
    }
    let rtn = 0;
    function parse(terms, x, start){
        let buf = 0;
        if(terms[start].type == "num"){
            buf = terms[start].value;
        }else if(terms[start].type == "var"){
            if(terms[start].value == "x"){
                buf = x;
            }
        }
        for(let i = start + 1; i < terms.length; i++){
            let term = terms[i];
            if(term.type == "expr"){
                i++;
                let term2 = terms[i];
                let num = 0;
                if(term2.type == "num"){
                    num = term2.value;
                }else if(term2.type == "var"){
                    if(term2.value == "x"){
                        num = x;
                    }
                }else if(term2.type == "paran"){
                    alert(terms[i + 1].value);
                    return 3;
                    if(term2.open){
                        num = parse(terms, x, i + 1);
                        i = rtn;
                    }
                }
                else{  
                    alert("expected number, got " + term2.type + " , " + term2.expr);
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
            if(term.type == "paran"){
                if(term.open == false){
                    return buf;
                    rtn = i + 1;
                }
            }
        }
        return buf;
    }
    function update(){
        alert("run");
        let canvas = document.getElementById("graph");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width, canvas.height);
        let textBox = document.getElementById("expression");
        let text = textBox.value;
        let terms = tokenize(text);
        for(let x = 0; x < 11; x++){
            let out = parse(terms, x, 0);
            ctx.beginPath();
            ctx.arc(x/10 * canvas.width, out/10 * canvas.height, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
        }
    }
}catch(e){
    alert(":(");
    alert(e);
}