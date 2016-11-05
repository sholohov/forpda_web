var body = document.body;
var avatar = body.querySelectorAll('.avatar');

//
// STYLE
//

var devToolBarStyle = document.createElement('style');
devToolBarStyle.innerHTML = 'body {\
	margin: 0;\
	padding: 0;\
}\
#dev_toolbar {\
	border-top: 1px solid white;\
	opacity: 1;\
	background-color: rgb(10,10,10);\
}\
#dev_toolbar .button {\
	display: inline-block;\
	color: white;\
	font-size: 16px;\
	line-height: 1.4;\
	padding: 4px 8px;\
	vertical-align: middle;\
	border-right: 1px solid white;\
}\
#dev_toolbar .button.active {\
	background-color: orange;\
}\
#outline_elements {\
}\
#outline_elements input {\
	display: none;\
}\
#avatar_off, #avatar_circle {\
	color: inherit;\
	border: none;\
	background-color: inherit;\
}\
';
body.appendChild(devToolBarStyle);

//
// TOOLBAR
//

var devToolBar = document.createElement('div');
devToolBar.id = 'dev_toolbar';
devToolBar.style.cssText = "position:fixed;\
bottom: 0;\
left: 0;\
right: 0;\
z-index:998;";
// body.appendChild(devToolBar);

//
// TOOLBAR HIDE
//

function toolBarHide() {
		var toolBarHideButton = document.createElement('label');
		toolBarHideButton.innerHTML = 'T <input type="checkbox" style="display:none">';
		toolBarHideButton.style.cssText = "position:fixed;\
		right:0;\
		bottom:0;\
		width: 32px;\
		height: 32px;\
		font-size: 16px;\
		line-height: 32px;\
		font-weight: bold;\
		text-align: center;\
		outline: 1px solid white;\
		color: white;\
		opacity: 0.5;\
		background:rgb(128,128,128);\
		z-index:999;";
		body.appendChild(toolBarHideButton);
		
		toolBarHideButton.addEventListener('click',function() {
				if (toolBarHideButton.querySelector('input[type="checkbox"]').checked) body.appendChild(devToolBar);
				else body.removeChild(devToolBar);
		});
}
toolBarHide();

//
//	OUTLINE ELEMENTS
//

function showOutlineElements() {
		var label = document.createElement('label');
		label.id = 'outline_elements';
		label.className = 'button';
		label.innerHTML = 'OUTLINE';
		devToolBar.appendChild(label);

		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		label.appendChild(checkbox);

		var outlineStyle = document.createElement('style');
		outlineStyle.innerHTML = "*, :before, :after {outline: 1px solid rgba(255,100,0,0.5);}";

		checkbox.addEventListener('change', toggleOutline);
		function toggleOutline() {
				if (checkbox.checked) {
						document.body.appendChild(outlineStyle);
						label.classList.add('active');
				}
				else {
						document.body.removeChild(outlineStyle);
						label.classList.remove('active');
				}
		}
}
showOutlineElements();

//
// LINK OFF
//

/*body.onclick = function(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;
		while (target != this) {
				if (target.nodeName == 'A') return false;
				target = target.parentNode;
		}
};
*/

//
// SWITCH FOR IMAGES
//

function imagesSwitch() {
		var imagesSwitchButton = document.createElement('button');
		imagesSwitchButton.innerHTML = 'AVA_OFF';
		imagesSwitchButton.id = "avatar_off";
		imagesSwitchButton.className = "button";
		devToolBar.appendChild(imagesSwitchButton);
		
		imagesSwitchButton.addEventListener('click',imagesSwitchButtonClick);
		function imagesSwitchButtonClick() {
				for (var i= 0; i < avatar.length; i++) {
						if (avatar[i].classList.contains('disable')) {
								avatar[i].classList.remove('disable');
								imagesSwitchButton.classList.remove('active');
						}
						else {
								avatar[i].classList.add('disable');
								imagesSwitchButton.classList.add('active');
						}
				}
		}
}
imagesSwitch();

//
// AVATAR CIRCLE
//

function avatarCircle() {
		var avatarCircleButton = document.createElement('button');
		avatarCircleButton.innerHTML = 'AVA_CIRCLE';
		avatarCircleButton.id = "avatar_circle";
		avatarCircleButton.className = "button";
		devToolBar.appendChild(avatarCircleButton);
		
		avatarCircleButton.addEventListener('click',avatarCircleButtonClick);
		function avatarCircleButtonClick() {
				for (var i= 0; i < avatar.length; i++) {
						if (avatar[i].classList.contains('circle')) {
							avatar[i].classList.remove('circle');
							avatarCircleButton.classList.remove('active');
						}
						else {
								avatar[i].classList.add('circle');
								avatarCircleButton.classList.add('active');
						}
				}
		}
}
avatarCircle();
