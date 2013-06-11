var Background = (function (){
	// variables ----------------------------------------------------------------
	var _this 		= {},
		_websites	= [];
			
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		// list of website liked
		_websites = [];
		
		// receive post messages from "inject.js" and any iframes
		chrome.extension.onRequest.addListener(onPostMessage);
		
		// manage when a user change tabs
		chrome.tabs.onActivated.addListener(onTabActivated);		
	};
	
	// private functions --------------------------------------------------------
	function upateCurrentTab (){
		// highlight the "heart" if the web page is already liked
		chrome.tabs.getSelected(null, function (tab){
			var website = null;
			
			for (var i in _websites){
				if (_websites[i].url == tab.url) website = _websites[i];
			}
			
			if (website){
				// send a message to all the views (with "*" wildcard)
				_this.tell('website-is-hearted', {view:'*', comment:website.comment});
			}
		});
	};	
	
	function processMessage (request){
		// process the request
		switch (request.message){
			case 'save-iheart': message_onSaved(request.data); break;
			case 'all-iframes-loaded': message_allIframesLoaded(request.data); break;
		}
	};
	
	// events -------------------------------------------------------------------
	function onPostMessage (request, sender, sendResponse){
		if (!request.message) return;
		
		// if it has a "view", it resends the message to all the frames in the current tab
		if (request.data.view){
			_this.tell(request.message, request.data);
			return;
		}
		
		processMessage(request);
	};

	function onTabActivated (){
		upateCurrentTab();
	};

	// messages -----------------------------------------------------------------
	function message_onSaved (data){
		_websites.push({
			url			: data.url,
			title		: data.title,
			comment		: data.comment
		});
	};
	
	function message_allIframesLoaded (data){
		upateCurrentTab();
	};
	
	// public functions ---------------------------------------------------------
	_this.getWebsites = function (){
		return _websites;
	};
	
	_this.tell = function (message, data){
		var data = data || {};
		
		// find the current tab and send a message to "inject.js" and all the iframes
		chrome.tabs.getSelected(null, function (tab){
			if (!tab) return;
			
			chrome.tabs.sendMessage(tab.id, {
				message	: message,
				data	: data
			});
		});
	};
	
	return _this;
}());

window.addEventListener("load", function() { Background.init(); }, false);