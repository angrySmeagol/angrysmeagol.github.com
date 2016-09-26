define(["backbone"],function(Backbone){
	var Container=function(){
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
	return {
		Container
	}
});
