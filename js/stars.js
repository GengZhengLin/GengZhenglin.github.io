    var starwidth = 100;
    var $c = $('<canvas>').css({'width':3*starwidth,
								'height':starwidth,});
    $c.attr('id','starCanvas');
    $('body').append($c);
    var c=document.getElementById("starCanvas");
	var ctx=c.getContext("2d");
	var url = './res/pic/';
	var e = new Image();
	e.src = url + 'emstar.gif';
	var stars = new Image();
	stars.src = url + 'stars.gif';
	e.onload = function(){
		for (var i = 0 ; i < 3; i++){
		ctx.drawImage(e, i * 100, 0, 100, 100);
	}
	var counter = 0;
	var drawStar = function(x, y){
		counter = 0;
		setTimeout(function(){
			if (counter < 5){
			ctx.drawImage(e, x, y, starwidth, starwidth);
			ctx.drawImage(stars, counter * starwidth, 0, starwidth, starwidth, x, y, starwidth, starwidth);
			counter ++;
			setTimeout(arguments.callee, 50);
		}
		}, 50);
	}
	stars.onload = function(){
		var num = 3;
		var i = 0;
		var counter = 0;
setTimeout(function(){
			if (counter < num){
			drawStar(counter * starwidth, 0);
			counter ++;
			setTimeout(arguments.callee, 500);
		}
		}, 500);

		}
	};