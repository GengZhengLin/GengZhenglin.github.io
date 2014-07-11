void function() {

		pageSize = 5;
		pageIndex = 0;

		var templateList = new EJS({url:'../ejs/comment.ejs'});
		var templatePaginator = new EJS({url:'../ejs/commentpage.ejs'});

		//转到第几页
		function gotoPage(value) {
			pageIndex = parseInt(value);
			$.ajax({
				url: ['/page', pageSize, pageIndex].join('/'),
				success: processData
			});
		}

		function processData(data) {
			//渲染页面
			$('.comments').html(
				templateList.render({"comments":data.commentlist})
				);

			if (data.count % pageSize === 0) {
				pageCount = parseInt(data.count / pageSize);
			} else {
				pageCount = parseInt(data.count / pageSize) + 1;
			}
			$('.pageinator').html(
				templatePaginator.render({
					"dataCount": data.count,
					"pageCount": pageCount,
					"pageSize": pageSize,
					"pageIndex": pageIndex
				})
				);
			//绑定事件
			$('.goto-first').bind('click', function() {
				gotoPage(0);
			});
			$('.goto-prev').bind('click', function() {
				gotoPage(pageIndex - 1);
			});
			$('.goto-next').bind('click', function() {
				gotoPage(pageIndex + 1);
			});
			$('.goto-last').bind('click', function() {
				gotoPage(pageCount - 1);
			});
			$('.goto-index').bind('change', function() {
				gotoPage(this.value);
			});
		}

		gotoPage(pageIndex);
}();