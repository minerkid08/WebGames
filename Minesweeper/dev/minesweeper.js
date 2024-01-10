try{
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let gridSize = 10;
let bombCount = 25;
let negBombCount = 25;
let box = 64;
let countC = document.getElementById("count");
let countCtx = countC.getContext("2d");
//other things
const Rules = {
	none: Symbol("none"),
	triplets: Symbol("triplets"),
	multiple: Symbol("multiple"),
	negmine: Symbol("negmine")
}
const Cell = {
	none: Symbol("none"),
	flag: Symbol("flag"),
	mine: Symbol("mine"),
	negmine: Symbol("negmine"),
	empty: Symbol("empty")
}
let rule = Rules.triplets;
function setRule(i){
	switch(i){
		case 1:
			rule = Rules.triplets;
			break;
		case 2:
			rule = Rules.multiple;
			break;
		case 3:
			rule = Rules.none;
			break;
	}
    reset();
}
//let bCount = document.getElementById("bCount");
//let size = document.getElementById("size");
function reset(){
    gridSize = parseInt(document.getElementById("gridSize").value);
    bombCount = parseInt(document.getElementById("bombCount").value);
    box = canvas.width / gridSize;
	game.start();
	drawBoard();
	game.draw();
	game.updateCount();
}
class KeyInput{
	constructor(){
		this.x = 0;
		this.y = 0;
	}
	event(e){
		switch(e.key){
			case "ArrowUp":
				this.y = this.y - 1;
				break;
			case "ArrowDown":
				this.y = this.y + 1;
				break;
			case "ArrowLeft":
				this.x = this.x - 1;
				break;
			case "ArrowRight":
				this.x = this.x + 1;
				break;
			case "Shift":
				game.btn = 0;
				game.update(this.x, this.y);
				break;
			case "Control":
				game.btn = 1;
				game.update(this.x, this.y);
				break;
		}
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x >= gridSize-1){
            this.x = gridSize-1;
        }
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y >= gridSize-1){
            this.y = gridSize-1;
        }
		drawGame();
	}
	draw(){
		ctx.strokeStyle = "#0000F0";
		ctx.strokeRect((this.x*box)+3, (this.y*box)+3, box-6, box-6);
	}
}
let input = new KeyInput();
window.addEventListener("keydown", function(event){
	input.event(event);
}, true);
class Game{
	start(){
		canvas.width = box * gridSize;
		canvas.height = box * gridSize;
		ctx.font = box+"px Courier New";
		countC.style.left = "8px";
		countC.style.top = 10*(64+1)-2+"px";
		countC.style.position = "absolute";
		countC.width = box;
		countC.height = box;
		this.b = bombCount;
		this.active = true;
		this.win = false;
		this.loose = false;
        this.prevLoose = false;
		this.grid = new Array(gridSize);
		for(let x = 0; x < gridSize; x++){
			this.grid[x] = new Array(gridSize);
			for(let y = 0; y < gridSize; y++){
				this.grid[x][y] = 0
			}
		}
		this.pgrid = new Array(gridSize);
		for(let x = 0; x < gridSize; x++){
			this.pgrid[x] = new Array(gridSize);
			for(let y = 0; y < gridSize; y++){
				this.pgrid[x][y] = -2;
			}
		}
		for(let i = 0; i < bombCount; i++){
			let placed = false;
			let iterCount = 0;
			while(!placed){
				iterCount++;
				let x = Math.floor(Math.random() * gridSize);
				let y = Math.floor(Math.random() * gridSize);
				if(this.grid[x] == null){
					this.grid[x] = [];
				}
				if(this.grid[x][y] != -1){
					let hasTriplet = false;
					if(rule == Rules.triplets){
						for(let mx = -1; mx < 2; mx++){
							if(this.grid[x+mx] == null){
								this.grid[x+mx] = [];
							}
							
							for(let my = -1; my < 2; my++){
								if(mx == 0 && my == 0){continue;}
								if(!this.valid(x+mx,y+my)){continue;}
								if(this.grid[x+mx][y+my] == -1){
									if(this.grid[x+(mx*2)][y+(my*2)] == -1){
										hasTriplet = true;
									}
									else if(this.valid(x+(mx*-1),y+(my*-1))){
										if(this.grid[x+(mx*-1)][y+(my*-1)] == -1){
											hasTriplet = true;
										}
									}
								}
							}
						}
					}
					if(iterCount > 20){
						return;
					}
					if(!hasTriplet){
						placed = true;
						this.grid[x][y] = -1;
						for(let mx = -1; mx <= 1; mx++){
							for(let my = -1; my <= 1; my++){
								if(mx == 0 && my == 0){
									continue;
								}
								if(this.valid(x+mx, y+my)){
									if(this.grid[x+mx][y+my] != -1){
										if(rule == Rules.multiple){
											if(x%2 == y%2){
												this.grid[x+mx][y+my]+=2;
											}else{
												this.grid[x+mx][y+my]++;
											}
										}else{
											this.grid[x+mx][y+my]++;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		for(let x = 0; x < gridSize; x++){
			for(let y = 0; y < gridSize; y++){
				if(this.grid[x][y] == 0){
					this.btn = 0;
					this.update(x,y);
					return;
				}
			}
		}
	}
	update(_x, _y){
		if(!this.active){return;}
		let x = Math.floor(this.x/box);
		let y = Math.floor(this.y/box);
		if(_x != null){
			x = _x;
		}
        if(_y != null){
            y = _y;
        }
		if(!this.valid(x,y)){return;}
			if(this.btn == 0){
				if(this.pgrid[x][y] != 0){
					if(this.pgrid[x][y] != -2){
						if(this.pgrid[x][y] != -3){
							let bomb = 0;
							let empty = 0;
							for(let mx = -1; mx < 2; mx++){
								for(let my = -1; my < 2; my++){
									if(mx == 0 && my == 0){continue;}
									if(!this.valid(x+mx, y+my)){continue;}
									if(rule != Rules.multiple){
										if(this.pgrid[x+mx][y+my] == -2){
											empty++;
										}
										if(this.pgrid[x+mx][y+my] == -3){
											bomb++;
										}
									}else{
										let g = (((x+mx)%2==(y+my)%2) ? 2 : 1);
										if(this.pgrid[x+mx][y+my] == -2){
											empty+=g;
										}
										if(this.pgrid[x+mx][y+my] == -3){
											bomb+=g;
										}
									}
								}
							}
							if(empty + bomb == this.pgrid[x][y]){
								for(let mx = -1; mx < 2; mx++){
									for(let my = -1; my < 2; my++){
										if(!this.valid(x+mx, y+my)){continue;}
										if(this.pgrid[x+mx][y+my] == -2){
											this.pgrid[x+mx][y+my] = -3;
											this.b--;
										}
									}
								}
							}
							if(bomb == this.pgrid[x][y]){
								for(let mx = -1; mx < 2; mx++){
									for(let my = -1; my < 2; my++){
										if(!this.valid(x+mx, y+my)){continue;}
										if(this.pgrid[x+mx][y+my] == -2){
											this.pgrid[x+mx][y+my] = this.grid[x+mx][y+my];
											if(this.grid[x+mx][y+my] == 0){
												this.reveal(x+mx,y+my);
											}
											if(this.grid[x+mx][y+my] == -1){
												this.loose = true;
												this.active = false;
												this.revealMap();
											}
										}
									}
								}
							}
							this.isDone();
							this.updateCount();
						}
						return;
					}
				}
			if(this.grid[x][y] == -1){  
				this.loose = true;
				this.active = false;
				this.revealMap();
			}
			this.pgrid[x][y] = this.grid[x][y];
			if(this.pgrid[x][y] == 0){
				this.reveal(x,y);
			}
			this.isDone();
		}else{
			if(this.pgrid[x][y] != -2 && this.pgrid[x][y] != -3){return;}
			if(this.pgrid[x][y] == -3){
				this.b++;
			this.pgrid[x][y] = -2;
			}else{
				this.pgrid[x][y] = -3;
				this.b--;
			}
			this.updateCount();
		}
		if(this.loose && !this.prevLoose){
			this.prevLoose = true;
            document.cookie = parseInt(document.cookie) - 1;
			alert("update cookie loose");``
		}
	}
	isDone(){
		if(!this.loose){
			let c = 0;
			for(let x = 0; x < gridSize; x++){
				for(let y = 0; y < gridSize; y++){
					if(this.pgrid[x][y] == this.grid[x][y] || this.grid[x][y] == -1){
						c++;
					}
				}
			}
			if(!this.win && c == gridSize * gridSize){
				document.cookie = parseInt(document.cookie) + 1;
                alert("update cookie win");``
			}
			this.win = (c == gridSize * gridSize);
			if(this.win){
				this.revealMap();
				this.active = false;
			}
		}
	}
	reveal(x,y){
		if(this.pgrid[x][y] != 0){return;}
		for(let mx = -1; mx <= 1; mx++){
			for(let my = -1; my <= 1; my++){
				if(mx == 0 && my == 0){
					continue;
				}
				if(this.valid(x+mx,y+my)){
					if(this.pgrid[x+mx][y+my] > -2){
						continue;
					}
					this.pgrid[x+mx][y+my] = this.grid[x+mx][y+my];
					if(this.grid[x+mx][y+my] == 0){
						this.reveal(x+mx,y+my);
					}
				}
			}
		}
	}
	draw(){
		for(let x = 0; x < gridSize; x++){
			for(let y = 0; y < gridSize; y++){
				let b = 0;
				let e = 0;
				let mb = 0;
				for(let mx = -1; mx < 2; mx++){
					for(let my = -1; my < 2; my++){
						if(mx == 0 && my == 0){continue;}
						if(this.valid(x+mx,y+my)){
							if(this.pgrid[x+mx][y+my] == -3){
								b++;
							}
							if(this.pgrid[x+mx][y+my] == -2){
								e++;
							}
							if(this.pgrid[x+mx][y+my] == -3){
								if((x+mx)%2 == (y+my)%2){
									mb+=2;
								}else{
									mb++;
								}
							}
						}
					}
				}
				if(
                    (
                        ((rule == Rules.multiple ? mb : b) == this.pgrid[x][y]) ||
                        this.pgrid[x][y] == -3
                    ) && e == 0 || this.win
                ){
					ctx.fillStyle = "#808080";
				}else{
					ctx.fillStyle = "#000000";
				}
                let drawDif = document.getElementsByName("drawDif")[0];
                let checked = false;
                if(drawDif != null){
                    checked = drawDif.checked;
                }
				ctx.fillText(
					(this.pgrid[x][y] == -2 ? " " : 
					(this.pgrid[x][y] == -1 ? "B" : 
					(this.pgrid[x][y] == -3 ? "F" : 
					(this.pgrid[x][y] == -4 ? "X" :
					(checked ? this.pgrid[x][y] - (rule == Rules.multiple ? mb : b) : 
                    this.pgrid[x][y]
                    ))))).toString(),(box*x)+box/4,(box*(y+1)-box/4)
                );
			}
		}
        input.draw();
		if(document.getElementById("winCount") != null){
			document.getElementById("winCount").innerHTML = "win count: " + document.cookie;
		}
	}
	mousePos(event){
		this.x = event.clientX;
		this.y = event.clientY;
		this.btn = event.button;
	}
	valid(x,y){
		return(x >= 0 && x < gridSize && y >= 0 && y < gridSize);
	}
	updateCount(){
		countCtx.clearRect(0,0,countC.width,countC.height);
		countC.width = 40 * this.b.toString().length;
		countC.height = 40;
		countCtx.font = "40px Courier New";
		let stg = this.b.toString();
		for(let i = 0; i < stg.length; i++){
			countCtx.strokeRect(i*40,0,40,40);
			countCtx.fillText(stg.charAt(i),(40*i)+5,35);
		}
	}
	revealMap(){
		for(let x = 0; x < gridSize; x++){
			for(let y = 0; y < gridSize; y++){
				if(this.win){
					if(this.pgrid[x][y] == -3){continue;}
					this.pgrid[x][y] = this.grid[x][y];
				}else if(this.loose){
					if(this.pgrid[x][y] == -3 && this.grid[x][y] != -1){
						this.pgrid[x][y] = -4;
					}else if(!(this.pgrid[x][y] == -3 && this.grid[x][y] == -1)){
						this.pgrid[x][y] = this.grid[x][y];
					}
				}else{return;}
			}
		}
	}
}
let game = null;
function update(event){
	game.mousePos(event);
    game.update();
	drawGame();
}
function drawGame(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBoard();
	game.draw();
}
addEventListener("load", (event) => {
	if(document.cookie == ""){
		document.cookie = 0;
	}
	game = new Game();
	game.start();
	game.updateCount();
	drawBoard();
	game.draw();
});
function drawBoard(){   
	// canvas dims
	const bw = box * gridSize;// box size
	ctx.lineWidth = 1;
	for (let x=0;x<gridSize;x++){
		for (let y=0;y<gridSize;y++){
			if(rule == Rules.multiple){
				if(x%2 == y%2){
					ctx.fillStyle = "#C0C0C0";
				}else{
					ctx.fillStyle = "#FFFFFF";
				}
			}else{
				ctx.fillStyle = "#FFFFFF";
			}
			ctx.fillRect(x*box,y*box,box,box);
			if(game.loose == true){
				ctx.strokeStyle = 'rgb(255,0,0)';
			}else if(game.win){
				ctx.strokeStyle = 'rgb(0,128,0)';
			}else{
				ctx.strokeStyle = 'rgb(0,0,0)';   
			}
			ctx.strokeRect(x*box,y*box,box,box);
		}
	}
}
}catch(err){
	alert(err);
}