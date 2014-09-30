var playsound=function(id){
	var v = document.getElementById(id);
	v.load();
	v.volume = 0.1;
	v.play();	
}
//$('body').append($('<audio>').attr('id','m').attr('src','res/sound/MoveFinish.wav'));var v = document.getElementById('m');