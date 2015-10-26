$(function(){
	$('#btnhelp').mouseenter(function(){
		$('#helppanel').fadeIn('500ms');
	});
	$('#btnhelp').mouseleave(function(){
		$('#helppanel').css('display','none');	
	});
});