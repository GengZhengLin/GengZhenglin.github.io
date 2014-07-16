var ColorObj = function(){
	return {
		"top":0,
		"right":1,
		"bottom":3,
		"left":3,
		"canmove":true,
		"pics":[]
	};
}

var ColorMatrix = function(){
	var a = [];
	a[0] = [];
	a[1] = [];
	a[2] = [];
	return a;
}

var Movement = function(){
	return{
		"step":0,
		"rc":"row",
		"num":0
	};
}



var Game = {
	cols:3,
	blockwidth:150,
	colorMatrix: null,
	num2color: null,
	ctx: null,
	movements: [],
	blockpicnames: {},
	blockpics:[],
	colnum: 5,
	threeStarStep:3,
	allcolor:[],
	iscanveling:false,
	emstar:null,
	stars:null,
	littlestar:null,
	level:0,
	record:{},
	mouseonx:-1,
	mouseony:-1,
	init: function(){
		//this.initcolorMatrix();
		var c=document.getElementById("myCanvas");
		c.width = this.cols * this.blockwidth;
		c.height = this.cols * this.blockwidth;
		this.ctx=c.getContext("2d");
		this.initPicRes();
		this.dealbtns();
		//this.parseColMat();
		//this.bindDragEvent();
		//this.bindHoverEvent();
		//$('.backcontainer').mousedown(function(event) {
		//	$(this).css('cursor', null);
		//	$('.backcontainer').css('cursor', 'url("res/pic/mousedown.ico"), default');
		//});
		//$('.backcontainer').mouseup(function(event) {
		//	$(this).css('cursor', null);
		//	$(this).css('cursor', 'url("res/pic/mousemove.ico"), default');
		//});

		var temp = null;
		if (localStorage.hasOwnProperty('record')){
			m = JSON.parse(localStorage.record);
			if (m.hasOwnProperty('bestlv')){
				Game.level = m.bestlv + 1;
			}
			else {Game.level = 1;}
		}
		else {Game.level = 1;}
		this.gotolevel(Game.level);
	},
	dealbtns:function(){
		var url = 'res/pic/';
		$('#cancelbtn').click(function(){
			Game.cancelStep();
		})
		$('#cancelbtn').hover(function(){
			$(this).attr('src',url+'cancelbtn_s.png');
		}, function(){
			$(this).attr('src', url+'cancelbtn.png');
		});
		$('#mbtn').hover(function(){
			$(this).attr('src',url+'mbtn_s.png');
		}, function(){
			$(this).attr('src', url+'mbtn.png');
		});
		$('#mbtn').click(function(){
			Game.menupage();
		})
	},
	initlevel:function(leveldata){
		//this.clearStage();
		this.colorMatrix = this.jsonObjTocolorMatrix(leveldata);
		this.parseColMat();
		this.bindDragEvent();
		this.movements.length = 0;
		var bindHoverEvent = this.bindHoverEvent;
		var changeColorMatrix = this.changeColorMatrix;
		var redrawStage = this.redrawStage;
		var colorMatrixTogameobj = this.colorMatrixTogameobj;
		var gameover = this.gameover;
		var moverow = this.moverow;
		bindHoverEvent();
		$('#lvnum').text(Game.level);
		$('#snum').text(0);
		$(Game).bind("myMoveover", function(){
			if (Game.movements.length > 0){
				var m = Game.movements[Game.movements.length - 1];
				if (m.step === 0){Game.movements.pop();}
				else {changeColorMatrix(Game.movements[Game.movements.length - 1]);}
			}
			bindHoverEvent();
			redrawStage.call(Game);
			$('#snum').text(Game.movements.length);
			if (isfinished(colorMatrixTogameobj.call(Game))) {gameover.call(Game);}
			if (this.iscanveling){this.movements.pop();this.movements.pop(); this.iscanveling = false;}
		});
		this.mouseonx = -1;
		this.mouseony = -1;
	},
	gotolevel:function(num){
		$('div#curturn').slideUp("slow");
		$('#passlv').animate({'left':640},'slow', 'swing', function(){
			$('#passlv').remove();
		});
		$('#particleCanvas').remove();
		this.level = num;
		$.ajax({url:'res/stage/'+num+'.json', dataType:'json', success:function(data){Game.initlevel(data);}});
	
	},
	initcolorMatrix:function(){
		this.colorMatrix = new ColorMatrix();
		for (var i = 0; i < this.cols; i++){
			for (var j = 0; j < this.cols; j++){
				this.colorMatrix[i][j] = new ColorObj;
			}
		}
	},
	cancelStep:function(){
		if (this.movements.length === 0) return;
		$('#myCanvas').unbind('mousemove');
		$('#myCanvas').unbind('mouseleave');
		var m = this.movements[this.movements.length - 1];
		var vm = myClone(m);
		vm.step = -vm.step;
		this.movements.push(vm);
		this.iscanveling = true;
		if (vm.rc === "row"){
			this.moverowto(vm.num, 0, vm.step * this.blockwidth, 50);
		}
		if (vm.rc === "col"){
			this.movecolto(vm.num, 0, vm.step * this.blockwidth, 50);
		}
	},
	initPicRes: function(){
		var n = ['tlbr', 'l', 't', 'r', 'b', 'lb', 'tl', 'tr', 'br', 'tlb', 'tltr', 'tbr', 'lbr', 's4', 's1', 's2', 's3'];
		var temp = [];
		var tx = 0;
		var ty = 0;
		for (var i = 0; i < 17; i++){
			tx = (i % 6) * this.blockwidth;
			ty = parseInt(i / 6) * this.blockwidth;
			this.blockpicnames[n[i]] = [tx, ty];
		}

		var url = './res/pic/';
		for (var i = 0; i < this.colnum; i++){
			this.blockpics[i] = new Image();
			this.blockpics[i].src = url + 'block' + i + '.gif';
		}

		this.emstar = new Image();
		this.emstar.src = url + 'emstar.gif';
		this.stars = new Image();
		this.stars.src = url + 'stars.gif';
		this.littlestar = new Image();
		this.littlestar.src = url + 'littleStar.png';
	},
	colorMatrixTogameobj:function(){
		var g = {};
		g.height = this.cols;
		g.width = this.cols;
		var m = [];
		for (var i = 0; i < this.cols; i++){
			for (var j = 0; j < this.cols; j++){
				var t = {};
				t.top = this.colorMatrix[i][j].top;
				t.left = this.colorMatrix[i][j].left;
				t.bottom = this.colorMatrix[i][j].bottom;
				t.right = this.colorMatrix[i][j].right;
				m[j * this.cols + i] = t;
			}
		}
		g.color = this.allcolor;
		g.matrix = m;
		g.threeStarStep = this.threeStarStep;
		return g;
	},
	jsonObjTocolorMatrix:function(game){
		var cm = new ColorMatrix();
		for (var i = 0; i < game.width; i++){
			for (var j = 0; j < game.height; j++){
				var t = new ColorObj;
				var k = j * game.height + i;
				t.top = game.matrix[k].top;
				t.left = game.matrix[k].left;
				t.bottom = game.matrix[k].bottom;
				t.right = game.matrix[k].right;
				cm[i][j] = t;
			}
		}
		this.cols = game.width;
		this.threeStarStep = game.threeStarStep;
		this.allcolor = game.color;
		return cm;
	},
	gameover:function(){
		var url = 'res/pic/';
		$('#myCanvas').unbind('mousemove');
		$('#myCanvas').unbind('mousedown');
		$('#myCanvas').unbind('mouseup');
		$('#myCanvas').unbind('mouseleave');
		$('body').unbind('mouseup');
		$(Game).unbind('myMoveover');
		$('div#curturn').slideDown("slow");
		var $t = $('<div>').attr('id','passlv').append($('<img>').attr('src',url+'passlv.png'));
		var $rebtn = $('<div>').attr('class','rebtn').append($('<img>').attr('src',url + 'rebtn.png'));
		var $nextbtn = $('<div>').attr('class','nextbtn').append($('<img>').attr('src',url + 'nextbtn.png'));
		var setStars = this.setStars;
		var emstar = this.emstar;
		var passall = this.passall;
		var totallvl = this.totallvl;
		var gotolevel = this.gotolevel;
		$t.append($rebtn);
		$t.append($nextbtn);
		$rebtn.hover(function(){
			$(this).children('img').attr('src',url+'rebtn_s.png');
		},function(){
			$(this).children('img').attr('src',url+'rebtn.png');
		});
		var initlevel = this.initlevel;
		$rebtn.click(function(event){
			gotolevel(Game.level);
			event.stopPropagation();
		})
		$nextbtn.hover(function(){
			$(this).children('img').attr('src',url+'nextbtn_s.png');
		},function(){
			$(this).children('img').attr('src',url+'nextbtn.png');
		});
		$nextbtn.click(function(){
			if (Game.level >= totallvl){
				$('#passlv').animate({'left':640},'slow');
				passall.call(Game);
			}
			else{
				Game.gotolevel.call(Game,Game.level+1);
			}
		})
		

		var $c = $('<canvas>').attr('class', 'starCanvas').attr('width', 300).attr('height', 100);
		$c.attr('id','starCanvas');
		$t.append($c);

		$('.backcontainer').append($t.css({'left':-640,
			'position':'absolute',
			'top':'20%'}));

		var c=document.getElementById("starCanvas");
		var ctx=c.getContext("2d");
		for (var i = 0 ; i < 3; i++){
			ctx.drawImage(emstar, i * 100, 0, 100, 100);
		}

		var numOf = 3;
		var ns = Game.movements.length;
		var ts = Game.threeStarStep;
		if (ns === ts){
			numOf = 3;
		}
		else if(ns < ts + 4){
			numOf = 2;
		}
		else{
			numOf = 1;
		}
		$('#passlv').animate({'left':0},'slow', 'swing', function(){setStars(numOf);});

		Game.record['lv'+Game.level] = numOf;
		Game.record['bestlv'] = Game.level;
		localStorage.record = JSON.stringify(Game.record);

		var $par = $("<canvas>").attr('id', 'particleCanvas').attr('class', 'particleCanvas').attr('width',640).attr('height', 960);
		$('div#curturn').after($par);
		this.setParticles.call(Game);
		playsound('celebrate');
	},
	setStars: function(num){
		var starwidth = 100;
		var emstar = Game.emstar;
		var stars = Game.stars;
		var c=document.getElementById("starCanvas");
		var ctx=c.getContext("2d");

		var counter = 0;
		var drawStar = function(x, y){
			counter = 0;
			setTimeout(function(){
				if (counter < 5){
					ctx.drawImage(emstar, x, y, starwidth, starwidth);
					ctx.drawImage(stars, counter * starwidth, 0, starwidth, starwidth, x, y, starwidth, starwidth);
					counter ++;
					setTimeout(arguments.callee, 50);
				}
			}, 50);
		}
		var numofstars = 0;
		setTimeout(function(){
			if (numofstars < num){
				drawStar(numofstars * starwidth, 0);
				numofstars ++;
				setTimeout(arguments.callee, 500);
			}
		}, 500);
	},
	setParticles: function(){
		var littlestar = Game.littlestar;
		var c=document.getElementById("particleCanvas");
		var ctx=c.getContext("2d");
		var counter = 0;
		ps.gravity = new Vector2(0, 4000);
		setTimeout(function(){
			if (counter < 120){
				if (counter % 20 === 0 && counter < 80){
					for (var i = 0; i < 20; i++){
						ps.emit(new Particle(new Vector2(320, 300), randomDirection().multiply(1000), 1, setHSVToRGB(Math.random()*360,100,100), 5));
					}
				}
				counter ++;
				ps.simulate(dt);
				ctx.clearRect(0, 0, 640, 960);
				ps.renderStar(ctx, littlestar);
				setTimeout(arguments.callee, 30);
			}  
			else{
				$('#particleCanvas').remove();
			}
		}, 30);
	},
	menupage: function(){
		$('div#curturn').slideDown("slow");
		var url = 'res/pic/';
		var $t = $('div#curturn');
		var $returnbtn = $('<div>').attr('class','returnbtn').append($('<img>').attr('src',url + 'return.png'));
		var $menubtn = $('<div>').attr('class','menubtn').append($('<img>').attr('src',url + 'mainmenu.png'));
		var $grabtn = $('<div>').attr('class','grabtn').append($('<img>').attr('src',url + 'grades.png'));
		$t.append($returnbtn);
		$t.append($menubtn);
		$t.append($grabtn);
		$returnbtn.hover(function(){
			$(this).children('img').attr('src',url+'return_s.png');
		},function(){
			$(this).children('img').attr('src',url+'return.png');
		});
		$returnbtn.click(function(event){
			event.stopPropagation();
			$('div#curturn').slideUp("slow", function(){
				$('.menubtn').remove();
				$('.returnbtn').remove();
			});
					
		});
		$menubtn.hover(function(){
			$(this).children('img').attr('src',url+'mainmenu_s.png');
		},function(){
			$(this).children('img').attr('src',url+'mainmenu.png');
		});
		$grabtn.hover(function(){
			$(this).children('img').attr('src',url+'grades_s.png');
		},function(){
			$(this).children('img').attr('src',url+'grades.png');
		});
		$grabtn.click(function(){
			alert(localStorage.record);
		});
	},
	passall:function(){
		url = 'res/pic/';
		ps.gravity = new Vector2(0, 800);
		$('div#curturn').css('background', 'rgb(0,0,0)');
		var $t = $('<div>').attr('class','passall').append($('<img>').attr('src',url + 'passall.png'));
		$('div#curturn').append($t);
		$('div#curturn').slideDown("slow");
		var $par = $("<canvas>").attr('id', 'fireCanvas').attr('class', 'fireCanvas').attr('width',640).attr('height', 960);
		$('div#curturn').prepend($par);
		this.setFirework.call(Game);
	},
	setFirework: function(){
		var c=document.getElementById("fireCanvas");
		var ctx=c.getContext("2d");
		setInterval(function(){
			ps.emit(new Particle(new Vector2(200, 950), sampleDirection(Math.PI * 1.4, Math.PI * 1.6).multiply(1000), 3, sampleColor([1,0,0],[1,1,50/255]), 5));
    	ps.simulate(dt);
    	ctx.fillStyle="rgba(0, 0, 0, 0.1)";
    	ctx.fillRect(0,0,640,960);
    	ps.render(ctx);
    }, 30);

		setInterval(function(){
			ps.emit(new Particle(new Vector2(440, 950), sampleDirection(Math.PI * 1.4, Math.PI * 1.6).multiply(1000), 3, sampleColor([113/255,213/255,76/255],[28/255,212/255,198/255]), 5));
    	ps.simulate(dt);
    	ctx.fillStyle="rgba(0, 0, 0, 0.1)";
    	ctx.fillRect(0,0,640,960);
    	ps.render(ctx);
    }, 30);
		
	},
	parseColMat: function(){
		for (var i = 0; i < this.cols; i++){
			for (var j = 0; j < this.cols; j++){
				this.parsecolobjpics(this.colorMatrix[i][j]);
			}
		}
	},
	parsecolobjpics: function(colobj){
		var num2dir = ['top', 'left', 'bottom', 'right'];
		var num2c = ['t', 'l', 'b', 'r'];
		var dir2c = {"top":"t",
		"left":"l",
		"bottom":"b",
		"right":"r"};
		var colnum = 5;
		var ct = ['', '', '', '', ''];
		var i = 0;
		for (i = 0; i < 4; i++){
			ct[colobj[num2dir[i]]] += num2c[i];
		}
		for (i = 0; i < colnum; i++){
			if (ct[i]){
				if (ct[i] === 'tb'){
					colobj.pics.push([i,'t']);
					colobj.pics.push([i,'b']);
				}
				else if (ct[i] === 'lr'){
					colobj.pics.push([i,'l']);
					colobj.pics.push([i,'r']);
				}
				else{
					colobj.pics.push([i,ct[i]]);
				}
			}
		}
	},
	mouseHoverBlock: function(event){
		var nx = parseInt(event.offsetX / Game.blockwidth);
		var ny = parseInt(event.offsetY / Game.blockwidth);
		playsound('movefinish');//添加音效chrome
		Game.ctx.save();
		for (var i = 0; i < Game.cols; i++){
			for (var j = 0; j < Game.cols; j++){
				if (i === nx && j === ny){
					Game.drawHoverBlock(nx * 150, ny * 150, Game.colorMatrix[nx][ny]);
				}
				else{
					Game.drawBlock(i * 150, j * 150, Game.colorMatrix[i][j]);
				}
			}
		}
		Game.ctx.restore();
	},
	bindHoverEvent:function(){
		$('#myCanvas').bind('mousemove', function(event){
			var nx = parseInt(event.offsetX / Game.blockwidth);
			var ny = parseInt(event.offsetY / Game.blockwidth);
			if (nx != Game.mouseonx || ny != Game.mouseony){
				Game.mouseHoverBlock.call(Game, event);
				Game.mouseonx = nx;
				Game.mouseony = ny;
			}
		});
		$('#myCanvas').bind('mouseleave', function(){
			Game.redrawStage.call(Game);
		});
	},
	bindDragEvent:function(){
		var blockwidth = this.blockwidth;
		var moverow = this.moverow;
		var movecol = this.movecol;
		var moverowto = this.moverowto;
		var movecolto = this.movecolto;
		var movements = this.movements;
		var changeColorMatrix = this.changeColorMatrix;
		var bindHoverEvent = this.bindHoverEvent;
		var drawBlockRow = this.drawBlockRow;
		var drawBlockcol = this.drawBlockCol;
		var colorMatrixTogameobj = this.colorMatrixTogameobj;
		var redrawStage = this.redrawStage;
		var gameover = this.gameover;
		var ctx = this.ctx;
		var mr = false;
		var mc = false;
		var ox = 0;
		var oy = 0;
		var nx = 0;
		var ny = 0;
		var inCanvasDown = false;

		$('#myCanvas').mousedown(function(event){
			nx = parseInt(event.offsetX / blockwidth);
			ny = parseInt(event.offsetY / blockwidth);
			ox = event.offsetX;
			oy = event.offsetY;
			mr = false;
			mc = false;
			inCanvasDown = true;
			$('#myCanvas').unbind('mousemove');
			$('#myCanvas').unbind('mouseleave');
			$('#myCanvas').bind('mousemove',function(event){
				$('#test').text(Math.abs(event.offsetY));
				if (!mc && Math.abs(event.offsetX - ox) > 20 && Math.abs(event.offsetY - oy) < 20){
					moverow.call(Game, ny, event.offsetX - ox);
					mr = true;
					mc = false;
				}
				else if (!mr && Math.abs(event.offsetX - ox) < 20 && Math.abs(event.offsetY - oy) > 20){
					movecol.call(Game, nx, event.offsetY - oy);
					mr = false;
					mc = true;
				}
			});
		});

		$('body').mouseup(function(event){
			if (!inCanvasDown) return;
			if (!mr && !mc){
				$('#myCanvas').bind('mousemove', function(event){
				Game.mouseHoverBlock.call(Game, event);
			});
		$('#myCanvas').bind('mouseleave', function(){
			Game.redrawStage.call(Game);
		});
				redrawStage.call(Game); 
				return;
			}
			inCanvasDown = false;
			var offset = 0;
			var td = 0;
			$('#myCanvas').unbind('mousemove');
			var cx = $('#myCanvas').offset().left;
			var cy = $('#myCanvas').offset().top;
			var w = $('#myCanvas').width();
			var h = $('#myCanvas').height();
			var dx = event.offsetX;
			if (dx < 0) dx = 0;
			if (dx > w) dx = w;
			var dy = event.offsetY;
			if (dy < 0) dy = 0;
			if (dy > h) dy = h;
			if (mr){
				offset = dx - ox;
				td = Math.round(offset / blockwidth) * blockwidth;
				moverowto.call(Game, ny, offset, td, 20);
			}
			if (mc){
				offset = dy - oy;
				td = Math.round(offset / blockwidth) * blockwidth;
				movecolto.call(Game, nx, offset, td, 20);
			}

			var m = new Movement();
		if (mr) {m.rc = "row"; m.num = ny; /*drawBlockRow(m.num);*/}
	if (mc) {m.rc = "col"; m.num = nx; /*drawBlockcol(m.num);*/}
	m.step = td / blockwidth;
	movements.push(m);
			//changeColorMatrix(m);
			// $('#myCanvas').bind("mousemove", function(){
			// 	ctx.save();
			// 	ctx.drawHoverBlock(nx * 150, ny * 150, colorMatrix[nx][ny]);
			// 	ctx.restore();
			// });
			// $(Game).bind("myMoveover", function(){
			// 	bindHoverEvent();
			// });
event.stopPropagation();


});
},
changeColorMatrix: function(m){
	var t = [];
	if (m.rc === "row"){
		for (var i = 0; i < Game.cols; i++){
			var j = (i + m.step + Game.cols) % Game.cols;
			t[j] = myClone(Game.colorMatrix[i][m.num]);
		}
		for (var i = 0; i < Game.cols; i++){
			Game.colorMatrix[i][m.num] = t[i];
		}
	}
	if (m.rc === "col"){
		for (var i = 0; i < Game.cols; i++){
			var j = (i + m.step + Game.cols) % Game.cols;
			t[j] = myClone(Game.colorMatrix[m.num][i]);
		}
		for (var i = 0; i < Game.cols; i++){
			Game.colorMatrix[m.num][i] = t[i];
		}
	}
},
drawBlock: function(bx,by,colobj){
	var ctx = this.ctx;
	ctx.save();
	ctx.clearRect(bx, by, this.blockwidth, this.blockwidth);
	for (var i = 0; i < colobj.pics.length; i++){
		ctx.drawImage(this.blockpics[colobj.pics[i][0]], this.blockpicnames[colobj.pics[i][1]][0], this.blockpicnames[colobj.pics[i][1]][1], this.blockwidth, this.blockwidth, bx, by, this.blockwidth, this.blockwidth);
	}
	ctx.restore();
},
drawHoverBlock: function(bx,by,colobj){
	var ctx = this.ctx;
	ctx.clearRect(bx, by, this.blockwidth, this.blockwidth);
	for (var i = 0; i < colobj.pics.length; i++){
		ctx.save();
		var cx = bx + this.blockwidth / 2;
		var cy = by + this.blockwidth / 2;
		ctx.translate(cx, cy);
		var rotateD = 0;
		var c = colobj.pics[i][1];
		switch(c.length){
			case 1:
			if (c === 't') {rotateD = 1;}
			if (c === 'r') {rotateD = 2;}
			if (c === 'b') {rotateD = -1;}
			break;
			case 2:
			if (c === 'tl') {rotateD = 1;}
			if (c === 'tr') {rotateD = 2;}
			if (c === 'rb') {rotateD = -1;}
			break;
			case 3:
			if (c === 'trl') {rotateD = 1;}
			if (c === 'trb') {rotateD = 2;}
			if (c === 'rbl') {rotateD = -1;}
			break;
			default:
			break;
		}
		rotateD = rotateD * Math.PI / 2;
		ctx.rotate(rotateD);
		ctx.drawImage(this.blockpics[colobj.pics[i][0]], this.blockpicnames['s'+c.length][0], this.blockpicnames['s'+c.length][1], this.blockwidth, this.blockwidth, -this.blockwidth / 2, -this.blockwidth / 2, this.blockwidth, this.blockwidth);
		ctx.restore();
	}
},
drawMovedBlock: function(bx, by, colobj){
	var height = this.cols * this.blockwidth;
	var width = this.cols * this.blockwidth;
	var x1 = bx % width;
	if (x1 < 0) x1 = x1 + width;
	var y1 = by % height;
	if (y1 < 0) y1 = y1 + height;
	var x2 = x1 + this.blockwidth;
	var y2 = y1 + this.blockwidth;
	var overflow = 0;
	this.drawHoverBlock(x1, y1, colobj);
	if (x2 > width){
		overflow = width - x1;
		this.drawHoverBlock(-overflow, y1, colobj);
	}
	if (y2 > height){
		overflow = height - y1;
		this.drawHoverBlock(x1, -overflow, colobj);
	}
},
moverow:function(num, offset){
	var width = this.cols * this.blockwidth;
		//this.ctx.clearRect(0, num*150, width, this.blockwidth);
		for (var i = 0; i < this.cols; i++){
			this.drawMovedBlock(i*150+offset, num*150, this.colorMatrix[i][num]);
		}
	},
	movecol:function(num, offset){
		var height = this.cols * this.blockwidth;
		this.ctx.clearRect(num*150, 0, this.blockwidth, height);
		for (var i = 0; i < this.cols; i++){
			this.drawMovedBlock(num*150, i*150+offset, this.colorMatrix[num][i]);
		}
	},
	moverowto:function(num, offsetb, offsete, disu){
		var u = 32;
		var offset = offsete - offsetb;
		if (offset === 0) {$(Game).trigger('myMoveover'); return;}
		if (offset < 0) disu = -disu;
		var off = 0;
		var moverow = this.moverow;
		setTimeout(function(){
			moverow.call(Game, num, off + offsetb);
			off += disu;
			if (Math.abs(off + disu) >= Math.abs(offset)){
				// setTimeout(function(){
				// 		moverow.call(Game, num, offsete);
				// 	}, u);
		moverow.call(Game, num, offsete);
		$(Game).trigger('myMoveover');
	}
	else{
		setTimeout(arguments.callee, u);
	}
}, u);
		// var moverow = this.moverow;
		// moverow.call(Game, num, offsete);
		// $(Game).trigger('myMoveover');
	},
	movecolto:function(num, offsetb, offsete, disu){
		var u = 32;
		var offset = offsete - offsetb;
		if (offset === 0) {$(Game).trigger('myMoveover'); return;}
		if (offset < 0) disu = -disu;
		var off = 0;
		var movecol = this.movecol;
		setTimeout(function(){
			movecol.call(Game, num, off + offsetb);
			off += disu;
			if (Math.abs(off + disu) >= Math.abs(offset)){
				// setTimeout(function(){
				// 		moverow.call(Game, num, offsete);
				// 	}, u);
		movecol.call(Game, num, offsete);
		$(Game).trigger('myMoveover');
	}
	else{
		setTimeout(arguments.callee, u);
	}
}, u);
		// var movecol = this.movecol;
		// movecol.call(Game, num, offsete);
		// $(Game).trigger('myMoveover');
	},
	drawBlockRow: function(num){
		for (var i = 0; i < this.cols; i++){
			drawBlock(i * this.blockwidth, num * this.blockwidth, this.colorMatrix[i][num]);
		}
	},
	drawBlockCol: function(num){
		for (var i = 0; i < this.cols; i++){
			drawBlock(num * this.blockwidth, i * this.blockwidth, this.colorMatrix[i][num]);
		}
	},
	redrawStage:function(){
		for (var i = 0; i < this.cols; i++){
			for (var j = 0; j < this.cols; j++){
				Game.drawBlock.call(Game, i*150, j*150, Game.colorMatrix[i][j]);
			}
		}
	},
	drawStage: function(){
		var cols = this.cols;
		var colorMatrix = this.colorMatrix;
		var drawBlock = this.drawBlock;
		this.blockpics[this.colnum - 1].onload = function(){
			for (var i = 0; i < cols; i++){
				for (var j = 0; j < cols; j++){
					drawBlock.call(Game, i*150, j*150, colorMatrix[i][j]);
				}
			}
		}
	}
}

Game.init();
//Game.drawStage();
// $('body').click(function(){
// 	Game.passall.call(Game);
// })