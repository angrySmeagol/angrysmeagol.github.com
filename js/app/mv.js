define(["backbone"],function(backBone){
	var mv=function(url){
		this.init=function(){
			$("#mask").css("opacity","0.5").css("pointer-events","auto");
			$("#mvPlayer").css("opacity","1").css("pointer-events","auto");
			var str=url.substring(0,url.lastIndexOf("."));
			var mv='<video id="video" width="100%" height="100%" controls="controls" autoplay="autopaly"><source src="'
			+str+'.mp4" type="video/mp4" /> <source src="'
			+str+'.ogg" type="video/ogg" /> <source src="'
			+str+'.webm" type="video/webm" />  <object data="'
			+str+'.mp4" width="100%" height="100%"> <embed src="'
			+str+'.swf" width="100%" height="100%" /></object></video>';
			
			$("#mvPlayer").append(mv);
			$("#mask").bind("click",this.closeMv);
		};
		this.closeMv=function(){
			$("#video").remove();
			$("#mask").css("opacity","0").css("pointer-events","none");
			$("#mvPlayer").css("opacity","0").css("pointer-events","none");
		};
	}
	return mv;
});
