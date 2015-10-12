function InteractionManager () {
	this.word_list_manager = new WordListManager();
}
InteractionManager.prototype = {
	title_key:'',
	keys:[],
	hiden_keys:[],
	is_shown:false,
	InitManager: function(word_list, title_key, hiden_keys){
		this.word_list_manager.InitWordList(word_list.words);
		this.title_key = title_key;
		this.hiden_keys = hiden_keys;
		this.keys = word_list.keys;
		this.InitEvents();
		this.InitProgress();
		var $container = $('.card-container');
		var word = this.word_list_manager.GetNextWord();
        this.InitNewCard(word);
        var $show = $('word-card.next');
        this.HideCard($show);
		$('.card-container .next').removeClass('next').addClass('show');
	},
	InitEvents: function(){
		var that = this;
		$('.fab.back').click(function(){
			that.ShowPrev();
		});
		$('.fab.wrong').click(function(){
			if (!that.is_shown){
				var $show = $('word-card.show');
				that.ShowCard($show); return;
			}
			that.SetWrong();
		});
		$('.fab.open').click(function(){
			var $show = $('word-card.show');
			that.ShowCard($show);
		});
		$('.fab.right').click(function(){
			if (!that.is_shown){
				var $show = $('word-card.show');
				that.ShowCard($show); return;
			}
			that.SetRight();
		});
		$('.fab.next').click(function(){
			that.SetRight();
		});

		$('body').keydown(function(event){
			var code = event.keyCode || event.which;
			if (code == 'x'){
				if (!that.is_shown){
					var $show = $('word-card.show');
					that.ShowCard($show); return;
				}
				that.SetWrong();
			} else if (code == 32){
				if (that.is_shown){
					that.SetRight();
				} else {
					var $show = $('word-card.show');
					that.ShowCard($show);
				}
			} else if (code == 37) {
				that.ShowPrev();
			} else if (code == 39) {
				that.SetRight();
			}
		});
	},
	InitNewCard: function(word){
		if (!word) return;
        var $nword = $('<word-card>').addClass('next');
        if (word.hasOwnProperty('meanings')){
        	this.ArrangeMeanings($nword, word);
        }else{
        	this.ArrangeOneMeaning($nword, word);
        }
        var $span =$('<span>').text(word.right + '/' + word.wrong);
        $nword.append($span);
        $('div.card-container').prepend($nword);
	},
	ArrangeOneMeaning: function($node, word){
		var $h2 = $('<h2>').text(word[this.title_key]).attr('type',this.title_key); 
        $node.append($h2);
        for (var i in this.keys){
          if (this.keys[i] === this.title_key) continue;
          var text = word[this.keys[i]];
          if (text === "") continue;
          var $p = $('<p>').text(text).attr('type',this.keys[i]);
          $node.append($p);
        }
	},
	ArrangeMeanings: function($node, word){
		var $h2 = $('<h2>').text(word["english"]).attr('type',"english"); 
        $node.append($h2);
        var name_table = {"example":"【例】","homonyms":"【同】","synonyms":"【近】","antonyms":"【反】"}
        for (var j in word.meanings){
        	for (var i in this.keys){
        	  var key = this.keys[i];
        	  if (key === "English") continue;
        	  var text = word.meanings[j][key];
          	  if (text === "") continue;
          	  if (key === "explanation"){
          	  	text = "【考法"+(parseInt(j)+1)+"】"+text;
          	  }else{
          	  	text = name_table[key] + text;
          	  }
	          var $p = $('<p>').text(text).attr('type',key).css('text-align', 'left').css('font-size','1rem');
	          $node.append($p);
	        }
        }
	},
	ShowCard: function($card){
		for (var i in this.hiden_keys){
			$card.children('[type="'+this.hiden_keys[i]+'"]').css('visibility', 'visible');
		}
		this.is_shown = true;
	},
	HideCard: function($card){
		for (var i in this.hiden_keys){
			$card.children('[type="'+this.hiden_keys[i]+'"]').css('visibility', 'hidden');
			this.is_shown = false;
		}
	},
	ShowNext: function(){
        var $show = $('word-card.show');
        var $next = $show.prev();
        this.SetProgress();
        if ($next.size() == 0) {
        	var word = this.word_list_manager.GetNextWord();
        	if (!word) return;
        	this.InitNewCard(word);
        	$next = $show.prev();
        }
        this.ShowCard($show);
        $show.removeClass('show'); $show.addClass('prev');
        $next.removeClass('next'); $next.addClass('show');
        this.HideCard($next);
	},
	ShowPrev: function(){
		var $show = $('word-card.show');
		var $prev = $show.next();
		if ($prev.size() == 0) return;
		$show.removeClass('show'); $show.addClass('next');
        $prev.removeClass('prev'); $prev.addClass('show');
	},
	SetRight: function(){
		this.word_list_manager.SetRight();
		this.ShowNext();
	},
	SetWrong: function(){
		this.word_list_manager.SetWrong();
		this.ShowNext();
	},
	InitProgress: function(){
		var $progress = $('paper-progress');
		var total = this.word_list_manager.waiting_list.length;
		$progress.attr('min', 0).attr('max', total).attr('value',0);
		var $span = $('span#progress');
		$span.text('0/'+total);
	},
	SetProgress: function(){
		var $progress = $('paper-progress');
		var checked = this.word_list_manager.checked_list.length;
		var waiting = this.word_list_manager.waiting_list.length;
		var total = checked + waiting;
		$progress.attr('value', checked);
		var $span = $('span#progress');
		$span.text(checked + '/' + total);
	}
}