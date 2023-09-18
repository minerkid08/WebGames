try{
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var gridSize = 10;
var bombCount = 25;
var negBombCount = 25;
const box = 64;
var countC = document.getElementById("count");
var countCtx = countC.getContext("2d");
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
var rule = Rules.triplets;
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
	game.start();
	drawBoard();
	game.draw();
	game.updateCount();
}
//var bCount = document.getElementById("bCount");
//var size = document.getElementById("size");
function reset(){
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
				game.x = this.x * box;
				game.y = this.y * box;
				game.update();
				break;
			case "Control":
				game.btn = 1;
				game.x = this.x * box;
				game.y = this.y * box; 
				game.update();
				break;
		}
		drawGame();
	}
	draw(){
		ctx.strokeStyle = "#0000F0";
		ctx.strokeRect((this.x*box)+3, (this.y*box)+3, box-6, box-6);
	}
}
var input = new KeyInput();
window.addEventListener("keydown", function(event){
	input.event(event);
}, true);
class Game{
	start(){
		canvas.width = box * gridSize;
		canvas.height = box * gridSize;
		ctx.font = box+"px Courier New";
		countC.style.left = "8px";
		countC.style.top = gridSize*(box+1)-2+"px";
		countC.style.position = "absolute";
		countC.width = box;
		countC.height = box;
		this.b = bombCount;
		this.active = true;
		this.win = false;
		this.loose = false;
		this.grid = new Array(gridSize);
		for(var x = 0; x < gridSize; x++){
			this.grid[x] = new Array(gridSize);
			for(var y = 0; y < gridSize; y++){
				this.grid[x][y] = 0
			}
		}
		this.pgrid = new Array(gridSize);
		for(var x = 0; x < gridSize; x++){
			this.pgrid[x] = new Array(gridSize);
			for(var y = 0; y < gridSize; y++){
				this.pgrid[x][y] = -2;
			}
		}
		for(var i = 0; i < bombCount; i++){
			var placed = false;
			while(!placed){
				var x = Math.floor(Math.random() * gridSize);
				var y = Math.floor(Math.random() * gridSize);
				if(this.grid[x] == null){
					this.grid[x] = [];
				}
				if(this.grid[x][y] != -1){
					var hasTriplet = false;
					if(rule == Rules.triplets){
						for(var mx = -1; mx < 2; mx++){
							if(this.grid[x+mx] == null){
								this.grid[x+mx] = [];
							}
							
							for(var my = -1; my < 2; my++){
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
					if(!hasTriplet){
						placed = true;
						this.grid[x][y] = -1;
						for(var mx = -1; mx <= 1; mx++){
							for(var my = -1; my <= 1; my++){
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
		for(var x = 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
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
		var x = Math.floor(this.x/box);
		var y = Math.floor(this.y/box);
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
							var bomb = 0;
							var empty = 0;
							for(var mx = -1; mx < 2; mx++){
								for(var my = -1; my < 2; my++){
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
										var g = (((x+mx)%2==(y+my)%2) ? 2 : 1);
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
								for(var mx = -1; mx < 2; mx++){
									for(var my = -1; my < 2; my++){
										if(!this.valid(x+mx, y+my)){continue;}
										if(this.pgrid[x+mx][y+my] == -2){
											this.pgrid[x+mx][y+my] = -3;
											this.b--;
										}
									}
								}
							}
							if(bomb == this.pgrid[x][y]){
								for(var mx = -1; mx < 2; mx++){
									for(var my = -1; my < 2; my++){
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
	}
	isDone(){
		if(!this.loose){
			var c = 0;
			for(var x = 0; x < gridSize; x++){
				for(var y = 0; y < gridSize; y++){
					if(this.pgrid[x][y] == this.grid[x][y] || this.grid[x][y] == -1){
						c++;
					}
				}
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
		for(var mx = -1; mx <= 1; mx++){
			for(var my = -1; my <= 1; my++){
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
		for(var x = 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
				if(this.pgrid[x][y] > -1){
					var b = 0;
					var e = 0;
					var mb = 0;
					for(var mx = -1; mx < 2; mx++){
						for(var my = -1; my < 2; my++){
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
					if(((rule == Rules.multiple ? mb : b) == this.pgrid[x][y] && e == 0) || (this.pgrid[x][y] == -3 && e == 0)){
						ctx.fillStyle = "#808080";
					}else{
						ctx.fillStyle = "#000000";
					}
				}else{
					ctx.fillStyle = "#000000";
				}
				ctx.fillText(
					(this.pgrid[x][y] == -2 ? " " : 
					(this.pgrid[x][y] == -1 ? "B" : 
					(this.pgrid[x][y] == -3 ? "F" : 
					(this.pgrid[x][y] == -4 ? "X" :
					this.pgrid[x][y]
					)))).toString(),(box*x)+box/4,(box*(y+1)-box/4));
			}
		}
        input.draw();
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
		var stg = this.b.toString();
		for(var i = 0; i < stg.length; i++){
			countCtx.strokeRect(i*40,0,40,40);
			countCtx.fillText(stg.charAt(i),(40*i)+5,35);
		}
	}
	revealMap(){
		for(var x = 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
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
var game = new Game();
game.start();
game.updateCount();
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
drawBoard();
game.draw();
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