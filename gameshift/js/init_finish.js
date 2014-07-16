function getValue(arr, index, part){
	//console.log('getValue:'+arr+' '+index+' '+part);
	if (part=='top') return arr[index].top;
	if (part=='bottom') return arr[index].bottom;
	if (part=='left') return arr[index].left;
	if (part=='right') return arr[index].right;
}

function floodfill(game, index, part){
	var visit=new Array();
	for (var i=0;i<game.height*game.width;i++){
		visit.push({top:false,bottom:false,left:false,right:false});
	}
	var q=new Array();
	q.push({id:index,p:part});
	var col=getValue(game.matrix, index, part);

	if (part=='top') visit[index].top=true;
	else if (part=='bottom') visit[index].bottom=true;
	else if (part=='left') visit[index].left=true;
	else if (part=='right') visit[index].right=true;

	var head=0;
	while (head<q.length){
		var id,p;
		id=q[head].id;
		p=q[head].p;
		//console.log('floodfill '+id+' '+p);
		head++;
		if (p=='top'){
			var newp,newid;
			newp='left';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				//console.log('q pushing'+newid+newp);
				q.push({id:newid,p:newp});
				visit[newid].left=true;
			}
			newp='right';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].right=true;
			}
			newp='bottom';
			newid=id-game.width;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].bottom=true;
			}
		}else if (p=='bottom'){
			var newp,newid;
			newp='left';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].left=true;
			}
			newp='right';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].right=true;
			}
			newp='top';
			newid=id+game.width;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].top=true;
			}
		}else if (p=='left'){
			var newp,newid;
			newp='top';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].top=true;
			}
			newp='bottom';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].bottom=true;
			}
			newp='right';
			newid=id-1;
			if (id%game.width&&newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].right=true;
			}
		}else if (p=='right'){
			var newp,newid;
			newp='top';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].top=true;
			}
			newp='bottom';
			newid=id;
			if (newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].bottom=true;
			}
			newp='left';
			newid=id+1;
			if (newid%game.width&&newid>=0&&newid<game.height*game.width&&getValue(game.matrix,newid,newp)==col&&getValue(visit, newid, newp)==false){
				q.push({id:newid,p:newp});
				visit[newid].left=true;
			}
		}
	}
	return q.length;
}

function isfinished(game){
	var area=0;
	console.log(area);
	for (var icolor=0;icolor<5;icolor++){
		for (var i=0;i<game.height*game.width;i++){
			if (game.matrix[i].top==icolor){
				area+=floodfill(game, i, 'top');
				break;
			}
			if (game.matrix[i].bottom==icolor){
				area+=floodfill(game, i, 'bottom');
				break;
			}
			if (game.matrix[i].left==icolor){
				area+=floodfill(game, i, 'left');
				break;
			}
			if (game.matrix[i].right==icolor){
				area+=floodfill(game, i, 'right');	
				break;
			}
		}
		//console.log('color&&area:'+game.color[icolor]+' '+area);
	}
	return (area==(game.width*game.height*4));
}

// var stage=[
// {
// 	height:3,
// 	width:3,
// 	color:[0,1],
// 	matrix:[
// 		{top:1,bottom:1,left:1,right:1},{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},
// 		{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},
// 		{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},{top:1,bottom:1,left:1,right:1}
// 	],
// 	threeStarStep:2
// },
// {
// 	height:3,
// 	width:3,
// 	color:[0,1],
// 	matrix:[
// 		{top:1,bottom:1,left:1,right:1},{top:1,bottom:1,left:1,right:1},{top:0,bottom:0,left:0,right:0},
// 		{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},
// 		{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0},{top:0,bottom:0,left:0,right:0}
// 	],
// 	threeStarStep:2
// }
// ];