/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：处理游戏的小部件
 *
 *
 */

//游戏的菜单按钮
Game.menupage = function() {
	//添加遮罩效果
	$('div#curturn').slideDown("slow");
	var url = 'res/pic/';
	//在遮罩上添加按钮
	var $t = $('div#curturn');
	var $returnbtn = $('<div>').attr('class', 'returnbtn').append($('<img>').attr('src', url + 'return.png'));
	var $menubtn = $('<div>').attr('class', 'menubtn').append($('<img>').attr('src', url + 'mainmenu.png'));
	var $grabtn = $('<div>').attr('class', 'grabtn').append($('<img>').attr('src', url + 'grades.png'));
	$t.append($returnbtn);
	$t.append($menubtn);
	$t.append($grabtn);

	//为按钮添加事件

	//返回游戏
	$returnbtn.hover(function() {
		$(this).children('img').attr('src', url + 'return_s.png');
	}, function() {
		$(this).children('img').attr('src', url + 'return.png');
	});
	$returnbtn.click(function(event) {
		event.stopPropagation();
		$('div#curturn').slideUp("slow", function() {
			$('.menubtn').remove();
			$('.returnbtn').remove();
			$($grabtn).remove();
		});

	});

	//主菜单
	$menubtn.hover(function() {
		$(this).children('img').attr('src', url + 'mainmenu_s.png');
	}, function() {
		$(this).children('img').attr('src', url + 'mainmenu.png');
	});
	$menubtn.click(function() {
		window.open('index.html');
	});

	//查看战绩
	$grabtn.hover(function() {
		$(this).children('img').attr('src', url + 'grades_s.png');
	}, function() {
		$(this).children('img').attr('src', url + 'grades.png');
	});
	$grabtn.click(function() {
		$(this).children('div').remove();
		$(this).append($('<div>').css({
			'width': '100%',
			'color': 'white'
		}).text(localStorage.record)).attr('id', 'myg');
	});
};

//游戏的撤销按钮
Game.cancelStep = function() {
	if (this.movements.length === 0) return;
	$('#myCanvas').unbind('mousemove');
	$('#myCanvas').unbind('mouseleave');
	var m = this.movements[this.movements.length - 1];
	var vm = myClone(m);
	//push一个相反的操作然后做两次弹出
	vm.step = -vm.step;
	this.movements.push(vm);
	this.movementsbool.push(true);
	this.iscanveling = true;
	if (vm.rc === "row") {
		this.moverowto(vm.num, 0, vm.step * this.blockwidth, 50);
	}
	if (vm.rc === "col") {
		this.movecolto(vm.num, 0, vm.step * this.blockwidth, 50);
	}
};