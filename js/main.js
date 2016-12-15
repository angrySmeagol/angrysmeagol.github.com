require.config({
	baseUrl:'./js/app',
	paths:{
		jquery:'../commen/3.1.1minJquery',
		underscore:'../commen/underscore',
		backbone:'../commen/backbone'
	},
	waitSeconds:0
});
require(["jquery","underscore","backbone"],function($,_,Backbone){
	var header=new Header();
	var container=new Container();
	var footer=new Footer();
	/*header*/
	function Header(){
		var Item=Backbone.Model.extend({

		});
		var ItemCollection=Backbone.Collection.extend({
			model:Item,
			comparator:function(Item){
				return Item.get("position");
			}
		});

		var MenuView=Backbone.View.extend({
			el:$('#fw_header'),
			template:_.template($("#header_tmpl").html()),
			goTop:function(){
				var sTop=document.documentElement.scrollTop+document.body.scrollTop;
				if(sTop==0) return;
				setTimeout(window.scrollBy(0,-80),100);
				this.goTop();
			},
			register:function(e){
				var link=e.target||e.srcElement;
				var url=link.href;

				e.preventDefault();
				var reg=new XMLHttpRequest();
				//reg.widthCredenttails=true;
				reg.open("post",url);
				reg.onreadystatechange=function(){
					if(reg.readyState ===4&&reg.status==200){
						console.log("success");
					}
				}
				reg.send(null);
			},
			render:function(){
				//this.el.empty();
				var html=this.template({value:this.model.toArray()});
				this.el.innerHTML=html;
				return this;
			}
		});

		var NavigationRouter=Backbone.Router.extend({
			_data:null,
			_items:null,
			_view:null,

			routes:{
				"info/:id":"showInfo",
				"*actions": "defaultRoute"
			},
			initialize:function(){
				var _this=this;
				$.ajax({
					url:"./js/fwMenu.json",
					dataType:"json",
					data:{},
					async:false,
					success:function(data){
						_this._data=data;
						_this._items=new ItemCollection(data);
						_this._view=new MenuView({model:_this._items});
						_this._view.render();
						$("#goTop").bind("click",function(){_this._view.goTop();});
						$("#register").bind("click",function(e){_this._view.register(e);});
						$(window).scroll(function(){
							if($(window).scrollTop()>=50){
								$('#header').addClass('top');
							}
							else{
								$('#header').removeClass('top');
							}
						});
						if($(window).scrollTop()>=50){
							$('#header').addClass('top');
						}
						else{
							$('#header').removeClass('top');
						}
						//Backbone.history.loadUrl();
					}
				});

			},
			showInfo:function(){
				console.log('routes');
			},
			defaultRoute:function(){

			}
		});
		
		var App=new NavigationRouter();
		Backbone.history.start();
	}
	/*Container*/
	function Container(){
		var PicItem=Backbone.Model.extend({
			defaults:{
				current:false
			}
			
		});
		var PicItemCollection=Backbone.Collection.extend({
			model:PicItem,
			comparator:function(PicItem){
				return PicItem.get('picId');
			}
		});
		var events=_.extend(Backbone.Events);
		
		var PicItemView=Backbone.View.extend({
			el:$("#fw_main"),
			template:_.template($("#main_tmpl_carousel1").html()),
			initialize:function(){
				for(var i=0;i<this.model.models.length;i++){
					this.model.models[i].set({"picId":i});
				}
			       	this.listenTo(this.model,"change:current",this.onChange);
			       	//Backbone.on('changeDisplay',this.onChange,this);
			},
			onChange:function(){
				var current=this.model.findWhere({'current':true});
				if(typeof current=="undefined"){
					return;
				}
				else{
					this.move(current.get("picId"));
				}
			},
			move:function(current){
				var _self=this;
				var start=parseFloat($("#carousel").css("left"));
				var end=$("#fw_carousel").width()*current*-1;
				if(start==end) return;
				var speed=(end-start)/20;
				var timer=setInterval(function(){
					if(end-start>50||end-start<-50){
							start+=speed;
							$("#carousel").css("left",start);
					}
					else{
						clearInterval(timer);
						$("#carousel").css("left",end);

						var current=_self.model.findWhere({'current':true});
						if(current) {
							current=current.get("picId");
						}
						$(".pager-item").removeClass("active");
						if(current==0){
							$("#carousel").css("left",$("#fw_carousel").width()*-7);
							_self.model.models[current].set({current:false});
							_self.model.models[7].set({current:true});
						}
						if(current==8){
							$("#carousel").css("left",$("#fw_carousel").width()*-1);
							_self.model.models[current].set({current:false});
							_self.model.models[1].set({current:true});
						}
						$("#pager"+_self.model.findWhere({'current':true}).get("picId")).addClass("active");
					}
					
				},30);


			},
			render:function(){
				//this.el.empty();
				var html=this.template({value:this.model.toArray()});
				$(html).appendTo(this.el);
				return this;
			}
		});

		var PicItemPagerView=Backbone.View.extend({
			el:$("#fw_main"),
			template:_.template($("#main_tmpl_carousel2").html()),
			events:{
				"click .pager-item":"btnClick",
				"click .picBtn":"nextClick",
				"mouseover .picBtn":"picBtnOver"
			},
			initialize:function () {
				var _self=this;
				_self.autoClick();
				events.timer=setInterval(function(){
						_self.autoClick();
					},5000);
			},
			picBtnOut:function(e){
				var timer=null;
				alpha=30;
				var iTarget=100;
				var oDiv=e.currentTarget;
				clearInterval(timer);
				timer=setInterval(function(){
					var speed=0;
					if(alpha<iTarget)
					{
						speed=10;
					}
					else
					{
						speed=-10;
					}
					if(alpha==iTarget)
					{
						clearInterval(timer);
					}
					else
					{
						alpha+=speed;
						oDiv.style.opacity=alpha/100;
					}
				},30);
			},
			picBtnOver:function(e){
				var timer=null;
				alpha=100;
				var iTarget=30;
				var oDiv=e.currentTarget;
				clearInterval(timer);
				timer=setInterval(function(){
					var speed=0;
					if(alpha<iTarget)
					{
						speed=10;
					}
					else
					{
						speed=-10;
					}
					if(alpha==iTarget)
					{
						clearInterval(timer);
					}
					else
					{
						alpha+=speed;
						oDiv.style.opacity=alpha/100;
					}
				},30);
			},
			nextClick:function(e){
				_self=this;
				var current=this.model.findWhere({'current':true});
				if(current) {
					current=current.get("picId");
				}
				clearInterval(events.timer);
				if(e.currentTarget.id=="picNext"){
					this.changePic(current);
				}
				else{
					this.model.models[current].set({current:false});
					this.model.models[current-1].set({current:true});
				}
				events.timer=setInterval(function(){
						_self.autoClick();
					},4000);
			},
			autoClick:function(){
				var current=this.model.findWhere({'current':true});
				
				if(typeof current=="undefined"){
					this.model.models[1].set({current:true});	
				}
				else{
					current=current.get("picId");
					this.changePic(current);
					
				}
			},
			btnClick:function(e){
				var _self=this;
				clearInterval(events.timer);
				var current=this.model.findWhere({'current':true});
				current=current.get("picId");

				this.model.models[current].set({current:false});

				var _current=e.currentTarget.innerText;
				this.model.models[_current].set({current:true});
				events.timer=setInterval(function(){
						_self.autoClick();
					},4000);
			},
			changePic:function(current){
				if(this.model.models[current+1]) {
					this.model.models[current+1].set({current:true});
				}else{return;}
				this.model.models[current].set({current:false});
				
			},
			render:function(){
				//this.el.empty();
				var html=this.template({value:this.model.toArray()});
				$(html).appendTo(this.el);
				return this;
			}
		});
		var NavigationRouter=Backbone.Router.extend({
			_data:null,
			_items:null,
			_view:null,
			_view2:null,
			routes:{	
			},
			initialize:function(){
				var _this=this;
				$.ajax({
					url:"./js/carousel.json",
					dataType:"json",
					data:{},
					async:false,
					success:function(data){
						_this._data=data;
						_this._items=new PicItemCollection(data);
						_this._items.unshift(data[data.length-1]);
						_this._items.push(data[0]);

						_this._view=new PicItemView({model:_this._items});
						_this._view.render();
						_this._view2=new PicItemPagerView({model:_this._items});
						_this._view2.render();
						$("#pager1").addClass("active");
						$(".picBtn").mouseout(_this._view2.picBtnOut);
					}
				});
			}
		});
		var App=new NavigationRouter();
	}
	/**/
	/**/
	/*footer*/
	function Footer(){
		var Item=Backbone.Model.extend({
			defaults:{
			}
		});
		var ItemCollection=Backbone.Collection.extend({
			model:Item
		});
		var Events=_.extend(Backbone.Events);
		Events.country=Events.more=Events.share=false;
		var ViewCountry=Backbone.View.extend({
			el:$("#footer-block"),
			template:_.template($("#footer_tmpl_countery").html()),
			initialize:function(){
				$(".click-area:first:first-child").bind("click",this.showCountry);
				$("#footer-block .close").bind("click",this.showCountry);
				Events.downCountry=this.showCountry;
			},
			showCountry:function(){
				if(Events.more==true){
					Events.downMore();
				}
				if(Events.share==true){
						Events.downShare();
				}
				$("#footer-block").hasClass("active")?$("#footer-block").removeClass("active"):$("#footer-block").addClass("active");
				if($("#footer-block").hasClass("active")){
					Events.country=true;
				}
				else{
					Events.country=false;
				}	
			
				
				
			},
			render:function(){
				var vaue=this.model.toArray()[0].get("country");
				/*var vaueCode=_.map(vaue,function(codeAt){
					return codeAt.charCodeAt(0);
				});*/
				var lenth=[0,16,30,46];
				var html=this.template({
					value:vaue,
					length:lenth
				});
				html="<div id='country-block'>"+html+"</div>";
				$(html).appendTo(this.el);
			}
		});
		var ViewMore=Backbone.View.extend({
			el:$("#more-block"),
			template:_.template($("#footer_tmpl_more").html()),
			initialize:function(){
				$(".arrow-block").bind("click",this.move);
				Events.downMore=this.move;
				

			},
			move:function(){
				//closeOtherView();
				$("#fw_footer").hasClass("move")?down():up();
				
				function down(){
					
					var height=parseInt($("#more-block").css("height").slice(0,$("#more-block").css("height").indexOf("px")));
					var min_height=25;
					var timer=setInterval(function(){
						height-=25;
						/*$("#fw_footer").css("bottom",bottom+"px");*/
						$("#fw_footer").css("height",height+"px");
						if(height<=min_height){
							clearInterval(timer);
							$("#fw_footer").removeClass("move");
							$("#more-block").css("display","none");	
							Events.more=false;
						}
					},9);
					
				};
				function up(){
					if(Events.country==true){
						Events.downCountry();
					}
					if(Events.share==true){
						Events.downShare();
					}
					$("#fw_footer").addClass("move");
					$("#more-block").css("display","block");
					var more_height=parseInt($("#more-block").css("height").slice(0,$("#more-block").css("height").indexOf("px")));
					var height=25;
					var timer=setInterval(function(){
						height+=25;
						/*$("#fw_footer").css("bottom",bottom+"px");*/
						$("#fw_footer").css("height",height+"px");
						if(height>more_height){
							clearInterval(timer);
							Events.more=true;
						}
					},9);
				};
			},
			render:function(){
				var vaue={
					keys:this.model.toArray()[1].keys(),
					values:this.model.toArray()[1].values()
				};
				var html=this.template({value:vaue});
				html="<div id='more-block-link'>"+html+"<div>";
				$(html).appendTo(this.el);
			}
		});
		var ViewShare=Backbone.View.extend({
			el:$("#share-block"),
			initialize:function(){
				$(".connect-block .click-area").bind("click",this.open);
				$("#share-block .close").bind("click",this.open);
				Events.downShare=this.open;
			},
			open:function(){
				if(Events.more==true){
					Events.downMore();
				}
				if(Events.country==true){
					Events.downCountry();
				}
				$("#share-block").hasClass("active")?$("#share-block").removeClass("active"):$("#share-block").addClass("active");
				if($("#share-block").hasClass("active")){
					Events.share=true;
				}
				else{
					Events.share=false;
				}
			},
			render:function(){
				var value=this.model.toArray()[2].get("website");
				for (var i = value.length - 1; i >= 0; i--) {
					var Div=$("<div id=\'"+_.keys(value[i])+"\'><img src=\'"+_.values(value[i])+"\'></img></div>");
					$(Div).appendTo(this.el);
				}
			}
		});
		var NavigationRouter=Backbone.Router.extend({
			_data:null,
			_items:null,
			_viewCountry:null,
			_viewMore:null,
			_viewShare:null,
			initialize:function(){
				var _this=this;
				$.ajax({
					url:'./js/footer.json',
					dataType:'json',
					data:{},
					async:false,
					success:function(data){
						_this._data=data;
						_this._items=new ItemCollection(data);
						_this._viewCountry=new ViewCountry({model:_this._items});
						_this._viewMore=new ViewMore({model:_this._items});
						_this._viewShare=new ViewShare({model:_this._items});
						_this._viewCountry.render();
						_this._viewMore.render();
						_this._viewShare.render();
					}
				});
			}	
		});
		var App=new NavigationRouter();
	};
	/**/
	/**/
	/*Mv*/
	function Mv(url){
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
	/*Mv*/
	function Mv(url){
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
