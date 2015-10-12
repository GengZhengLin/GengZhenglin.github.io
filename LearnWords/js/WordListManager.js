function WordListManager () {}
WordListManager.prototype = {
	waiting_list: [],
	checked_list: [],
	cur_word: {},
	waiting_list_id: 0,
	InitWordList: function(list){
		for (var i in list) {
			list[i].right = 0;
			list[i].wrong = 0;
			list[i].id = i;
			this.waiting_list.push(list[i]);
		}
	},
	GetNextWord: function (){
		var n = this.waiting_list.length;
		if (n == 0) return;
		var index = Math.floor(Math.random() * n);
		if (index === n) index = n-1;
		this.cur_word = this.waiting_list[index];
		this.waiting_list_id = index;
		return this.cur_word;
	},
	SetRight: function() {
		if (this.waiting_list.length === 0) return;
		this.cur_word['right'] += 1;
		if (this.cur_word['right'] >= this.cur_word['wrong']) {
			this.waiting_list.splice(this.waiting_list_id, 1);
			this.checked_list.push(this.cur_word);		
		}
	},
	SetWrong: function() {
		this.cur_word['wrong'] += 1;
	},
	
}