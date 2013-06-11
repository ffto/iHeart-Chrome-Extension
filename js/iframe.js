var IframeManager = function (){
	// variables ----------------------------------------------------------------
	var _this 		= {};
		_view		= null,
		_listener	= null;
	
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		// simple way to retrieve a querystring value
		_view = window.location.href.match(/view\=([^&]+)/)[1];
		
		// tell "inject.js" that the iframe is loaded
		_this.tell('iframe-loaded');
	
		// receive messages from "background.js"
		chrome.extension.onMessage.addListener(background_onMessage);			
	};
	
	// private functions --------------------------------------------------------

	// events -------------------------------------------------------------------
	function background_onMessage (request, sender, sendResponse){
		// make sure the message was for this view (you can use the "*" wildcard to target all views)
		if (!request.message || !request.data.view || (request.data.view != _view && request.data.view != '*')) return;
		
		// call the listener callback		
		if (_listener) _listener(request);
	};	
	
	// public functions ---------------------------------------------------------
	_this.setListener = function (callback){
		_listener = callback;
	};
	
	_this.tell = function (message, data){
		var data = data || {};
		
		data.source = _view;
		
		window.parent.postMessage({
			message	: message,
			data	: data
		}, '*');
	};
	
	_this.init();
	
	return _this;
};