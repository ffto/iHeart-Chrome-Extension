var Comment = (function (){
	// variables ----------------------------------------------------------------
	var _this 		= {},
		_iframe		= null;
	
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		_iframe = new IframeManager();
		_iframe.setListener(onMessage);
		
		$('#save').on('click', save_onClick);
	};
	
	// private functions --------------------------------------------------------

	// events -------------------------------------------------------------------
	function onMessage (request){
		switch (request.message){
			case 'open-comment': 
				message_onOpenComment(request.data); 
				break;
			case 'website-is-hearted': 
				message_onIsHearted(request.data); 
				break;
		}
	};
	
	function save_onClick (event){
		var comment = $('#comment').val() || '';
		
		_iframe.tell('save-iheart', {
			comment	: comment
		});
	};

	// messages -----------------------------------------------------------------
	function message_onOpenComment (data){
		$('.page-title').html(data.title);
	};
	
	function message_onIsHearted (data){
		$('#comment').val(data.comment);
	};
	
	// public functions ---------------------------------------------------------

	return _this;
}());

document.addEventListener("DOMContentLoaded", function (){ new Comment.init(); }, false);