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
            if(char === undefined){
                continue;
            }
            if(char == " "){
                continue;
            }
            if(char == "+" || char == "-" || char == "*" || char == "/" || char == "^"){
                let term = new Expr();
                term.expr = char;
                terms[terms.length] = term;
                continue;
            }
            if(char == "("){
                let term = new Paran();
                term.open = true;
                terms[terms.length] = term;
                continue;
            }
            if(char == ")"){
                let term = new Paran();
                term.open = false;
                terms[terms.length] = term;
                continue;
            }
            if(/^\d+$/.test(char)){
                let num = "";
                while(/^\d+$/.test(char) || char == "."){
                    num = num + char;
                    i++;
                    char = text[i];
                }
                let term = new Num();
                term.value = parseFloat(num);
                terms[terms.length] = term;
                continue;
            }
            if(char.toLowerCase() != char.toUpperCase()){
                let num = "";
                while(/^\d+$/.test(char) || char.toLowerCase() != char.toUpperCase()){
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
                let term = new Var();
                term.value = num;
                terms[terms.length] = term;
                continue;
            }
            err("unexpected symbol: " + char);
        }
        return terms;
    }
    let rtn = 0;
    function parse(terms, x, start){
        let sign = 1;
        let buf = 0;
        if(terms[start].type == "expr"){
            if(terms[start].expr == "-"){
                sign = -1;
                start = start + 1;
            }else{
                err("unexpected expr, term: " + start + ", expr: " + terms[start].expr);
            }
        }
        if(terms[start].type == "num"){
            buf = terms[start].value;
        }else if(terms[start].type == "var"){
            if(terms[start].value == "x"){
                buf = x;
            }else{
                err("undefined var: " + terms[start].value);
            }
        }else if(terms[start].type == "paran"){
            if(terms[start].open){
                buf = parse(terms, x, start + 1);
                start = rtn - 1;
            }
        }
        buf = buf * sign;
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
                    }else{
                        err("undefined var: " + term2.value);
                    }
                }else if(term2.type == "paran"){
                    if(term2.open){
                        num = parse(terms, x, i + 1);
                        i = rtn;
                    }else{
                        err("unexpected close paran at " + i);
                    }
                }
                else{
                    err("expected number, got " + term2.type);
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
            else if(term.type == "paran"){
                if(term.open == false){
                    rtn = i + 1;
                    return buf;
                }
            }
            else{
                err("unexpected term: " + term.type + " at " + i);
            }
        }
        return buf;
    }
    let hasErr = false;
    function err(msg){
        hasErr = true;
        document.getElementById("err").innerHTML = msg;
    }
    function update(){
        document.getElementById("err").innerHTML = "no errors :)";
        hasErr = false;
        let canvas = document.getElementById("graph");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width, canvas.height);

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#808080';
        
        for(let x = 0; x < 11; x++){
            if(x == 5){
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(x * (canvas.width/10), 0);
            ctx.lineTo(x * (canvas.width/10), canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, x * (canvas.height/10));
            ctx.lineTo(canvas.width, x * (canvas.height/10));
            ctx.stroke();
        }
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';

        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();

        let textBox = document.getElementById("expression");
        let text = textBox.value;
        let terms = tokenize(text);
        
        for(let i = 0; i < terms.length; i++){
            alert(terms[i].type);
        }

        if(hasErr){return;}

        let step = document.getElementById("step").value;
        step = parseFloat(step);

        if(step <= 0){
            step = 1;
        }
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#f08080';
        
        let prevPoint = 0;

        for(let x = -5; x <= 5; x+=step){
            if(x == -5){
                prevPoint = parse(terms, x, 0);
                continue;
            }
            let out = parse(terms, x, 0);
            if(hasErr){return;}
            ctx.beginPath();
            ctx.moveTo((x + 5 - step)/10 * canvas.width, (-prevPoint + 5)/10 * canvas.height);
            ctx.lineTo((x + 5)/10 * canvas.width, (-out + 5)/10 * canvas.height);
            ctx.stroke();
            prevPoint = out;
        }
    }
}catch(e){
    alert(":(");
    alert(e);
}