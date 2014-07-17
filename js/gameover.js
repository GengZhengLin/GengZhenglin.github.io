/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：处理游戏的通关过程
 *
 *
 */
Game.gameover = function() {
	var url = 'res/pic/';

	//接触canvas的事件绑定
	$('#myCanvas').unbind('mousemove');
	$('#myCanvas').unbind('mousedown');
	$('#myCanvas').unbind('mouseup');
	$('#myCanvas').unbind('mouseleave');
	$('body').unbind('mouseup');
	$(Game).unbind('myMoveover');

	//遮罩效果
	$('div#curturn').slideDown("slow");

	//制作滑动窗口
	var $t = $('<div>').attr('id', 'passlv').append($('<img>').attr('src', url + 'passlv.png'));
	var $rebtn = $('<div>').attr('class', 'rebtn').append($('<img>').attr('src', url + 'rebtn.png'));
	var $nextbtn = $('<div>').attr('class', 'nextbtn').append($('<img>').attr('src', url + 'nextbtn.png'));
	var setStars = this.setStars;
	var emstar = this.emstar;
	var passall = this.passall;
	var totallvl = this.totallvl;
	var gotolevel = this.gotolevel;
	$t.append($rebtn);
	$t.append($nextbtn);


	//为滑动窗口上的按钮绑定事件
	$rebtn.hover(function() {
		$(this).children('img').attr('src', url + 'rebtn_s.png');
	}, function() {
		$(this).children('img').attr('src', url + 'rebtn.png');
	});
	var initlevel = this.initlevel;
	$rebtn.click(function(event) {
		gotolevel(Game.level);
		event.stopPropagation();
	})
	$nextbtn.hover(function() {
		$(this).children('img').attr('src', url + 'nextbtn_s.png');
	}, function() {
		$(this).children('img').attr('src', url + 'nextbtn.png');
	});
	$nextbtn.click(function() {
		if (Game.level >= totallvl) {
			$('#passlv').animate({
				'left': 640
			}, 'slow');
			passall.call(Game);
		} else {
			Game.gotolevel.call(Game, Game.level + 1);
		}
	})


	//制作星星的帧动画
	var $c = $('<canvas>').attr('class', 'starCanvas').attr('width', 300).attr('height', 100);
	$c.attr('id', 'starCanvas');
	$t.append($c);

	$('.backcontainer').append($t.css({
		'left': -640,
		'position': 'absolute',
		'top': '20%'
	}));

	var c = document.getElementById("starCanvas");
	var ctx = c.getContext("2d");


	var numOf = 3;
	var ns = Game.movements.length;
	var ts = Game.threeStarStep;
	if (ns === ts) {
		numOf = 3;
	} else if (ns < ts + 4) {
		numOf = 2;
	} else {
		numOf = 1;
	}


	$('#passlv').animate({
		'left': 0
	}, 'slow', 'swing', function() {
		setStars(numOf);
	});


	//游戏数据的本地存储
	Game.record['lv' + Game.level] = numOf;
	if (!Game.record.hasOwnProperty('bestlv')) Game.record.bestlv = 0;
	if (Game.level > Game.record['bestlv']) {
		Game.record['bestlv'] = Game.level;
	}
	localStorage.record = JSON.stringify(Game.record);

	//设置星星播撒动画
	var $par = $("<canvas>").attr('id', 'particleCanvas').attr('class', 'particleCanvas').attr('width', 640).attr('height', 960);
	$('div#curturn').after($par);
	this.setParticles.call(Game);
	playsound('celebrate');
};

//设置通关页面
Game.passall = function() {
	url = 'res/pic/';
	ps.gravity = new Vector2(0, 800);
	$('div#curturn').css('background', 'rgb(0,0,0)');
	var $t = $('<div>').attr('class', 'passall').append($('<img>').attr('src', url + 'passall.png'));
	$('div#curturn').append($t);
	$('div#curturn').slideDown("slow");
	var $par = $("<canvas>").attr('id', 'fireCanvas').attr('class', 'fireCanvas').attr('width', 640).attr('height', 960);
	$('div#curturn').prepend($par);
	this.setFirework.call(Game);
};