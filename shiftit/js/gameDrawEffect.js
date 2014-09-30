/*
 *
 *
 *游戏：Shift it
 *时间：2014/07
 *功能：绘制游戏的特效
 *
 *
 */

//绘制星星帧动画
Game.setStars = function(num) {
	var starwidth = 100;
	var emstar = Game.emstar;
	var stars = Game.stars;
	var c = document.getElementById("starCanvas");
	var ctx = c.getContext("2d");

	for (var i = 0; i < 3; i++){
		ctx.drawImage(emstar, i * starwidth, 0, starwidth, starwidth);
	}
	var counter = 0;
	var drawStar = function(x, y) {
		counter = 0;
		setTimeout(function() {
			if (counter < 5) {
				ctx.drawImage(emstar, x, y, starwidth, starwidth);
				ctx.drawImage(stars, counter * starwidth, 0, starwidth, starwidth, x, y, starwidth, starwidth);
				counter++;
				setTimeout(arguments.callee, 50);
			}
		}, 50);
	}
	var numofstars = 0;
	setTimeout(function() {
		if (numofstars < num) {
			drawStar(numofstars * starwidth, 0);
			numofstars++;
			setTimeout(arguments.callee, 500);
		}
	}, 500);
};

//绘制过关时的星星洒落的动画
Game.setParticles = function() {
	var littlestar = Game.littlestar;
	var c = document.getElementById("particleCanvas");
	var ctx = c.getContext("2d");
	var counter = 0;
	ps.gravity = new Vector2(0, 4000);
	setTimeout(function() {
		if (counter < 120) {
			if (counter % 20 === 0 && counter < 80) {
				for (var i = 0; i < 20; i++) {
					ps.emit(new Particle(new Vector2(320, 300), randomDirection().multiply(1000), 1, setHSVToRGB(Math.random() * 360, 100, 100), 5));
				}
			}
			counter++;
			ps.simulate(dt);
			ctx.clearRect(0, 0, 640, 960);
			ps.renderStar(ctx, littlestar);
			setTimeout(arguments.callee, 30);
		} else {
			$('#particleCanvas').remove();
		}
	}, 30);
};

//设置通关时的焰火效果
Game.setFirework = function() {
	var c = document.getElementById("fireCanvas");
	var ctx = c.getContext("2d");
	setInterval(function() {
		ps.emit(new Particle(new Vector2(200, 950), sampleDirection(Math.PI * 1.4, Math.PI * 1.6).multiply(1000), 3, sampleColor([1, 0, 0], [1, 1, 50 / 255]), 5));
		ps.simulate(dt);
		ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
		ctx.fillRect(0, 0, 640, 960);
		ps.render(ctx);
	}, 30);

	setInterval(function() {
		ps.emit(new Particle(new Vector2(440, 950), sampleDirection(Math.PI * 1.4, Math.PI * 1.6).multiply(1000), 3, sampleColor([113 / 255, 213 / 255, 76 / 255], [28 / 255, 212 / 255, 198 / 255]), 5));
		ps.simulate(dt);
		ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
		ctx.fillRect(0, 0, 640, 960);
		ps.render(ctx);
	}, 30);

};