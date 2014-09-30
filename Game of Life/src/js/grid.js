//创建Grid对象的函数，其用于控制棋盘逻辑
function Grid(height, width) {
	this.height = height;
	this.width = width;
	this.cells = this.create(height, width);
}

//从一个数组创建网格，测试时用
Grid.prototype.createFromArray = function(arr) {
	this.height = arr.length;
	this.width = arr[0].length;
	this.cells = this.create(this.height, this.width);
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			this.cells[i + 1][j + 1] = arr[i][j];
		}
	}
}

//创建一个给定大小的空网格
Grid.prototype.create = function(height, width) {
	var cells = [];
	for (var i = 0; i < this.height + 2; i++) {
		cells.push([]);
		for (var j = 0; j < this.width + 2; j++) {
			cells[i].push(0);
		}
	}
	return cells;
}

//随机生成给定密度的细胞网格
Grid.prototype.random = function(possibility) {
	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; j++) {
			this.cells[i][j] = Math.random() < possibility ? 1 : 0;
		}
	}
}

//计算下一步的细胞状态
Grid.prototype.next = function() {
	var cells = this.cells;
	var neighbor;
	var newCells = this.create(this.height, this.width);
	//为了实现下边界与上边界拼接效果，将最下方一条边复制到最上方之上，将最上方一条边复制到最下方之下
	for (var j = 1; j <= this.width; j++) {
		cells[0][j] = cells[this.height][j];
		cells[this.height + 1][j] = cells[1][j];
	}
	//拼接左右边界
	for (var i = 0; i <= this.height + 1; i++) {
		cells[i][0] = cells[i][this.width];
		cells[i][this.width + 1] = cells[i][1];
	}
	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; j++) {
			neighbor = cells[i - 1][j - 1] + cells[i - 1][j] + cells[i - 1][j + 1] + cells[i][j - 1] + 
					   cells[i][j + 1] + cells[i + 1][j - 1] + cells[i + 1][j] + cells[i + 1][j + 1];
			if (neighbor == 2) {
				newCells[i][j] = cells[i][j];
			}
			else if (neighbor == 3) {
				newCells[i][j] = 1;
			}
		}
	}
	this.cells = newCells;
}

//清空网格
Grid.prototype.clear = function() {
	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; j++) {
			this.cells[i][j] = 0;
		}
	}
}

//修改一个单元格的细胞状态
Grid.prototype.click = function(x, y) {
	this.cells[x][y] = 1 - this.cells[x][y];
}

//判断两个网格是否相同，测试时用
Grid.prototype.equal = function(otherGrid) {
	if (this.height != otherGrid.height || this.width != otherGrid.width) {
		return false;
	}
	else {
		for (var i = 1; i <= this.height; i++) {
			for (var j = 1; j <= this.width; j++) {
				if (this.cells[i][j] != otherGrid.cells[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
}