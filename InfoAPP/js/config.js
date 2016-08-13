//develop:
//var posturl={
//	login:'http://localhost:3000/login',
//	photo:'http://localhost:3000/getphoto',
//	photoupload:'http://localhost:3000/photoupload',
//	note:'http://localhost:3000/note',
//	edit:'http://localhost:3000/meg'
//};
var posturl={
	login:'http://job.trueto.cn/login',
	resume:'http://job.trueto.cn/resume',
	photo:'http://job.trueto.cn/getphoto',
	photoupload:'http://job.trueto.cn/photoupload',
	note:'http://job.trueto.cn/note',
	edit:'http://job.trueto.cn/meg'
};
//预加载提高页面切换时渲染效率，达到原生体验
function openW (id,str,show) {
	var chatPage = mui.preload({
						"id": id,
						"url": id+'.html'
					});
	return function() {
			mui.fire(chatPage, 'show', null);
			setTimeout(function() {
				mui.toast(str);
				mui.openWindow({
					id: id,
					show: {
						aniShow: show
					},
					waiting: {
						autoShow: false
					}
				});
			}, 0);
		}();
}
function getPhoto(page,limit,searchValue) {
	$.ajax({
		url:posturl.photo,
		type:'POST',
		dataType:'json',
		data:{
			page:page,
			limit:limit,
			searchValue:searchValue
		},
		success:function (data) {
			localStorage.setItem('totalpage',data.totalPages);
			var html='<ul id="hexGrid">';
			$('#container').html('');
			data.data.forEach(function (_data) {
				html+='<li class="hex"><a class="hexIn" href="#"><img src='+_data.url+' data-preview-src="" data-preview-group="'+page+'" />'+
	                    '<h1>'+_data.title+'</h1><p>'+_data.photodesc+'</p></a></li>';
			});
			html+='</ul>';
			$('#container').html(html);
		},
		error:function () {
			mui.toast('后台出错了！');
		}
	});
}
function getNote (page,limit,searchValue) {
	$.ajax({
		type:"post",
		url:posturl.note,
		dataType:'json',
		async:false,
		data:{
			page:page,
			limit:limit,
			searchValue:searchValue
		},
		success:function (data) {
			var table = document.body.querySelector('.mui-table-view');
			localStorage.setItem('notePage',data.totalPages);
			data.data.forEach(function (_data) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				li.innerHTML = '<a id="'+_data.id+'" class="mui-navigate-right"><img class="mui-media-object mui-pull-left" src='+moodurl(_data.mood)+'>'+
									'<div class="mui-media-body">'+_data.title+'<p class="mui-ellipsis">'+_data.date+'</p></div></a>';
				table.appendChild(li);
				detail(_data);
			});
		},
		error:function () {
			mui.toast('error');
		}
	});
}
function detail (data) {
	var id=document.getElementById(data.id);
	id.addEventListener('tap',function () {
		mui.openWindow({
			url:'detail.html',
			id:'detail',
			show:{
				aniShow:'pop-in'
			},
			extras:{
				data:data
			}
		});
	});
}
function moodurl(i){
	var m=0;
	switch (i){
		case 0:
			m=14;
			break;
		case 1:
			m=13;
			break;
		case 2:
			m=1;
			break;
		case 3:
			m=9;
			break;
		default:
			m=3;
			break;
	}
	return 'http://emoji.trueto.cn/'+m+'.gif';
}
