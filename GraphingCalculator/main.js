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
    class Asign{
        type = "asign";
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
            if(char == "+" || char == "-" || char == "*" || char == "/" || char == "^" || char == "&" || char == "|"){
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
            if(char == "="){
                let term = new Asign();
                terms[terms.length] = term;
                continue;
            }
            if(!isNaN(parseInt(char))){
                let num = "";
                while(!isNaN(parseInt(char)) || char == "."){
                    num = num + char;
                    i++;
                    char = text[i];
                }
                i--;
                let term = new Num();
                term.value = parseFloat(num);
                terms[terms.length] = term;
                continue;
            }
            if(char.toLowerCase() != char.toUpperCase()){
                let num = "";
                while(!isNaN(parseInt(char)) || char.toLowerCase() != char.toUpperCase()){
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
                i--;
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
    function parseTerm(term){
        
    }
    function parse(terms, start){
        let sign = 1;
        let buf = 0;
        let asign = false;
        let asignVar = "";
        if(terms[start].type == "var"){
            if(terms[1] != undefined){
                if(start == 0 && terms[1].type == "asign"){
                    asign = true;
                    asignVar = terms[0].value;
                    start += 2;
                }
            }
        }
        if(terms[start].type == "expr"){
            if(terms[start].expr == "-"){
                sign = -1;
                start++;
            }else{
                err("unexpected expr, term: " + start + ", expr: " + terms[start].expr);
            }
        }
        if(terms[start].type == "num"){
            buf = terms[start].value;
        }else if(terms[start].type == "var"){
            if(getType(terms[start].value) == "v"){
                buf = getVar(terms[start].value);
            }else{
                if(terms[start + 1] != undefined){
                    if(terms[start + 1].type == "paran" && terms[start + 1].open){
                        let param = parse(terms, start + 2);
                        buf = func(terms[start].value, param);
                        start = rtn;
                    }
                }
            }
        }else if(terms[start].type == "paran"){
            if(terms[start].open){
                buf = parse(terms, start + 1);
                start = rtn;
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
                    if(getType(term2.value) == "v"){
                        num = getVar(term2.value);
                    }else{
                        if(terms[i + 1] != undefined){
                            if(terms[i + 1].type == "paran" && terms[i + 1].open){
                                let param = parse(terms, i + 2);
                                num = func(term2.value, param);
                                i = rtn;
                            }
                        }
                    }
                }else if(term2.type == "paran"){
                    if(term2.open){
                        num = parse(terms, i + 1);
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
                if(term.expr == "&"){
                    buf = buf & num;
                }
                if(term.expr == "|"){
                    buf = buf | num;
                }
                if(term.expr == "^"){
                    buf = Math.pow(buf, num);
                }
            }
            else if(term.type == "paran"){
                if(term.open == false){
                    rtn = i;
                    return buf;
                }else{
                    buf = buf * parse(terms, i + 1);
                    i = rtn;
                }
            }
            else if(term.type == "var"){
                buf = buf * getVar(term.value);
            }
            else{
                err("unexpected term: " + term.type + " at " + i);
            }
        }
        if(asign){
            vars[asignVar] = buf;
            return NaN;
        }
        return buf;
    }
    let globalVars = new Object();
    globalVars["pi"]     = Math.PI;
    globalVars["e"]      = Math.E;
    let globalFuncs = new Object();
    globalFuncs["sqrt"]  = Math.sqrt;
    globalFuncs["sin"]   = Math.sin;
    globalFuncs["cos"]   = Math.cos;
    globalFuncs["tan"]   = Math.tan;
    globalFuncs["asin"]  = Math.asin;
    globalFuncs["acos"]  = Math.acos;
    globalFuncs["atan"]  = Math.atan;
    globalFuncs["abs"]   = Math.abs;
    globalFuncs["round"] = Math.round;
    globalFuncs["ceil"]  = Math.ceil;
    globalFuncs["floor"] = Math.floor;
    let vars = new Object();
    function getVar(name){
        if(vars[name] != undefined){
            return vars[name];
        }else{
            if(globalVars[name] != undefined){
                return globalVars[name];
            }else{
                err("undefined var: " + name);
            }
        }
    }
    function getType(name){
        if(vars[name] != undefined || globalVars[name] != undefined){
            return "v";
        }
        if(globalFuncs[name] != undefined){
            return "f";
        }
        err("undefined var: " + name);
    }
    function func(name, param){
        if(globalFuncs[name] != undefined){
            return globalFuncs[name](param);
        }else{
            err("undefined func: " + name);
        }
    }

    let hasErr = false;
    function err(msg){
        hasErr = true;
        document.getElementById("err").innerHTML = msg;
    }
    function update(){
        vars = new Object();
        document.getElementById("err").innerHTML = "no errors :)";
        hasErr = false;
        let val = document.getElementById("x").value;
        if(val == ""){
            let canvas = document.getElementById("graph");
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#808080';
            let size = document.getElementById("size").value;
            size = parseInt(size);
            let lineStep = parseFloat(document.getElementById("lineStep").value);
            if(lineStep <= 0){
               lineStep = 1;
            }
            if(size <= 0){
                size = 5;
            }
            for(let x = 0; x <= size; x += lineStep){
                if(x == 0){
                    continue;
                }
                for(let s = -1; s < 2; s+=2){
                    let x2 = x * s + size;
                    ctx.beginPath();
                    ctx.moveTo(x2 * (canvas.width/(size * 2)), 0);
                    ctx.lineTo(x2 * (canvas.width/(size * 2)), canvas.height);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, x2 * (canvas.height/(size * 2)));
                    ctx.lineTo(canvas.width, x2 * (canvas.height/(size * 2)));
                    ctx.stroke();
                }
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
            let step = document.getElementById("step").value;
            step = parseFloat(step);
            if(step <= 0){
                step = 1;
            }
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#f08080';
            let prevPoints = [];
            let termList = [];
            for(let l = 1; l < 3; l++){
                termList[l-1] = tokenize(document.getElementById("e" + l).value);
                if(hasErr){
                    return;
                }
                document.getElementById("e" + l + "rtn").innerHTML = "";
            }
            
            for(let x = -size; x <= size; x+=step){
                vars["x"] = x;
                for(let l = 0; l < termList.length; l++){
                    if(termList[l].length == 0){continue;}
                    if(x == -size){
                        prevPoints[l] = parse(termList[l], 0);
                        continue;
                    }
                    let out = parse(termList[l], 0);
                    if(hasErr){return;}
                    ctx.beginPath();
                    ctx.moveTo((x + size - step)/(size * 2) * canvas.width, (-prevPoints[l] + size)/(size * 2) * canvas.height);
                    ctx.lineTo((x + size)/(size * 2) * canvas.width, (-out + size)/(size * 2) * canvas.height);
                    ctx.stroke();
                    prevPoints[l] = out;
                }
            }
        }else{
            let x = parse(tokenize(val), 0, 0);
            for(let l = 1; l < 3; l++){
                let terms = tokenize(document.getElementById("e" + l).value);
                vars["x"] = x;
                let out = parse(terms, 0);
                document.getElementById("e" + l + "rtn").innerHTML = out;
            }
        }
    }
    window.addEventListener("keydown", function(event){
        if(event.key == "enter"){
            update();
        }
    }, true);
}catch(e){
    alert(":(");
    alert(e);
}