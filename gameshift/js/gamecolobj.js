/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：定义ColorObj数据结构，既要与后台逻辑交互，又要与前端绘制界面交互
 *
 *
 */
//颜色块，用于表示Blocks的数据结构
var ColorObj = function() {
		return {
			"top": 0, //数字表示颜色
			"right": 1,
			"bottom": 3,
			"left": 3,
			"canmove": true,
			"pics": [] //记录需要绘制Blocks需要的图片的素材
		};
	}
	//Block矩阵，用于表示当前画布上的Blocks
var ColorMatrix = function() {
		var a = [];
		a[0] = [];
		a[1] = [];
		a[2] = [];
		return a;
	}
	//事件堆栈，用于记录用户操作
var Movement = function() {
	return {
		"step": 0,
		"rc": "row",
		"num": 0
	};
}

//将colorMatrix转成后台使用的gameobj
Game.colorMatrixTogameobj = function() {
	var g = {};
	g.height = this.cols;
	g.width = this.cols;
	var m = [];
	for (var i = 0; i < this.cols; i++) {
		for (var j = 0; j < this.cols; j++) {
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
};

//将后台使用的gameobj转成colorMatrix
Game.jsonObjTocolorMatrix = function(game) {
	var cm = new ColorMatrix();
	for (var i = 0; i < game.width; i++) {
		for (var j = 0; j < game.height; j++) {
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
};

Game.parseColMat = function() {
	for (var i = 0; i < this.cols; i++) {
		for (var j = 0; j < this.cols; j++) {
			this.parsecolobjpics(this.colorMatrix[i][j]);
		}
	}
};

//根据上下左右的数据分析改Block需要哪些图片以及图片的哪些部分
Game.parsecolobjpics = function(colobj) {
	var num2dir = ['top', 'left', 'bottom', 'right'];
	var num2c = ['t', 'l', 'b', 'r'];
	var dir2c = {
		"top": "t",
		"left": "l",
		"bottom": "b",
		"right": "r"
	};
	var colnum = 5;
	var ct = ['', '', '', '', ''];
	var i = 0;
	for (i = 0; i < 4; i++) {
		ct[colobj[num2dir[i]]] += num2c[i];
	}
	for (i = 0; i < colnum; i++) {
		if (ct[i]) {
			if (ct[i] === 'tb') {
				colobj.pics.push([i, 't']);
				colobj.pics.push([i, 'b']);
			} else if (ct[i] === 'lr') {
				colobj.pics.push([i, 'l']);
				colobj.pics.push([i, 'r']);
			} else {
				colobj.pics.push([i, ct[i]]);
			}
		}
	}
};

//根据已有的操作修改逻辑中的ColorMatrix
Game.changeColorMatrix = function(m) {
	var t = [];
	if (m.rc === "row") {
		for (var i = 0; i < Game.cols; i++) {
			var j = (i + m.step + Game.cols) % Game.cols;
			t[j] = myClone(Game.colorMatrix[i][m.num]);
		}
		for (var i = 0; i < Game.cols; i++) {
			Game.colorMatrix[i][m.num] = t[i];
		}
	}
	if (m.rc === "col") {
		for (var i = 0; i < Game.cols; i++) {
			var j = (i + m.step + Game.cols) % Game.cols;
			t[j] = myClone(Game.colorMatrix[m.num][i]);
		}
		for (var i = 0; i < Game.cols; i++) {
			Game.colorMatrix[m.num][i] = t[i];
		}
	}
}