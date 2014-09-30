/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：游戏Block的绘制
 *
 *
 */
//没有阴影效果的Block绘制
Game.drawBlock = function(bx, by, colobj) {
	var ctx = this.ctx;
	ctx.save();
	ctx.clearRect(bx, by, this.blockwidth, this.blockwidth);
	for (var i = 0; i < colobj.pics.length; i++) {
		ctx.drawImage(this.blockpics[colobj.pics[i][0]], this.blockpicnames[colobj.pics[i][1]][0], this.blockpicnames[colobj.pics[i][1]][1], this.blockwidth, this.blockwidth, bx, by, this.blockwidth, this.blockwidth);
	}
	ctx.restore();
};

//有阴影效果的Block的绘制
Game.drawHoverBlock = function(bx, by, colobj) {
	var ctx = this.ctx;
	ctx.clearRect(bx, by, this.blockwidth, this.blockwidth);
	for (var i = 0; i < colobj.pics.length; i++) {
		ctx.save();
		var cx = bx + this.blockwidth / 2;
		var cy = by + this.blockwidth / 2;
		ctx.translate(cx, cy);
		var rotateD = 0;
		var c = colobj.pics[i][1];

		//计算图片应当旋转的角度
		switch (c.length) {
			case 1:
				if (c === 't') {
					rotateD = 1;
				}
				if (c === 'r') {
					rotateD = 2;
				}
				if (c === 'b') {
					rotateD = -1;
				}
				break;
			case 2:
				if (c === 'tl') {
					rotateD = 1;
				}
				if (c === 'tr') {
					rotateD = 2;
				}
				if (c === 'br') {
					rotateD = -1;
				}
				break;
			case 3:
				if (c === 'tlr') {
					rotateD = 1;
				}
				if (c === 'tbr') {
					rotateD = 2;
				}
				if (c === 'lbr') {
					rotateD = -1;
				}
				break;
			default:
				break;
		}
		rotateD = rotateD * Math.PI / 2;
		ctx.rotate(rotateD);
		ctx.drawImage(this.blockpics[colobj.pics[i][0]], this.blockpicnames['s' + c.length][0], this.blockpicnames['s' + c.length][1], this.blockwidth, this.blockwidth, -this.blockwidth / 2, -this.blockwidth / 2, this.blockwidth, this.blockwidth);
		ctx.restore();
	}
};

//绘制正在被拖动的Block
Game.drawMovedBlock = function(bx, by, colobj) {
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
	if (x2 > width) {
		overflow = width - x1;
		this.drawHoverBlock(-overflow, y1, colobj);
	}
	if (y2 > height) {
		overflow = height - y1;
		this.drawHoverBlock(x1, -overflow, colobj);
	}
};

//移动某行Block
Game.moverow = function(num, offset) {
	var width = this.cols * this.blockwidth;
	//this.ctx.clearRect(0, num*150, width, this.blockwidth);
	for (var i = 0; i < this.cols; i++) {
		this.drawMovedBlock(i * 150 + offset, num * 150, this.colorMatrix[i][num]);
	}
};

//移动某列Block
Game.movecol = function(num, offset) {
	var height = this.cols * this.blockwidth;
	this.ctx.clearRect(num * 150, 0, this.blockwidth, height);
	for (var i = 0; i < this.cols; i++) {
		this.drawMovedBlock(num * 150, i * 150 + offset, this.colorMatrix[num][i]);
	}
};

//移动某行Block的动画绘制
Game.moverowto = function(num, offsetb, offsete, disu) {
	var u = 32;
	var offset = offsete - offsetb;
	if (offset === 0) {
		$(Game).trigger('myMoveover');
		return;
	}
	if (offset < 0) disu = -disu;
	var off = 0;
	var moverow = this.moverow;
	setTimeout(function() {
		moverow.call(Game, num, off + offsetb);
		off += disu;
		if (Math.abs(off + disu) >= Math.abs(offset)) {
			moverow.call(Game, num, offsete);
			$(Game).trigger('myMoveover');
		} else {
			setTimeout(arguments.callee, u);
		}
	}, u);
};

//移动某列Block的动画绘制
Game.movecolto = function(num, offsetb, offsete, disu) {
	var u = 32;
	var offset = offsete - offsetb;
	if (offset === 0) {
		$(Game).trigger('myMoveover');
		return;
	}
	if (offset < 0) disu = -disu;
	var off = 0;
	var movecol = this.movecol;
	setTimeout(function() {
		movecol.call(Game, num, off + offsetb);
		off += disu;
		if (Math.abs(off + disu) >= Math.abs(offset)) {
			movecol.call(Game, num, offsete);
			$(Game).trigger('myMoveover');
		} else {
			setTimeout(arguments.callee, u);
		}
	}, u);
};

//画一行Block
Game.drawBlockRow = function(num) {
	for (var i = 0; i < this.cols; i++) {
		drawBlock(i * this.blockwidth, num * this.blockwidth, this.colorMatrix[i][num]);
	}
};

//画一行Block
Game.drawBlockCol = function(num) {
	for (var i = 0; i < this.cols; i++) {
		drawBlock(num * this.blockwidth, i * this.blockwidth, this.colorMatrix[i][num]);
	}
};

//重绘界面
Game.redrawStage = function() {
	for (var i = 0; i < this.cols; i++) {
		for (var j = 0; j < this.cols; j++) {
			Game.drawBlock.call(Game, i * 150, j * 150, Game.colorMatrix[i][j]);
		}
	}
};

//开始时重绘界面
Game.drawStage = function() {
	var cols = this.cols;
	var colorMatrix = this.colorMatrix;
	var drawBlock = this.drawBlock;
	this.blockpics[this.colnum - 1].onload = function() {
		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < cols; j++) {
				drawBlock.call(Game, i * 150, j * 150, colorMatrix[i][j]);
			}
		}
	}
};