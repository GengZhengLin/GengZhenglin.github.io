function AnimationManager () {}
AnimationManager.prototype = {
	selection_manager: {},
	interaction_manager: {},
	InitManager: function(){
		this.selection_manager = new SelectionManager();
		this.selection_manager.InitManager(info);
		this.InitEvents();
	},
	ListToCard: function(){
		var p = document.querySelector('word-lists');
		if (p.page === 1) p.page = 0;

		$('word-lists::shadow core-animated-pages').one('core-animated-pages-transition-end', function(){
			$('word-lists::shadow .list').removeAttr('hero').removeAttr('style');
			$('word-lists::shadow .list-top').removeAttr('hero').removeAttr('style');

			var $lists = $('word-lists::shadow .list');
			$lists.each(function(){
				$(this).removeClass('container-appear');
				$(this).addClass('container-disappear');
			});

			var $bg = $('.bg-rect');
			$bg.removeClass('bg-rect-list');
			$bg.addClass('bg-rect-card');

			$bg.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
				$('section#section-list').css('display', 'none');
				$('section#section-card').css('display', 'block');

				var $fabs = $('.fab');
				$fabs.each(function(){
					$(this).removeClass('container-disappear');
					$(this).addClass('container-appear');
				});

				var $card = $('.card-container');
				$card.removeClass('card-disappear');
				$card.addClass('card-appear');

				var $progress = $('list-progress');
				$progress.removeClass('card-disappear');
				$progress.addClass('card-appear');
	  		});
		});
	},
	CardToList: function(){
		var $fabs = $('.fab');
		$fabs.each(function(){
			$(this).removeClass('container-appear');
			$(this).addClass('container-disappear');
		});

		var $card = $('.card-container');
		$card.removeClass('card-appear');
		$card.addClass('card-disappear');

		var $progress = $('.card-container');
		$progress.removeClass('card-appear');
		$progress.addClass('card-disappear');

		var $bg = $('.bg-rect');
		$bg.removeClass('bg-rect-card');
		$bg.addClass('bg-rect-list');

	    $bg.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
			$('section#section-card').css('display', 'none');
			$('section#section-list').css('display', 'block');

			var $lists = $('word-lists::shadow .list');
			$lists.each(function(){
				$(this).removeClass('container-disappear');
				$(this).addClass('container-appear');
			});
  		});

	},
	InitEvents: function(){
		var that = this;
		$('word-lists').on('data-ready', function(){
			that.ListToCard();
			that.interaction_manager = new InteractionManager();
			that.interaction_manager.InitManager(that.selection_manager.words_data, that.selection_manager.title, that.selection_manager.hiden_keys);
		});
		$('core-icon-button#icon-back').click(function(){
			that.CardToList();
		});

		$('#help-icon').click(function(){
			$('#help-dialog')[0].toggle();
		});
		this.InitRippleEvents();
	},
	InitRippleEvents: function(){
		$('core-icon-button[icon="favorite"]').click(function(){
			var color = $(this).css('color');
			$('#my-ripple').css('background', color);
			$('#my-ripple').removeClass('myripple-small').addClass('myripple-big');
			$('#my-ripple').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
				$('.bg-rect').css('background', color);
				$('#my-ripple').removeClass('myripple-big').addClass('myripple-small');
				event.preventDefault();
				event.stopPropagation();
			});
  		});
	}
}