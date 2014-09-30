//创建GameManager对象的函数，用于控制游戏
function GameManager(){
	this.grid = new Grid(40, 40);
	this.isPlaying = false;
	this.cellSize = 15;
	$('#pause').attr('disabled', 'disabled');
}

//绘制网格
GameManager.prototype.drawGrid = function(){	
	var context = document.getElementById("grid").getContext("2d");
	context.clearRect(0, 0, 1000, 1000);
	context.fillStyle = "rgba(200,200,200,0.5)";
	for (var i = 1; i <= this.grid.height; i++) {
		for (var j = 1; j <= this.grid.width; j++) {
			context.fillRect(this.cellSize * (j - 1), this.cellSize * (i - 1), this.cellSize - 1, this.cellSize - 1);	
		}
	}
	context.fillStyle = "rgba(56, 103, 0, 0.5)";
	for (var i = 1; i <= this.grid.height; i++){
		for (var j = 1; j <= this.grid.width; j++){
			if (this.grid.cells[i][j] == 1) {
				context.fillRect(this.cellSize * (j - 1), this.cellSize * (i - 1), this.cellSize - 1, this.cellSize - 1);			
			}
		}
	}
}

//开始连续演化
GameManager.prototype.start = function(timeInterval) {
	this.isPlaying = true;
	$('#start').attr('disabled', 'disabled');
	$('#pause').removeAttr('disabled');
	$('#next').attr('disabled', 'disabled');
	$('#clear').attr('disabled', 'disabled');
	$('#random').attr('disabled', 'disabled');
	var that = this;
	this.running = setInterval(function() {
		that.grid.next();
		that.drawGrid();
	}, timeInterval);
}

//暂停演化
GameManager.prototype.pause = function() {
	this.isPlaying = false;
	$('#start').removeAttr('disabled');
	$('#clear').removeAttr('disabled');
	$('#random').removeAttr('disabled');
	$('#next').removeAttr('disabled');
	$('#pause').attr('disabled', 'disabled');
	clearInterval(this.running);
}

//清空棋盘
GameManager.prototype.clear = function() {
	this.grid.clear();
	this.drawGrid();
}

//随机生成网格
GameManager.prototype.random = function(density){
	this.grid.random(density);
	this.drawGrid();
}

//计算下一步并绘制
GameManager.prototype.next = function() {
	this.grid.next();
	this.drawGrid();
}

//点击网格
GameManager.prototype.click = function(clickEvent) {
	if (this.isPlaying) {
		return;
	}
	var bbox = document.getElementById('grid').getBoundingClientRect();
	var y = Math.floor((clickEvent.x - bbox.left) / this.cellSize) + 1;
	var x = Math.floor((clickEvent.y - bbox.top) / this.cellSize) + 1;
	console.log(x);
	console.log(y);
	this.grid.click(x, y);
	this.drawGrid();
}

var gameManager = new GameManager();
gameManager.drawGrid();