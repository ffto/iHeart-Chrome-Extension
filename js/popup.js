var Popup = (function (){
	// variables ----------------------------------------------------------------
	var _this 		= {},
		_background	= null;
	
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		_background = chrome.extension.getBackgroundPage().Background;
		showWebsites(_background.getWebsites());
	};
	
	// private functions --------------------------------------------------------
	function showWebsites (list){
		var output = [];
		
		for (var i in list){
			var website = list[i];
			output.push('<li>&#10084; '+'<a href="'+website.url+'">'+website.title+'</a>'+(website.comment?'<small>'+website.comment+'</small>':'')+'</li>');
		}
		
		// set the count 
		$('.website-count').html(list.length);
		
		// update the list of items
		$('.website-list').html(output.join(''));		
	};
	
	return _this;
}());

window.addEventListener("load", function() { new Popup.init(); }, false);