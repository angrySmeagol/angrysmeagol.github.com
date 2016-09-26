require.config({
	baseUrl:'./js/app',
	paths:{
		jquery:'../commen/3.1.0jquery',
		underscore:'../commen/underscore',
		backbone:'../commen/backbone',
		header:'header',
		container:'container',
		mv:"mv"
	}
});
require(['header','container','mv',"jquery"],function(Header,Container,Mv,$){
	var header=new Header();
	var ccontainer=new Container.Container();
	/**/
	/**//**/
	/*mv evnets*/
	(function(){
		var mvDiv=$(".divMv");
		var mvSource={};
		$.ajax({
			url:"./js/mvSource.json",
			dataType:"json",
			data:{},
			async:false,
			success:function(data){
				mvSource=data;
			}
		});
		for(var i=0;i<mvDiv.length;i++){
			if(typeof mvSource[i]=="undefined") break;
			var tag="\<img src=\' "+mvSource[i].mvPic+"\'  mvData=\'"+ mvSource[i].mvUrl+"\' \/\>";
			$(mvDiv[i]).append(tag);
			$(mvDiv[i]).bind("click",openMv()["mv"+i]);
		}
		function openMv(){
			return{
				mv0:function(){
					var mv=new Mv(mvSource[0].mvUrl);
					mv.init();
				},
				mv1:function(){
					var mv=new Mv(mvSource[1].mvUrl);
					mv.init();
				},
				mv2:function(){
					var mv=new Mv(mvSource[2].mvUrl);
					mv.init();
				},
				mv3:function(){
					var mv=new Mv(mvSource[3].mvUrl);
					mv.init();
				},
				mv4:function(){
					var mv=new Mv(mvSource[4].mvUrl);
					mv.init();
				},
				mv5:function(){
					var mv=new Mv(mvSource[5].mvUrl);
					mv.init();
				},
			}
				
		}
	})();
});
