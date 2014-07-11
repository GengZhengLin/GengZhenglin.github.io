var current = 0;
if (localStorage.hasOwnProperty('currentpic')) {current = localStorage.currentpic;};
var myimgdata = null;

//轮播设置当前slide
function setCurrentSlide(value) {
	var num = myimgdata.imglst.length;
	var itemWidth = myimgdata.width;
	var $slide = $('.myslidegroup').children();
	current = (value + num) % num;
	localStorage.currentpic = current;
	for (var i = 0; i < $slide.length; i++) {
		var item = $slide[i];
		if (i < current) {
			item.style['-webkit-transform'] =
			'translateX(-' + itemWidth * (i + 1) + 'px)';
		} else if (i === current) {
			item.style['-webkit-transform'] =
			'translateX(-' + itemWidth * i + 'px)';
		} else {
			item.style['-webkit-transform'] =
			'translateX(-' + itemWidth * (i - 1) + 'px)';
		}
	}

	$('.mypictext').text(myimgdata.imglst[current].text);
}

void function() {
	var url = '/imglst.json';
	if (localStorage.hasOwnProperty('currentpic')) {
		current = parseInt(localStorage.currentpic);
		if (isNaN(current)) current = 0;
	};
	function processData(data) {
		var itemWidth = data.width;
		var itemHeight = data.height;
		var num = data.imglst.length;
		myimgdata = data;
		$('.myslide').css('width',itemWidth)
		.css('height', itemHeight);
		$('.myslidegroup').css('width',itemWidth * num)
		.css('height', itemHeight);

		//渲染图片对应div
		var renderPic = function(){
			var t = new EJS({url:'../ejs/picslide.ejs'}).render({
				'itemWidth': itemWidth,
				'images': data.imglst
			});
			document.querySelector('.myslidegroup').innerHTML = t;
			$('div.myslideitem').css('width',itemWidth)
			.css('height', itemHeight);

			$('div.mypictext').css('width',itemWidth);
			setCurrentSlide(current);
		}
		renderPic();

		var autoslide = null;
		var textrise = null;
		var textHeight = 0;
		//设置自动轮播
		var setSlideInterval = function(){
			autoslide = setInterval(function(){setCurrentSlide(current+1);}, 3000);
			var $pictext = $('div.mypictext');
			textrise = null;
			textHeight = $pictext.height() + 2 * parseInt($pictext.css('padding'));
		}
		setSlideInterval();

		//设置悬停效果
		var setHoverEffect = function(){
			$('div.myslide').hover(
				function() {
					clearInterval(autoslide);
					textrise = setTimeout(function(){$('div.mypictext').animate({'bottom':'0'}, 500);},200);
				}, function() {
					clearTimeout(textrise);
					autoslide = setInterval(function(){setCurrentSlide(current+1);}, 3000);
					$('div.mypictext').animate({'bottom':-textHeight}, 500);
				});
		}
		setHoverEffect();
		
		//设置按钮
		var setButton = function(){
			var i = 0;
			var $btn = null;
			var $temp = null;
			var a = [];
			for (i = 0; i < num; i++){
				a[i] = (function(j){
					return j;})(i);
				}
				for (i = 0;i < num; i++){
					$btn = $('.myslidebutton');
					$temp = $('<a>●<a>');
					$temp.attr('class','myslidebuttona');
					$temp.attr('id',i+'a');
					$temp.bind('click', function(event) {
						/* Act on the event */
						var k = parseInt($(this).attr('id'));
						setCurrentSlide(k);
					});
					$btn.append($temp);
				}
			};
			setButton();

		}

		//ajax套路代码
		function handler() {
			if (this.readyState == this.DONE) {
				if (this.status == 200) {
					try {
						processData(JSON.parse(this.responseText));
					} catch(ex) {
						console.log(ex.message);
					}
				}
			}
		}
		//ajax套路代码
		function ajax() {
			var client = new XMLHttpRequest();
			client.onreadystatechange = handler;
			client.open('GET', url);
			client.send();
		}

		ajax();
	}();