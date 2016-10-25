(function($) {
	$('body').prepend($('\n\
	<div id="devbar">\n\
		<div id="dev-tabs">\n\
			<button class="btn" data-toggle="open" data-target="#devbar">D</button>\n\
		</div>\n\
		<div id="dev-content"></div>\n\
	</div>\n'));
	/*less.Parser().parse ( */
	less.render('\
#devbar{\
	position:fixed;\
	right:0;\
	top:0;\
	z-index:9999;\
	overflow:hidden;\
	text-align: left;\
	background:#222!important;\
	color:#fff!important;\
	padding:0!important;\
	margin:0!important;\
	font-size:16px!important;\
	max-height:100%;\
	-moz-box-shadow: 0 3px 3px rgba(0,0,0,0.3);\
	-webkit-box-shadow: 0 3px 3px rgba(0,0,0,0.3);\
	box-shadow: 0 3px 3px rgba(0,0,0,0.3);\
	* {font-size: 16px !important;}\
	input,button{\
		-moz-box-sizing:border-box;\
		-webkit-box-sizing:border-box;\
		box-sizing:border-box;\
		border-radius: 2px;\
		font-weight: bold;\
		color: #fff;\
		border: 1px solid #222;\
		background:#555;\
	}\
	 input:active, button:active{\
	 outline: none;\
		background:#777;\
	}\
	 input:focus, button:focus {\
		outline-color:#79c;\
	}\
	a {\
		color: #79c!important;\
	}\
	textarea{\
		margin-top: 8px;\
		font-size: 16px !important;\
		color: #aaa;\
		outline: none;\
		border: none;\
		overflow: auto;\
		background:#222;\
		-moz-box-sizing:border-box;\
		-webkit-box-sizing:border-box;\
		box-sizing:border-box;\
	}\
	pre{\
		margin-right:10px;\
		overflow:auto;\
		color:#f99;\
		background:#222;\
	}\
	.hide-element {\
		display:none;\
	}\
	#dev-content {\
		overflow:hidden;\
		display:none;\
		max-height:100%;\
		overflow-y:auto;\
		> *{\
			display:none;\
		}\
		> .show {\
			display:block;\
		}\
	}\
	#dev-tabs {\
		margin:0;\
		float:left;\
		.btn {\
			font-size:16px;\
			width:100%;\
		}\
		> * {\
			display:none;\
			&:first-child {\
				display:block;\
			}\
		}\
	}\
	&.open{\
		width:auto;\
		left:0;\
		display:block;\
		#dev-content {\
			display:block;\
			h1 {\
				font-size:20px;\
				font-weight:bold;\
				text-align:center;\
				margin:0;\
				padding:0;\
			}\
		}\
		#dev-tabs {\
			margin: 0 8px 0 0;\
			> * {\
				display:block;\
			}\
		}\
	}\
	.btn {\
		font-size: 12px !important;\
		margin:0;\
		padding: 8px;\
		min-width: 30px;\
		line-height:1;\
	}\
	.dev-query-container {\
		margin: 8px;\
		#dev-query-path {\
			color: grey;\
		}\
		#dev-query-info {\
			margin: 8px;\
		}\
	}\
	.selector{\
		color:#9cf;\
	}\
}', {}).then(function(output) {
		$('head').append('<style type="text/css">' + output.css + '</style>');
	}, function(error) {});
	/*, function ( error, result ) {
    $('head').append ( '<style type="text/css">'+result.toCSS()+'</style>' ); }
);*/

	$('[data-toggle="open"][data-target="#devbar"]').click(function() {
		$(this).next().click();
	});
	$('body').on('click', '[data-toggle]', function(ev) {
		var
			$this = $(this),
			toggle = $this.data('toggle'),
			target = $this.data('target') || $this.attr('target');
		if (toggle && target && $(target).size()) {
			ev.preventDefault();
			$(target).toggleClass(toggle);
		}
	});

	$('body').on('click', '[data-tab]', function(ev) {
		var
			$this = $(this),
			tab = $this.data('tab');
		if (tab) {
			ev.preventDefault();
			$('#devbar #dev-content > *').hide();
			$('#devbar #dev-content [data-tab-name="' + tab + '"]').show();
		}
	});
})(jQuery);