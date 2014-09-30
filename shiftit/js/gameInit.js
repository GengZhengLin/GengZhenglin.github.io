/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：实现游戏初始化的相关操作
 *
 *
 */


//Game的私有变量
var Game = {
	cols: 3,
	blockwidth: 150,
	colorMatrix: null,
	num2color: null,
	ctx: null,
	movements: [],
	movementsbool: [],
	blockpicnames: {},
	blockpics: [],
	colnum: 5,
	threeStarStep: 3,
	allcolor: [],
	iscanveling: false,
	emstar: null,
	stars: null,
	littlestar: null,
	level: 0,
	totallvl: 36,
	record: {},
	mouseonx: -1,
	mouseony: -1
};

//整个游戏的初始化操作
Game.init = function() {

	//有关Canvas的操作
	var c = document.getElementById("myCanvas");
	c.width = this.cols * this.blockwidth;
	c.height = this.cols * this.blockwidth;
	this.ctx = c.getContext("2d");

	this.initPicRes();
	this.dealbtns();

	//加载过关记录
	var m = null;
	if (localStorage.hasOwnProperty('record')) {
		m = JSON.parse(localStorage.record);
		if (m.hasOwnProperty('bestlv')) {
			Game.level = m.bestlv + 1;
		} else {
			Game.level = 1;
		}
		Game.record = JSON.parse(localStorage.record);
	} else {
		Game.level = 1;
	}
	this.gotolevel(Game.level);
};

//处理页面中的有关按钮，Init函数中要用
Game.dealbtns = function() {
	var url = 'res/pic/';
	$('#cancelbtn').click(function() {
		Game.cancelStep();
	})
	$('#cancelbtn').hover(function() {
		$(this).attr('src', url + 'cancelbtn_s.png');
	}, function() {
		$(this).attr('src', url + 'cancelbtn.png');
	});
	$('#mbtn').hover(function() {
		$(this).attr('src', url + 'mbtn_s.png');
	}, function() {
		$(this).attr('src', url + 'mbtn.png');
	});
	$('#mbtn').click(function() {
		Game.menupage();
	})
};

//初始化关卡，在初始化游戏init中以及一关结束进入下一关gameover中要用
Game.initlevel = function(leveldata) {

	this.colorMatrix = this.jsonObjTocolorMatrix(leveldata);
	this.parseColMat();
	this.bindDragEvent();
	this.movements.length = 0;
	this.movementsbool.length = 0;
	var bindHoverEvent = this.bindHoverEvent;
	var changeColorMatrix = this.changeColorMatrix;
	var redrawStage = this.redrawStage;
	var colorMatrixTogameobj = this.colorMatrixTogameobj;
	var gameover = this.gameover;
	var moverow = this.moverow;
	bindHoverEvent();
	$('#lvnum').text(Game.level);
	$('#snum').text(0);

	//定义myMoveover事件
	$(Game).bind("myMoveover", function() {
		if (!Game.movementsbool[Game.movements.length - 1]) return;
		if (Game.movements.length > 0) {
			var m = Game.movements[Game.movements.length - 1];
			if (m.step === 0) {
				Game.movements.pop();
				Game.movementsbool.pop();
			} else {
				changeColorMatrix(Game.movements[Game.movements.length - 1]);
				Game.movementsbool[Game.movements.length - 1] = false;
			}
		}
		bindHoverEvent();
		redrawStage.call(Game);
		$('#snum').text(Game.movements.length);
		if (isfinished(colorMatrixTogameobj.call(Game))) {
			gameover.call(Game);
		}
		if (this.iscanveling) {
			this.movements.pop();
			this.movements.pop();
			this.movementsbool.pop();
			this.movementsbool.pop();
			this.iscanveling = false;
			$('#snum').text(Game.movements.length);
		}
	});
	this.mouseonx = -1;
	this.mouseony = -1;
};

//初始化颜色矩阵
Game.initcolorMatrix = function() {
	this.colorMatrix = new ColorMatrix();
	for (var i = 0; i < this.cols; i++) {
		for (var j = 0; j < this.cols; j++) {
			this.colorMatrix[i][j] = new ColorObj;
		}
	}
};

//初始化图片资源
Game.initPicRes = function() {
	//加载Blocks相关图片
	var n = ['tlbr', 'l', 't', 'r', 'b', 'lb', 'tl', 'tr', 'br', 'tlb', 'tlr', 'tbr', 'lbr', 's4', 's1', 's2', 's3'];
	var temp = [];
	var tx = 0;
	var ty = 0;
	for (var i = 0; i < 17; i++) {
		tx = (i % 6) * this.blockwidth;
		ty = parseInt(i / 6) * this.blockwidth;
		this.blockpicnames[n[i]] = [tx, ty];
	}

	var url = './res/pic/';
	for (var i = 0; i < this.colnum; i++) {
		this.blockpics[i] = new Image();
		this.blockpics[i].src = url + 'block' + i + '.gif';
	}

	//加载其他图片
	this.emstar = new Image();
	this.emstar.src = url + 'emstar.gif';
	this.stars = new Image();
	this.stars.src = url + 'stars.gif';
	this.littlestar = new Image();
	this.littlestar.src = url + 'littleStar.png';
	var t = new Image();
	t.src = url + 'passlv.png';
};

//游戏进入第...关
Game.gotolevel = function(num) {
	$('div#curturn').slideUp("slow");
	$('#passlv').animate({
		'left': 640
	}, 'slow', 'swing', function() {
		$('#passlv').remove();
	});
	$('#particleCanvas').remove();
	this.level = num;

	//ajax动态加载数据
	$.ajax({
		url: 'res/stage/' + num + '.json',
		dataType: 'json',
		success: function(data) {
			Game.initlevel(data);
		},
		error: function() {
			alert('jsonError!');
		}
	});

};