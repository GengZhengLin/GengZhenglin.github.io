var piccutdata = {"src":"pic/1.jpg"};
//$('#cutbtn').click(begincut);

//获得点的坐标
var getpoint = function(event){
	var $pic = $('.picsource');
	var w = $pic.width();
	var h = $pic.height();
	var o = $pic.offset();
	var x = event.pageX - o.left;
	var y = event.pageY - o.top;
	if (x >= 0 && x <= w && y >= 0 && y <= w){
		return [x,y];
	}
	else return '';
}
//按下按钮开始截取图片
var begincut = function(){
	$('#cutbtn').attr('disabled','disabled');
	getFirstPoint();
}

//获取第一个点
var getFirstPoint = function(){
	$('.picsource').mousemove(function(event) {
		$('#firstpoint').text(getpoint(event));
	});
	$('.picsource').click(function(event){
		var p = getpoint(event);
		$('#firstpoint').text(p);
		piccutdata.x1 = p[0];
		piccutdata.y1 = p[1];
		getSecondPoint();
	});
}

//获取第二个点
var getSecondPoint = function(){
	$('.picsource').unbind('click');
	$('.picsource').unbind('mousemove');
	$('.picsource').mousemove(function(event) {
		$('#secondpoint').text(getpoint(event));
	});
	$('.picsource').click(function(event){
		var p = getpoint(event);
		$('#secondpoint').text(p);
		piccutdata.x2 = p[0];
		piccutdata.y2 = p[1];
		showpic();
	});
}

//展示截取出的图片
var showpic = function(){
	$('.picsource').unbind('click');
	$('.picsource').unbind('mousemove');
	var x1 = Math.min(piccutdata.x1, piccutdata.x2);
	var x2 = Math.max(piccutdata.x1, piccutdata.x2);
	var y1 = Math.min(piccutdata.y1, piccutdata.y2);
	var y2 = Math.max(piccutdata.y1, piccutdata.y2);
	var w = x2 - x1;
	var h = y2 - y1;
	$('.picresult').css('width',w).css('height',h);
	$('img.cutpic').attr('src',piccutdata.src);
	$('img.cutpic').css('left',-x1).css('top',-y1);
	localStorage.x1 = x1;
	localStorage.x2 = x2;
	localStorage.y1 = y1;
	localStorage.y2 = y2;
	$('#cutbtn').removeAttr('disabled');
}

//展示浏览器上次截取的图片
var showLastPic = function(){
	if (localStorage.hasOwnProperty('x1')){
		var x1=parseInt(localStorage.x1);
		var x2=parseInt(localStorage.x2);
		var y1=parseInt(localStorage.y1);
		var y2=parseInt(localStorage.y2);
		var w = x2 - x1;
		var h = y2 - y1;
		$('.picresult').css('width',w).css('height',h);
		$('img.cutpic').attr('src',piccutdata.src);
		$('img.cutpic').css('left',-x1).css('top',-y1);
	}
}

showLastPic();