/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：游戏的事件处理
 *
 *
 */

//正常状态下鼠标在Block上移动时重绘界面的函数
Game.mouseHoverBlock = function(event) {
	var nx = parseInt(event.offsetX / Game.blockwidth);
	var ny = parseInt(event.offsetY / Game.blockwidth);
	playsound('movefinish'); //添加音效chrome
	Game.ctx.save();
	for (var i = 0; i < Game.cols; i++) {
		for (var j = 0; j < Game.cols; j++) {
			if (i === nx && j === ny) {
				//区分处理
				Game.drawHoverBlock(nx * 150, ny * 150, Game.colorMatrix[nx][ny]);
			} else {
				Game.drawBlock(i * 150, j * 150, Game.colorMatrix[i][j]);
			}
		}
	}
	Game.ctx.restore();
};

//为移动添加事件
Game.bindHoverEvent = function() {

	//移动时的时间，调用mouseHoverBlock
	$('#myCanvas').bind('mousemove', function(event) {
		var nx = parseInt(event.offsetX / Game.blockwidth);
		var ny = parseInt(event.offsetY / Game.blockwidth);
		if (nx != Game.mouseonx || ny != Game.mouseony) {
			Game.mouseHoverBlock.call(Game, event);
			Game.mouseonx = nx;
			Game.mouseony = ny;
		}
	});

	//添加离开canvas的事件
	$('#myCanvas').bind('mouseleave', function() {
		Game.redrawStage.call(Game);
	});
};

//添加鼠标拖动事件
Game.bindDragEvent = function() {
	var blockwidth = this.blockwidth;
	var moverow = this.moverow;
	var movecol = this.movecol;
	var moverowto = this.moverowto;
	var movecolto = this.movecolto;
	var movements = this.movements;
	var movementsbool = this.movementsbool;
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

	//鼠标按下发生的事件
	$('#myCanvas').mousedown(function(event) {
		nx = parseInt(event.offsetX / blockwidth);
		ny = parseInt(event.offsetY / blockwidth);
		ox = event.offsetX;
		oy = event.offsetY;
		mr = false;
		mc = false;
		inCanvasDown = true;

		//移除原有的事件
		$('#myCanvas').unbind('mousemove');
		$('#myCanvas').unbind('mouseleave');

		//绑定新的拖拽事件
		$('#myCanvas').bind('mousemove', function(event) {
			$('#test').text(Math.abs(event.offsetY));
			if (!mc && Math.abs(event.offsetX - ox) > 20 && Math.abs(event.offsetY - oy) < 20) {
				moverow.call(Game, ny, event.offsetX - ox);
				mr = true;
				mc = false;
			} else if (!mr && Math.abs(event.offsetX - ox) < 20 && Math.abs(event.offsetY - oy) > 20) {
				movecol.call(Game, nx, event.offsetY - oy);
				mr = false;
				mc = true;
			}
		});
	});

	//鼠标弹起的事件，利用JS事件冒泡，将事件绑定到body上，增强程序鲁棒性
	$('body').mouseup(function(event) {
		if (!inCanvasDown) return;
		if (!mr && !mc) {
			//未发生拖动单独处理
			$('#myCanvas').unbind('mousemove');
			$('#myCanvas').unbind('mouseleave');
			$('#myCanvas').bind('mousemove', function(event) {
				Game.mouseHoverBlock.call(Game, event);
			});
			$('#myCanvas').bind('mouseleave', function() {
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
		if (mr) {
			offset = dx - ox;
			td = Math.round(offset / blockwidth) * blockwidth;
			moverowto.call(Game, ny, offset, td, 20);
		}
		if (mc) {
			offset = dy - oy;
			td = Math.round(offset / blockwidth) * blockwidth;
			movecolto.call(Game, nx, offset, td, 20);
		}

		//为已有的拖动判定行为
		var m = new Movement();
		if (mr) {
			m.rc = "row";
			m.num = ny; /*drawBlockRow(m.num);*/
		}
		if (mc) {
			m.rc = "col";
			m.num = nx; /*drawBlockcol(m.num);*/
		}
		m.step = td / blockwidth;
		movements.push(m);
		movementsbool.push(true);
		event.stopPropagation();


	});
};