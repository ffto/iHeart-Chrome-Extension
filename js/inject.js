var Inject = (function (){
	// constants ----------------------------------------------------------------
	var ID = {
		CONTAINER		: 'iheart-container',
		IFRAME_PREFIX	: 'iheart-iframe-'
	};
	
	// variables ----------------------------------------------------------------
	var _this		= {},
		_views		= {},
		_container	= null;
	
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		// create the main container
		_container = $('<div />', {id:ID.CONTAINER});
		_container.appendTo(document.body);
		
		// add the "heart" and "comment" iframes
		getView('heart', _container);
		getView('comment', _container);

		// listen to the iframes/webpages message
		window.addEventListener("message", dom_onMessage, false);
	
		// listen to the Control Center (background.js) messages
		chrome.extension.onMessage.addListener(background_onMessage);
	};
	
	// private functions --------------------------------------------------------
	function getView (id){
		// return the view if it's already created
		if (_views[id]) return _views[id];
		
		// iframe initial details
		var src		= chrome.extension.getURL('html/iframe/'+id+'.html?view='+id+'&_'+(new Date().getTime())),
			iframe	= $('<iframe />', {id:ID.IFRAME_PREFIX+id, src:src, scrolling:false});
		
		// view
		_views[id] = {
			isLoaded	: false,
			iframe		: iframe
		};
		
		// add to the container
		_container.append(iframe);
		
		return _views[id];
	};
	
	function tell (message, data){
		var data = data || {};
		
		// send a message to "background.js"
		chrome.extension.sendRequest({
			message : message,
			data	: data
		});
	};
	
	function processMessage (request){
		if (!request.message) return;
		
		switch (request.message){
			case 'iframe-loaded': message_onIframeLoaded(request.data); break;
			case 'heart-clicked': message_onHeartClicked(request.data); break;
			case 'save-iheart': message_onSaved(request.data); break;
		}
	};
	
	// events -------------------------------------------------------------------	
	// messages coming from iframes and the current webpage
	function dom_onMessage (event){		
		if (!event.data.message) return;
		
		// tell another iframe a message
		if (event.data.view){
			tell(event.data);
		}else{
			processMessage(event.data);
		}
	};
	
	// messages coming from "background.js"
	function background_onMessage (request, sender, sendResponse){
		if (request.data.view) return;		
		processMessage(request);
	};
	
	// messages -----------------------------------------------------------------
	function message_onIframeLoaded (data){
		var view 		= getView(data.source),
			allLoaded	= true;
		
		view.isLoaded = true;
		
		for (var i in _views){
			if (_views[i].isLoaded === false) allLoaded = false;
		}
		
		// tell "background.js" that all the frames are loaded
		if (allLoaded) tell('all-iframes-loaded');
	};
	
	function message_onHeartClicked (data){
		var comment = getView('comment');
		
		comment.iframe.show();
		
		// tell the "comment" iframe to show dynamic info (the page title)
		tell('open-comment', {view:'comment', url:window.location.href, title:document.title});
	};
		
	function message_onSaved (data){
		var comment = getView('comment');

		comment.iframe.hide();
		
		// tell "background.js" to save the liked page
		tell('save-iheart', {url:window.location.href, title:document.title, comment:data.comment});
	};
	
	return _this;
}());
document.addEventListener("DOMContentLoaded", function (){ Inject.init(); }, false);
