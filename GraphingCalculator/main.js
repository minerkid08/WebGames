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
                        if(char === undefined){
                            break;
                        }
                    }
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
        }
        alert("parsed");
        return terms;
    }
    function parse(terms, x){
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
                }else if(term2.type == "var"){
                    if(term2.value == "x"){
                        num = x;
                    }
                }else{  
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
            let out = parse(terms, x);
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