function SelectionManager () {}
var info = {
	Japanese: {
		id: 'Japanese',
		name: '新世纪文化日语',
		color: '#7dd6fe',
		folder: '/api/Japanese/',
		units: [
			{file:'lesson1.json', name:'第一课'},
			{file:'lesson2.json', name:'第二课'}
		],
		keys:['kana', 'character', 'Chinese'],
		keys_label:['假名', '汉字', '中文'],
	},
	GRE3000: {
		id: 'GRE3000',
		name: 'GRE要你命3000',
		color: '#f4db33',
		folder: '/api/GRE3000/',
		units:[
			{ file: 'list1.json', name: 'List1' },
			{ file: 'list2.json', name: 'List2' },
			{ file: 'list3.json', name: 'List3' },
			{ file: 'list4.json', name: 'List4' },
			{ file: 'list5.json', name: 'List5' },
			{ file: 'list6.json', name: 'List6' },
			{ file: 'list7.json', name: 'List7' },
			{ file: 'list8.json', name: 'List8' },
			{ file: 'list9.json', name: 'List9' },
			{file:'list10.json', name:'List10'},
			{ file: 'list11.json', name: 'List11' },
			{ file: 'list12.json', name: 'List12' },
			{ file: 'list13.json', name: 'List13' },
			{ file: 'list14.json', name: 'List14' },
			{ file: 'list15.json', name: 'List15' },
			{ file: 'list16.json', name: 'List16' },
			{ file: 'list17.json', name: 'List17' },
			{ file: 'list18.json', name: 'List18' },
			{ file: 'list19.json', name: 'List19' },
			{file:'list20.json', name:'List20'},
			{ file: 'list21.json', name: 'List21' },
			{ file: 'list22.json', name: 'List22' },
			{ file: 'list23.json', name: 'List23' },
			{ file: 'list24.json', name: 'List24' },
			{ file: 'list25.json', name: 'List25' },
			{ file: 'list26.json', name: 'List26' },
			{ file: 'list27.json', name: 'List27' },
			{ file: 'list28.json', name: 'List28' },
			{ file: 'list29.json', name: 'List29' },
			{file:'list30.json', name:'List30'},
			{file:'list31.json', name:'List31'}
		],
		keys:['English', 'explanation', 'example', 'homonyms', 'synonyms', 'antonyms'],
		keys_label:['英文', '释义', '例子', '同义词', '近义词', '反义词']
	}
}
SelectionManager.prototype = {
	list_info:{},
	InitManager: function(info){
		this.list_info = info;
		this.InitClickEvents();
	},
	InitClickEvents: function(){
		var ids = Object.keys(this.list_info);
		var that = this;
		for (var i in ids){
			(function(){
				var id = ids[i];
				$('word-lists::shadow #'+id).click(function(e){
					that.SetHero(id);
					that.LoadInfoPage(id);

					that.words_data.keys = that.list_info[id].keys;
					var $btn = $('word-lists::shadow paper-button.begin-btn');
					$btn.off('click');
					$btn.click({that:that, id:id}, that.BeginEvent);

					var p = document.querySelector('word-lists');
	        		p.page = 1;
				});
			})();
		}

	    $(document).click(function(e){
	      var p = document.querySelector('word-lists');
	      if (p.page === 1 && e.toElement != p) {
	          p.page = 0;
	        }
	    });

	    
	},
	SetHero: function(id){
		$('word-lists::shadow .list').removeAttr('hero');
		$('word-lists::shadow .list-top').removeAttr('hero');
		$('word-lists::shadow #'+id).attr('hero','');
		$('word-lists::shadow #'+id+' .list-top').attr('hero','');
		$('word-lists::shadow .list-info').attr('hero-id',id+'-id');
		$('word-lists::shadow .list-info-left').attr('hero-id',id+'-block');
	},
	LoadInfoPage: function(id){
		this.LoadColorAndTitle(id);
		$('word-lists').empty();
		this.LoadUnits(id);
		this.LoadKeys(id);

		$('word-lists').children().click(function(e){
	      e.preventDefault();
	      e.stopPropagation();
	    });
	},
	LoadColorAndTitle: function(id){
		var color = this.list_info[id]['color'];
		$('word-lists::shadow .list-info-left').css('background', color);
		$('word-lists::shadow .list-info-icon').css('background', color);
		$('word-lists::shadow .list-info-name-title').text(this.list_info[id]['name']);
	},
	LoadUnits: function(id){
		var $word_lists = $('word-lists');
		var units = this.list_info[id]['units'];
		for (var i in units){
			var $btn = $('<paper-button toggle raised noink class="list-btn"></paper-button>').text(units[i].name);
			$word_lists.append($btn);
		}
	},
	LoadKeys: function(id){
		var $word_lists = $('word-lists');
		var keys = this.list_info[id]['keys'];
		var keys_label = this.list_info[id]['keys_label'];
		for (var i in keys){
			var $radio = $('<paper-radio-button class="radio-btn"></paper-radio-button>').attr('name', keys[i]).attr('label', keys_label[i]);
			var $icon = $('<core-icon icon="visibility" class="icon-vis"></core-icon>');
			if (i === "0"){
				$icon.addClass('icon-selected');
			}
			else{
				$icon.addClass('icon-unselected');
			}
			$icon.click(function(e){
				if ($(this).hasClass('icon-selected')){
					$(this).removeClass('icon-selected');
					$(this).addClass('icon-unselected');
				}else if ($(this).hasClass('icon-unselected')){
					$(this).removeClass('icon-unselected');
					$(this).addClass('icon-selected');
				}
				e.preventDefault();
	      		e.stopPropagation();
			});
			$word_lists.append($radio).append($icon);
		}
		$('word-lists::shadow paper-radio-group')[0].setAttribute('selected', keys[0]);
	},
	BeginEvent: function(e){
		var that = e.data.that;
		var id = e.data.id;
		that.GatherHidenKeys(that, id);
		that.GatherTitle(that);
		if (that.hiden_keys.length === 0 || that.title === '') return;
		var urls = that.GatherUnitsUrls(that, id);
		var completed_urls = [];
		var folder = that.list_info[id].folder;
		for (var i in urls){
			(function(){
				var murl = folder+urls[i];

				$.ajax({
					url: murl,
					success: function(data){
						// var str = JSON.stringify(data);
						var obj;
						if (typeof data === "string"){
							obj = JSON.parse(data);
						}else {
							obj = data;
						}
						that.words_data.words=that.words_data.words.concat(obj);
						completed_urls.push(murl);
						if (completed_urls.length === urls.length){
							$('word-lists').trigger('data-ready');
							console.log(that.words_data.words);
							console.log(that.hiden_keys);
							console.log(that.title);
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
					  console.log(textStatus, errorThrown);
					}
				});
			})();
		}
	},
	words_data:{
		keys:[],
		words:[],
	},
	hiden_keys:[],
	title:'',
	GatherUnitsUrls: function(that, id){
		var units = [];
		var $btns = $('paper-button.list-btn');
		$btns.each(function(index){
			if ($(this)[0].hasAttribute('active')){
				units.push(index);
			}
		});
		var urls = [];
		for (var i in units){
			urls.push(that.list_info[id].units[units[i]].file);
		}
		return urls;
	},
	GatherHidenKeys: function(that, id){
		var hiden_ids = [];
		var $icons = $('core-icon.icon-vis');
		$icons.each(function(index){
			if ($(this).hasClass('icon-unselected')){
				hiden_ids.push(index);
			}
		});
		var hiden_keys = [];
		for (var i in hiden_ids){
			hiden_keys.push(that.list_info[id].keys[hiden_ids[i]]);
		}
		that.hiden_keys = hiden_keys;
	},
	GatherTitle: function(that){
		that.title = $('word-lists::shadow paper-radio-group')[0].selected;
	},
}
