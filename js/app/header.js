define(['backbone'],function(Backbone){
	var Header=function(){
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
						$(window).scroll(function(){
							if($(window).scrollTop()>=50){
								$('#header').addClass('top');
							}
							else{
								$('#header').removeClass('top');
							}
						});
						Backbone.history.loadUrl();
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

	return Header;


	
});
