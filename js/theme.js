/* CLOSE \ OPEN BLOCKS */

function blocksOpenClose() {
	var blockTitleAll = document.querySelectorAll('.post-block>.block-title'),
		bt;

	if (!blockTitleAll[0]) return;

	for (var i = 0; i < blockTitleAll.length; i++) {
		bt = blockTitleAll[i];
		var bb = bt.parentElement.querySelector('.block-body');
		if (bb.parentElement.classList.contains('code') && bb.scrollHeight <= bb.offsetHeight) bb.parentElement.classList.remove('box');
		bt.addEventListener('click', clickOnElement, false);
	}

	function clickOnElement(event) {
		var p = el().t.parentElement;
		function el() {
			var event = event || window.event;
			var target = event.target || event.srcElement;
			return {e: event, t: target};
		}
		if (p.classList.contains('spoil') || p.classList.contains('header')) toggler("close", "open");
		if (p.classList.contains('code')) toggler("unbox", "box");
		function toggler(c, o) {
			if (p.classList.contains(c)) {
				p.classList.remove(c);
				p.classList.add(o);
			}
			else if (p.classList.contains(o)) {
				p.classList.remove(o);
				p.classList.add(c);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', blocksOpenClose);

/* SROLL TO ANCHOR */

function scrollToAnchor(name) {
	if (typeof name != 'string') name = elemToScroll;
	var anchor = document.querySelector('[name="' + name + '"]');
	var p = anchor;
	if (anchor) {
		while (!p.classList.contains('post_body')) {
			if (p.classList.contains('spoil')) {
				p.classList.remove('close');
				p.classList.add('open');
			}
			p = p.parentNode;
		}
	}
	anchor.scrollIntoView();
//	highlight post
	document.querySelector('DIV[name="' + name + '"] + .post_container').classList.add('active');
}
document.addEventListener('DOMContentLoaded', scrollToAnchor);

/* CODE LINE NUMBERING */

function numberingCodeLines() {
	var codeBlockAll = document.querySelectorAll('.post-block.code');
	for (var i = 0; i < codeBlockAll.length; i++) {
		var codeBlock = codeBlockAll[i],
			codeTitle = codeBlock.querySelector('.block-title'),
			codeBody = codeBlock.querySelector('.block-body'),
			newCode = codeBody.innerHTML.split('<br>'),
			count = '',
			lines = '';

		while (~newCode[newCode.length - 1].search(/^\s*$/gi)) newCode.pop();

		for (var j = 0; j < newCode.length; j++) {
			lines += '<div class="line"><span class="num-wrap">' + (j + 1) + '</span>' + newCode[j] + '</div>';
			count += (j + 1) + '\n';
		}

		codeBlock.setAttribute('wraptext', 'wrap');
		codeTitle.insertAdjacentHTML("afterEnd", '<span class="toggle-btn"><span>PRE</span></span><div class="num-pre">' + count + '</div>');
		codeBlock.querySelector('.toggle-btn').addEventListener('click', onClickToggleButton, false);
		codeBody.innerHTML = lines;
	}
	function onClickToggleButton() {
		for (var i = 0; i < codeBlockAll.length; i++) {
			if (codeBlockAll[i].getAttribute('wraptext') == 'wrap') {
				codeBlockAll[i].setAttribute('wraptext', 'pre');
			}
			else codeBlockAll[i].setAttribute('wraptext', 'wrap');
		}
	}
}

document.addEventListener('DOMContentLoaded', numberingCodeLines);

/* HIDE IMAGES IN SPOILER */

function spoilsImageLoad() {
	if (!document.body.classList.contains("noimages")) return;
	var postBlockSpoils = document.body.querySelectorAll('.post-block.spoil.close > .block-body');
	for (var i = 0; i < postBlockSpoils.length; i++) {
		var images = postBlockSpoils[i].querySelectorAll('img');
		for (var j = 0; j < images.length; j++) {
			var img = images[j];
			if (!img.hasAttribute('src') || img.dataset.imageSrc) continue;
			img.dataset.imageSrc = img.src;
			img.removeAttribute('src');
		}
	}
	document.body.addEventListener("click", substitutionAttributes);

	function substitutionAttributes(event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		while (target != this) {
			if (~target.className.indexOf('spoil')) {
				var images = target.querySelectorAll('img');
				for (var i = 0; i < images.length; i++) {
					var img = images[i];
					if (img.hasAttribute('src') || !img.dataset.imageSrc) continue;
					img.src = img.dataset.imageSrc;
					img.removeAttribute('data-image-src');
				}
				return;
			}
			target = target.parentNode;
		}
	}
}

document.addEventListener('DOMContentLoaded', spoilsImageLoad);

/* ALL POST ATTACHES */

function getAttaches() {
	var anchorList = document.querySelectorAll('div[id*="entry"]');
	var jsonArr = [];
	for (var i = 0; i < anchorList.length; i++) {
		var post = anchorList[i].nextElementSibling;
		if (post.className != 'post_container') break;
		var attachList = post.querySelectorAll("a[rel*='lytebox']");
		var obj = [];
		for (var j = 0, count = 0; j < attachList.length; j++) {
			var att = attachList[j].getAttribute('href');
			if (att.match(/jpg|png|bmp|gif|jpeg/i)) {
				obj.push(att);
				count++;
			}
		}
		if (!obj[0]) continue;
		jsonArr.push(obj);
	}
	return jsonArr;
}
window.addEventListener('load', getAttachesFoo); 
function getAttachesFoo() {
	HTMLOUT.sendPostsAttaches(JSON.stringify(getAttaches()));
};

/* SELECT ELEMENT TEXT */

function setSelection(target) {
	var rng, sel;
	if (document.createRange) {
		rng = document.createRange();
		rng.selectNode(target);
		sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(rng);
	}
	else {
		var rng = document.body.createTextRange();
		rng.moveToElementText(target);
		rng.select();
	}
}

/* GET SELECTED TEXT */


function getSelectedText() {
	var txt = '';
	if (window.getSelection) {
		txt = window.getSelection();
	}
	else if (document.getSelection) {
		txt = document.getSelection();
	}
	else if (document.selection) {
		txt = document.selection.createRange().text;
	}
	else return;
	return txt;
};

/* BB-Codes */

function changeBBCodesTheme() {
	if (document.body.id != 'bbcodes') return;

	var head = document.querySelector('head'),
		lightTheme = head.querySelector('link[rel*="stylesheet"][href*="light"]'),
		imgAll = document.querySelectorAll('.bb_panel img');

	for (var i = 0; i < imgAll.length; i++) {
		var img = imgAll[i],
			theme = '';
		(lightTheme) ? theme = 'light' : theme = 'dark';
		img.setAttribute('src', 'img/bbcodes/' + theme + '/' + img.getAttribute('src'));
	}
}
document.addEventListener("DOMContentLoaded", changeBBCodesTheme);

function bbToHtml() {
	var tex = document.querySelector('.text_form > textarea');
	var str = tex.value;
	var post = document.querySelector('.post_body');
	var unit = ['16px','8pt','10pt','12pt','14pt','18pt','24pt','36pt'];
	var openTag = /\[([^\]]+)\]/gi;
	var closeTag = /\[\/([^\]]+)\]/gi;
	var jjj = [];
	function fontSize(num) {
		jjj.push(num);
	}

//	for (var i = 0; i < .length; i++) {

//	}

//	var rex = /\[([^\]]+)\]([\s\S]*?)\[\/\1\]/gi;

//	var result = tex.replace(rex,'<$1>$2</$1>');

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
		'<span style="font-size:$1">$2</span>',
		'<span style="color:$1">$2</span>',
		'<span style="background-color:$1">$2</span>',
		'<a href="/forum/index.php?act=findpost&amp;pid=$1" target="_blank" title="Перейти к сообщению"><img src="/forum/style_images/1/post_snapback.gif" alt="*" border="0"></a>',
		'<a name="$1" title="$1"></a>',
		'<span style="font-family:$1">$2</span>',
		'<li>',
		'<ul>$1</ul>',
		'<ol>$1</ol>',
		'<img alt="Изображение" src="$1">',
		'<a attach_id="12345678" s="" href="" data-rel="lyteframe" rev="width:728px;height:628px;scrolling:no;" title="Скачать $1" target="_blank"><img src="http://s.4pda.to/rPN7Bp5p2BENcUkIowGTdSc4Dcz27s13tNLLWGXkIuwv6XCUfsN4vOBXz22SsgUjvk.gif" alt="Прикрепленный файл" style="margin-right:3px;">$1</a> ( 0 КБ )<span class="desc">Кол-во скачиваний: 0</span><br>',
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
	blocksOpenClose();
	numberingCodeLines();
	alert(jjj);
}

var newSel;
function bbCode(openTag, closeTag) {
    var textComponent = document.getElementById('text');
	var sel;
	var bbStr = openTag + closeTag;
	if (textComponent.selectionStart != undefined) {
        textComponent.focus();
        var startPos = textComponent.selectionStart;
        var endPos = textComponent.selectionEnd;
		if (startPos != endPos) {
			sel = textComponent.value.substring(startPos, endPos);
			newSel = openTag + sel + closeTag;
			textComponent.value = textComponent.value.substr(0, startPos) + newSel + textComponent.value.substr(endPos);
			textComponent.setSelectionRange(startPos,endPos+bbStr.length);
		}
		else {
			alert("Текст не выделен");
		}
    }
}
