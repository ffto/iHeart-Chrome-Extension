var Heart = (function (){
	// variables ----------------------------------------------------------------
	var _this 		= {},
		_iframe		= null;
	
	// initialize ---------------------------------------------------------------
	_this.init = function (){
		_iframe = new IframeManager();
		_iframe.setListener(onMessage);
		
		$('.heart').on('click', heart_onClick);
	};
	
	// private functions --------------------------------------------------------

	// events -------------------------------------------------------------------
	function onMessage (request){
		switch (request.message){
			case 'website-is-hearted': message_onIsHearted(request.data); break;
		}
	};
	
	function heart_onClick (event){
		$('.heart').addClass('active');
		_iframe.tell('heart-clicked');
	};

	// messages -----------------------------------------------------------------
	function message_onIsHearted (data){
		$('.heart').addClass('active');
	};
	
	// public functions ---------------------------------------------------------

	return _this;
}());

document.addEventListener("DOMContentLoaded", function (){ new Heart.init(); }, false);