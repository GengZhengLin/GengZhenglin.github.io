var current = 0;
if (localStorage.hasOwnProperty('currentpic')) {current = localStorage.currentpic;};
var myimgdata = null;

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
	if (localStorage.hasOwnProperty('currentpic')) {current = parseInt(localStorage.currentpic);};
	function processData(data) {
		var itemWidth = data.width;
		var itemHeight = data.height;
		var num = data.imglst.length;
		myimgdata = data;
		$('.myslide').css('width',itemWidth)
		.css('height', itemHeight);
		$('.myslidegroup').css('width',itemWidth * num)
		.css('height', itemHeight);

		var t = new EJS({url:'../ejs/picslide.ejs'}).render({
			'itemWidth': itemWidth,
			'images': data.imglst
		});
		document.querySelector('.myslidegroup').innerHTML = t;
		$('div.myslideitem').css('width',itemWidth)
		.css('height', itemHeight);

		$('div.mypictext').css('width',itemWidth);
		setCurrentSlide(current);

		var autoslide = setInterval(function(){setCurrentSlide(current+1);}, 3000);
		var trigger = null;
		var $pictext = $('div.mypictext');
		var textrise = null;
		var textHeight = $pictext.height() + 2 * parseInt($pictext.css('padding'));
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

	function ajax() {
		var client = new XMLHttpRequest();
		client.onreadystatechange = handler;
		client.open('GET', url);
		client.send();
	}

	ajax();
}();