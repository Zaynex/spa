spa.shell = (function(){
	var configMap = {
		main_html : String() +
				'<div id="spa">'+
			'		<div class="spa-shell-head">'+
			'			<div class="spa-shell-head-logo"></div>'+
			'			<div class="spa-shell-head-acct"></div>'+
			'			<div class="spa-shell-head-search"></div>'+
			'		</div>'+
			'		<div class="spa-shell-main">'+
			'			<div class="spa-shell-main-nav"></div>'+
			'			<div class="spa-shell-main-content"></div>'+
			'		</div>'+
			'		<div class="spa-shell-foot"></div>'+
			'		<div class="spa-shell-chat"></div>'+
			'		<div class="spa-shell-modal"></div>'+
			'	</div>',
		chat_extend_time: 350,
		chat_retract_time: 300,
		chat_extend_height: 450,
		chat_retract_height: 15,
		chat_extend_title: 'click to retract',
		chat_retract_title: 'click to extend'
	},

	//将整个模块中共享的动态信息放在stateMap变量中
	stateMap = 
		{
			$container: null,
			is_chat_retracted: true	
		},

	//将jQuery集合缓存在jqueryMap中
	jqueryMap = {},

	setjqueryMap, toggleChat, onclickChat, initModule;//声明所有模块作用域的变量

	//使用setjqueryMap来缓存jQuery集合，减少jQuery对文档的遍历次数
	setjqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = {
		 $container : $container,
		 $chat: $container.find('.spa-shell-chat')
		 };
	};


	//聊天模块滑动
	toggleChat = function(do_extend, callback) {
		var px_chat_ht = Math.ceil(jqueryMap.$chat.height()),
			is_open = px_chat_ht === configMap.chat_extend_height,
			is_closed = px_chat_ht === configMap.chat_retract_height,
			is_sliding = ! is_open && ! is_closed;
		if(is_sliding){return false};//避免出现竞争，在滑动中拒绝执行操作
		if(do_extend) {
			jqueryMap.$chat.animate({height: configMap.chat_extend_height}, configMap.chat_extend_time, function(){
					jqueryMap.$chat.attr('title', configMap.chat_extend_title);
					stateMap.is_chat_retracted = false;
					if(callback) {callback(jqueryMap.$chat);}
				}
			)
			return true;			
		}

		jqueryMap.$chat.animate({height: configMap.chat_retract_height}, configMap.chat_retract_time,function(){
			jqueryMap.$chat.attr('title', configMap.chat_retract_title);
			stateMap.is_chat_retracted = true;
			if(callback) {callback(jqueryMap.$chat);}
		})

		return true;
	};	

	onclickChat = function(event) {
		if(toggleChat(stateMap.is_chat_retracted)) {
			$.uriAnchor.setAnchor({
				chat: (stateMap.is_chat_retracted? "open" : "closed")
			});
			return false;
		};
		/*
		toggleChat(stateMap.is_chat_retracted);
		return false;
		*/
	}
	//聊天模块滑动结束
















	initModule = function($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setjqueryMap();
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat.attr("title", configMap.chat_retract_title).click(onclickChat);
		//setTimeout(function(){toggleChat(true);}, 3000);
		//setTimeout(function(){toggleChat(false);}, 8000);
	};






	return {initModule: initModule};
}());