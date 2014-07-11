var generateData = function(){
	var data = [];
	for (i = 0; i < 50; i++){
		var name = parseInt(Math.random()*10000);
		var comment = parseInt(Math.random()*1000000);
		var d = "2014-07-10";
		var c = {};
		c.level = i;
		c.name = name;
		c.comment = comment;
		c.datetime = d;
		data.push(c);
	}
	var x = {"commentlist": data};
	document.write(JSON.stringify(x));
}
generateData();