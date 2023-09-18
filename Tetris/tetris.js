try{
	
	/*
		make peices fall faster after each 500 points by 10%
		make board scale to window resoultion
	*/
	
	//peiceTables
	//x,y,x,y,x,y,x,y,color,id
	var peiceTabler0 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,-1,1,0,-1,0,2,1],
		[0,0,0,1,0,2,0,-1,0,2],
		[0,0,1,0,-1,0,-1,1,5,3],
		[0,0,1,0,-1,0,1,1,6,4],
		[0,0,-1,0,1,1,0,1,3,5],
		[0,0,1,0,-1,1,0,1,4,6]
	];
	var peiceTabler1 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,1,0,0,-1,2,1],
		[0,0,1,0,2,0,-1,0,0,2],
		[0,0,0,1,0,-1,-1,-1,5,3],
		[0,0,0,1,0,-1,1,-1,6,4],
		[0,0,0,1,1,-1,1,0,3,5],
		[0,0,0,-1,1,1,1,0,4,6]
	];
	var peiceTabler2 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,1,0,-1,0,2,1],
		[0,0,0,1,0,2,0,-1,0,2],
		[0,0,1,0,-1,0,1,-1,5,3],
		[0,0,1,0,-1,0,-1,-1,6,4],
		[0,0,-1,0,1,1,0,1,3,5],
		[0,0,1,0,-1,1,0,1,4,6]
	];
	var peiceTabler3 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,0,-1,-1,0,2,1],
		[0,0,1,0,2,0,-1,0,0,2],
		[0,0,0,1,0,-1,1,1,5,3],
		[0,0,0,1,0,-1,-1,1,6,4],
		[0,0,0,1,1,-1,1,0,3,5],
		[0,0,0,-1,1,1,1,0,4,6]
	];
	
	var board = document.getElementById("board");
	var ctx = board.getContext("2d");
	var box = 32;
	var width = 10;
	var height = 20;
	var active = true;
	var colors = ["#00FFFF", "#FFFF00", "#800080", "#00FF00", "#FF0000", "#0000FF", "#FF7F00", "#808080", "#F0F0F0"];
	
	var score = 0;
	var scoreDiv = document.getElementById("score");
	
	var highScore = 0;
	var highScoreDiv = document.getElementById("highScore");
	
	//random gen list
	var list = [0,1,2,3,4,5,6];
	
	//nextPeice
	var nextCanvas = document.getElementById("next");
	var nextCtx = nextCanvas.getContext("2d");
	var nextId = nextRand();
	var next = peiceTabler0[nextId];
	//69
	//held Peice
	var heldCanvas = document.getElementById("held");
	var heldCtx = heldCanvas.getContext("2d");
	var held = 0;
	
	//peice things
	var peice = peiceTabler0[nextRand()];
	var peicex = 4;
	var peicey = 4;
	var peiceRot = 0;
	var swap = false;
	
	var lineClear = false;
	
	//init board
	
	board.width = box * width;
	board.height = box * height;
	
	nextCanvas.width = box * 4;
	nextCanvas.height = box * 4;
	
	heldCanvas.width = box * 4;
	heldCanvas.height = box * 4;
	
	var grid = Array(width);
	for(var x = 0; x < width; x++){
		grid[x] = Array(height);
		for(var y = 0; y < height; y++){
			grid[x][y] = 7;
		}
	}
	
	//draw things
	draw();
	function draw(){
		ctx.clearRect(0,0,board.width,board.height);
		for(var y = 0; y < height; y++){
			for(var x = 0; x < width; x++){
				ctx.fillStyle = colors[grid[x][y]];
				ctx.fillRect(x*box,y*box,box,box);
			}
		}
		ctx.fillStyle = colors[peice[8]];
		for(var i = 0; i < 8; i+=2){
			ctx.fillRect((peice[i]+peicex)*box,(peice[i+1]+peicey)*box,box,box);
		}
		ctx.fillStyle = colors[peice[8]] + "40";
		for(var y = 0; y < height; y++){
			if(collide(false, y)){
				for(var i = 0; i < 8; i+=2){
					ctx.fillRect((peice[i]+peicex)*box,(peice[i+1]+peicey+y)*box,box,box);
				}
				break;
			}
		}
		nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
		nextCtx.fillStyle = colors[7];
		nextCtx.fillRect(0,0,box*4,box*4);
		nextCtx.fillStyle = colors[next[8]];
		for(var i = 0; i < 8; i+=2){
			nextCtx.fillRect((next[i]+1)*box,(next[i+1]+1)*box,box,box);
		}
			
		heldCtx.clearRect(0,0,heldCanvas.width,heldCanvas.height);
		heldCtx.fillStyle = colors[7];
		heldCtx.fillRect(0,0,box*4,box*4);
		heldCtx.fillStyle = colors[swap ? 8 : held[8]];
		for(var i = 0; i < 8; i+=2){
			heldCtx.fillRect((held[i]+1)*box,(held[i+1]+1)*box,box,box);
		}
	}
	
	//loop every 1/2 second

	var intervalId = window.setInterval(function(){
	if(active && !lineClear){
		if(!collide(true,0)){peicey++;}
			rowCheck();
			draw();
			scoreDiv.innerHTML = "score: "+score;
			for(var x = 0; x < width; x++){
				for(var y = 0; y < height; y++){
					if(grid[x][y] != 7){

					}
				}
			}
		}
	}, 500);
	
	//keyboard input
	
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		if(!lineClear){
			switch (event.key) {
				case "ArrowDown":
				case "s":
					var didCollide = false;
					for(var i = 0; i < 8; i+=2){
						if(grid[peice[i]+peicex][peice[i+1]+peicey+1] != 7){
							didCollide = true;
							break;
						}
						if(peice[i+1]+peicey >= height){
							didCollide = true
							break;
						}
					}
					if(!didCollide){peicey++;}
					break;
				case "q":
					peiceRot++;
					if(peiceRot == 4){
						peiceRot = 0;
					}
					applyRotation();
					for(var i = 0; i < 8; i+=2){
						if(grid[peice[i]+peicex][peice[i]+peicey+1] != 7){
							peiceRot--;
							if(peiceRot == -1){
								peiceRot = 3;
							}
							applyRotation();
							break;
						}
						if(peice[i] < 0 && peice[i] >= width){
							peiceRot--;
							if(peiceRot == -1){
								peiceRot = 3;
							}
							applyRotation();
							break;
						}
					}
					break;
				case "Shift":
				case "e":
					peiceRot--;
					if(peiceRot == -1){
						peiceRot = 3;
					}
					applyRotation();
					break;
				case "ArrowLeft":
				case "a":
					var didCollide = false;
					for(var i = 0; i < 8; i+=2){
						if(grid[peice[i]+peicex-1][peice[i+1]+peicey] != 7){
							didCollide = true;
							break;
						}
						if(peice[i]+peicex <= 0){
							didCollide = true
							break;
						}
					}
					if(!didCollide){peicex--;}
					break;
				case "ArrowRight":
				case "d":
					var didCollide = false;
					for(var i = 0; i < 8; i+=2){
						if(grid[peice[i]+peicex+1][peice[i+1]+peicey] != 7){
							didCollide = true;
							break;
						}
						if(peice[i]+peicex >= width){
							didCollide = true
							break;
						}
					}
					if(!didCollide){peicex++;}
					break;
				case "ArrowUp":
				case "w":
					for(var y = 0; y < height; y++){
						if(collide(true, y)){
							rowCheck();
							break;
						}
					}
					break;
				case "Backspace":
					active = false;;
					break;
				case "Enter":
					active = true;
					break;
				case "Control":
				case "r":
					if(!swap){
						var temp = held;
						held = peice;
						peice = temp;
						if(peice == 0){
							peice = next;
							nextId = nextRand();
							next = peiceTabler0[nextId];
					}
					applyRotation();
					swap = true;
				}
				break;
				default:
				return; // Quit when this doesnt handle the key event.
			}
			collide(true,0);
			draw();
			// Cancel the default action to avoid it being handled twice
		}
		event.preventDefault();
	}, true);
	
	//check collisions

	function collide(lineBreak, yOffset){
		var didCollide = false;
		for(var i = 0; i < 8; i+=2){
			if(grid[peice[i]+peicex][peice[i+1]+peicey+1+yOffset] != 7){
				didCollide = true;
				break;
			}
			if(peice[i+1]+peicey >= height){
				didCollide = true;
				break;
			}
		}
		if(lineBreak){
			if(didCollide){
				for(var i = 0; i < 8; i+=2){
					grid[peice[i]+peicex][peice[i+1]+peicey+yOffset] = peice[8];
				}
				peicex = 4;
				peicey = 1;
				peicerot = 0;
				peice = peiceTabler0[nextId];
				nextId = nextRand();
				next = peiceTabler0[nextId];
				applyRotation();
				swap = false;
			}
		}
		return didCollide;
	}
	
	//apply rotation
	
	function applyRotation(){
		switch(peiceRot){
			case 0:
				peice = peiceTabler0[peice[9]];
				break;
			case 1:
				peice = peiceTabler1[peice[9]];
				break;
			case 2:
				peice = peiceTabler2[peice[9]];
				break;
			case 3:
				peice = peiceTabler3[peice[9]];
				break;
		}
	}
	
	//check for rows
	
	function rowCheck(){
		var b = false;
		var changed = true;
		for(var y = 0; y < height; y++){
			var filled = 0;
			for(var x = 0; x < width; x++){
				if(grid[x][y] != 7){
					filled++;
				}else{
					break;
				}
			}
			if(filled == width){
				b = true;
			}
		}
		if(b){
			lineClear = true;
			var a = false;
			var id = window.setInterval(function(){
				changed = false;
				for(var y = 0; y < height; y++){
					var filled = 0;
					for(var x = 0; x < width; x++){
						if(grid[x][y] != 7){
							filled++;
						}else{
							break;
						}
					}
					if(filled == width){
						for(var my = y; my > 0; my--){
							for(var mx = 0; mx < width; mx++){
								grid[mx][my] = grid[mx][my-1];
								grid[mx][my-1] = 7;
							}
						}
						a = true;
						score+=100;
						changed = true;
					}
				}
				if(a){
					for(var x = 0; x < width; x++){
						for(var y = height; y > 1; y--){
							if(grid[x][y] == 7 && grid[x][y-1] != 7){
								grid[x][y] = grid[x][y-1];
								grid[x][y-1] = 7;
								changed = true;
							}
						}
					}
				}
				draw();
				if(!changed){
					lineClear = false;
					window.clearInterval(id);
					return;
				}
			}, 250);
		}
	}

	//random number for peice generation

	function nextRand(){
		a = Math.floor(Math.random() * list.length);
		g = list[a];
		for(var i = a; i < list.length - 1; i++){
			list[i] = list[i + 1];
		}
		list.length = list.length - 1;
		if(list.length == 0){
			list = [0,1,2,3,4,5,6];
		}
		return g;
	}
}catch(error){
	alert(":(  " + error);
}
//420