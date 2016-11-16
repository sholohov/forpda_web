// change bb-codes buttons theme
// lite or dark(all else)
// value get from style name  
function changeBBCodesTheme() {
	textComponent = document.getElementById('text');
	if (document.body.id != 'bbcodes') return;

	var head = document.querySelector('head'),
		lightTheme = document.querySelector('link[rel*="stylesheet"][href*="light"]' || 'link[rel*="stylesheet"][href*="white"]'),
		imgAll = document.querySelectorAll('.bb_panel img');

	for (var i = 0; i < imgAll.length; i++) {
		var img = imgAll[i],
			theme = '';
		(lightTheme) ? theme = 'light' : theme = 'dark';
		img.setAttribute('src', 'img/bbcodes/' + theme + '/' + img.getAttribute('src'));
	}
}
document.addEventListener("DOMContentLoaded", changeBBCodesTheme);

var customDialogOBJ = {
	tag: '',
	type: '',
	text: ''
};

function bbDialog(tagName) {
	customDialogOBJ.tag = tagName;

	if (tagName == 'URL') createDialog('URL адрес', 'http://site.com', 'all');
	if (tagName == 'SPOILER') createDialog('Название спойлера', 'Спойлер', 'all');
	if (tagName == 'SIZE') createDialog('Размер текста', 'Число от 1 до 7', 'all');
	if (tagName == 'LIST' || tagName == 'LIST=1') createDialog('Название пункта списка', 'Пункт списка', 'list');
	if (tagName == 'COLOR') createDialog('Цвет текста', 'royalblue', 'color');
	if (tagName == 'BACKGROUND') createDialog('Цвет фона', 'grey', 'color');
}

function createDialog(message, hint, type) {
	var color = document.querySelector('#color'),
		prompt = document.querySelector('#prompt');

	customDialogOBJ.type = type;

	if (type == 'list') {
		bbCode('[' + customDialogOBJ.tag + ']', '[/list]');
	}
	if (type == 'all' || type == 'list') {
		prompt.removeAttribute('style');
		prompt.querySelector('.title').innerHTML = message;
		prompt.querySelector('textarea').placeholder = hint;
		prompt.querySelector('textarea').focus();
	}
	if (type == 'color') {
		color.removeAttribute('style');
		color.querySelector('.title').innerHTML = message;
		color.onclick = onClickColorCell;
		function onClickColorCell(e) {
			var el = e.target;
			bbCode('[' + customDialogOBJ.tag + '=' + el.textContent + ']', '[/' + customDialogOBJ.tag + ']');
			cancelDialog(color);
		}
	}
}

function cancelDialog(el) {
	while (el != document.body) {
		if (el.classList.contains('parent_dialog')) {
			if (el.querySelector('textarea')) el.querySelector('textarea').value = '';
			el.style.display = 'none';
			return null;
		}
		el = el.parentElement;
	}
}

function confirmDialog(el) {
	var textarea = document.querySelector('#prompt textarea');
	var text = textarea.value;

	customDialogOBJ.text = text;

	if (customDialogOBJ.type == 'all') {
		if (text == '') bbCode('[' + customDialogOBJ.tag + ']', '[/' + customDialogOBJ.tag + ']');
		else if (text == null) bbCode('', '');
		else bbCode('[' + customDialogOBJ.tag + '=' + text + ']', '[/' + customDialogOBJ.tag + ']');
		cancelDialog(el);
	}
	if (customDialogOBJ.type == 'list') {
		if (text != '') {
			bbCode('[*]' + text, '');
			textarea.focus();
			textarea.value = '';
		}
	}
}

var newSel;
function bbCode(openTag, closeTag) {
	var textComponent = document.getElementById('text'),
		sel,
		bbStr = openTag + closeTag,
		startPos = textComponent.selectionStart,
		endPos = textComponent.selectionEnd;

	textComponent.focus();

	sel = textComponent.value.substring(startPos, endPos);
	newSel = openTag + sel + closeTag;
	textComponent.value = textComponent.value.substr(0, startPos) + newSel + textComponent.value.substr(endPos);
	if (startPos != endPos) textComponent.setSelectionRange(startPos, endPos + bbStr.length);
	else textComponent.setSelectionRange(startPos + openTag.length, endPos + openTag.length);
}

function bbToHtml() {
	var tex = document.querySelector('.text_form > textarea');
	var str = tex.value;
	var post = document.querySelector('.post_body');
	var openTag = /\[([^\]]+)\]/gi;
	var closeTag = /\[\/([^\]]+)\]/gi;

	var bb = [/\n/gi,
		/\[b\]([\s\S]*?)\[\/b\]/gi,
		/\[i\]([\s\S]*?)\[\/i\]/gi,
		/\[u\]([\s\S]*?)\[\/u\]/gi,
		/\[s\]([\s\S]*?)\[\/s\]/gi,
		/\[sup\]([\s\S]*?)\[\/sup\]/gi,
		/\[sub\]([\s\S]*?)\[\/sub\]/gi,
		/\[left\]([\s\S]*?)\[\/left\]/gi,
		/\[center\]([\s\S]*?)\[\/center\]/gi,
		/\[right\]([\s\S]*?)\[\/right\]/gi,
		/\[url[ ="]*([\s\S]*?)["]?\]([\s\S]*?)\[\/url\]/gi,
		/\[offtop\]([\s\S]*?)\[\/offtop\]/gi,
		/\[size[ ="]*(\d)*?["]?\]([\s\S]*?)\[\/size\]/gi,
		/\[color[ ="]*([\s\S]*?)["]?\]([\s\S]*?)\[\/color\]/gi,
		/\[background[ ="]*([\s\S]*?)["]?\]([\s\S]*?)\[\/background\]/gi,
		/\[snapback\](\d)+?\[\/snapback\]/gi,
		/\[anchor\]([\s\S]*?)\[\/anchor\]/gi,
		/\[font\]([\s\S]*?)\[\/font\]/gi,
		/\[\*\]/gi,
		/\[list\]([\s\S]*?)\[\/list\]/gi,
		/\[list[ ]?=["]?1["]?\]([\s\S]*?)\[\/list\]/gi,
		/\[img\]([\s\S]*?)\[\/img\]/gi,
		/\[attachment=["]?\d*:([\s\S]*?)["]?\]/gi,
		/\[quote([^\]]*?)?\]([\s\S]*?)\[\/quote\]/gi,
		/\[code[ ="]*([\s\S]*?)["]?\]([\s\S]*?)\[\/code\]/gi,
		/\[spoiler[ ="]*([\s\S]*?)["]?\]([\s\S]*?)\[\/spoiler\]/gi,
		/\[hide[^\]]*?\]([\s\S]*?)\[\/hide\]/gi,
		/\[cur\]([\s\S]*?)\[\/cur\]/gi,
		/\[mod\]([\s\S]*?)\[\/mod\]/gi,
		/\[ex\]([\s\S]*?)\[\/ex\]/gi];

	var html = ['<br>',
		'<b>$1</b>',
		'<i>$1</i>',
		'<u>$1</u>',
		'<del>$1</del>',
		'<sup>$1</sup>',
		'<sub>$1</sub>',
		'<div align="left">$1</div>',
		'<div align="center">$1</div>',
		'<div align="right">$1</div>',
		'<a href="$1">$1</a>',
		'<font style="font-size:9px;color:gray;">$1</font>',
		function(str, p1, p2) {
			var unit = ['8pt','10pt','12pt','14pt','18pt','24pt','36pt'];
			return '<span style="font-size:' + unit[p1 - 1] + '">' + p2 + '</span>';
		},
		'<span style="color:$1">$2</span>',
		'<span style="background-color:$1">$2</span>',
		'<a href="/forum/index.php?act=findpost&amp;pid=$1" target="_blank" title="Перейти к сообщению"><img src="/forum/style_images/1/post_snapback.gif" alt="*" border="0"></a>',
		'<a name="$1" title="$1"></a>',
		'<span style="font-family:$1">$2</span>',
		'<li>',
		'<ul>$1</ul>',
		'<ol>$1</ol>',
		'<img alt="Изображение" src="$1">',
		'<a attach_id="12345678" s="" href="" data-rel="lyteframe" ;scrolling:no;" title="Скачать $1" target="_blank"><img src="img/forum/file_attach.gif" alt="Прикрепленный файл" style="margin-right:3px;">$1</a> ( 0 КБ )<span class="desc">Кол-во скачиваний: 0</span><br>',
		'<div class="post-block quote"><div class="block-title">$1</div><div class="block-body">$2</div></div>',
		'<div class="post-block code box"><div class="block-title">$1</div><div class="block-body">$2</div></div>',
		'<div class="post-block spoil close"><div class="block-title">$1</div><div class="block-body">$2</div></div>',
		'<div class="post-block hidden"><div class="block-title"></div><div class="block-body">$1</div></div>',
		'<div class="post-block tbl cur"><div class="block-title">K</div><div class="block-body">$1</div></div>',
		'<div class="post-block tbl mod"><div class="block-title">M</div><div class="block-body">$1</div></div>',
		'<div class="post-block tbl ex"><div class="block-title">!</div><div class="block-body">$1</div></div>'];

	var rex = /\[[^\]]*?\]|\[\/[^\]]*?]/gi;
	while (rex.test(str)) {
		for (var i = 0; i < bb.length; i++) {
			str = str.replace(bb[i], html[i]);
		}
	}

	post.innerHTML = str;

	// reinicialisation functions
	blocksOpenClose();
	numberingCodeLines();
	document.querySelector('div[name="entry12345678"]').scrollIntoView();
}

// save content textarea
document.addEventListener('DOMContentLoaded', repastTextareaContent);
function repastTextareaContent() {
	var textarea = document.querySelector('#text');
	window.addEventListener('resize', windowLoaded);
	function windowLoaded() {
		var innerText = textarea.value;
		textarea.value = innerText;
	}
}

// hak for android 4.4.2 - not rerun css property vh after resize window
window.addEventListener('resize', changeBodyHeight);
function changeBodyHeight() {
	var b = document.body;
	b.style.height = '99%';
	setInterval(function() {b.style.height = '';}, 1);
}

// remove attribute "hidden" in body after load window
window.addEventListener('load', removeAttributeHidden);
function removeAttributeHidden() {
	document.body.removeAttribute('hidden');
}
