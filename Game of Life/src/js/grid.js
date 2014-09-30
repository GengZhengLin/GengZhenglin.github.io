function Grid(height, width) {
	this.height = height;
	this.width = width;
	this.cells = this.create(height, width);
}

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

Grid.prototype.resize = function(height, width) {
	this.height = height;
	this.width = width;
	this.cells = this.create(height, width);
}

Grid.prototype.random = function(possibility) {

	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; j++) {
			this.cells[i][j] = Math.random() < possibility ? 1 : 0;
		}
	}
}

Grid.prototype.draw = function() {
	var context = document.getElementById("grid").getContext("2d");
	context.fillStyle = "0000ff";
	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; i++) {
			if (this.cells[i][j] == 1) {
				context.fillRect(this.size * (j - 1), this.size * (i - 1), this.size - 1, this.size - 1);			
			}
		}
	}
}

Grid.prototype.next = function() {
	var cells = this.cells;
	var neighbor;
	var newCells = this.create(this.height, this.width);
	for (var j = 1; j <= this.width; j++) {
		cells[0][j] = cells[this.height][j];
		cells[this.height + 1][j] = cells[1][j];
	}
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

Grid.prototype.clear = function() {
	for (var i = 1; i <= this.height; i++) {
		for (var j = 1; j <= this.width; j++) {
			this.cells[i][j] = 0;
		}
	}
}

Grid.prototype.click = function(x, y) {
	this.cells[x][y] = 1 - this.cells[x][y];
}

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