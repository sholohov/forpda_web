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
	alert(target.textContent);
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

/* get selected text */


function getSelectedText() {
	var txt = '';
	if (window.getSelection) {
		txt = window.getSelection();
	} else if (document.getSelection) {
		txt = document.getSelection();
	} else if (document.selection) {
		txt = document.selection.createRange().text;
	} else return;
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
	
//	var rex = /\[([^\]]+)\]([\s\S]*?)\[\/\1\]/gi;
//	var result = tex.replace(rex,'<$1>$2</$1>');
	
	var bb = [/\n/gi,
	/\[b\]/gi,/\[\/b\]/gi,
	/\[i\]/gi,/\[\/i\]/gi,
	/\[u\]/gi,/\[\/u\]/gi,
	/\[sup\]/gi,/\[\/sup\]/gi,
	/\[sub\]/gi,/\[\/sub\]/gi,
	/\[left\]/gi,/\[\/left\]/gi,
	/\[center\]/gi,/\[\/center\]/gi,
	/\[right\]/gi,/\[\/right\]/gi,
	/\[url[ ="]*([\s\S]*?)["]*\]/gi,/\[\/url\]/gi,
	/\[quote([^\]]*?)?\]/gi,/\[\/quote\]/gi,
	/\[offtop\]/gi,/\[\/offtop\]/gi,
	/\[hide[^\]]?\]/gi,/\[\/hide\]/gi,
	/\[size=["]*(\d)*?["]*\]/gi,/\[\/size\]/gi,
	/\[code[ ="]*([\s\S]*?)["]?\]/gi,/\[\/code\]/gi,
	/\[spoiler[ ="]*([\s\S]*?)["]?\]/gi,/\[\/spoiler\]/gi,
	/\[color[ ="]*([\s\S]*?)["]?\]/gi,/\[\/color\]/gi,
	/\[background[ ="]*([\s\S]*?)["]?\]/gi,/\[\/background\]/gi,
	/\[cur\]/gi,/\[\/cur\]/gi,
	/\[mod\]/gi,/\[\/mod\]/gi,
	/\[ex\]/gi,/\[\/ex\]/gi,
	/\[snapback\](\d)+?\[\/snapback\]/gi,
	/\[anchor\]([\s\S]*?)\[\/anchor\]/gi,
	/\[font\]/gi,/\[\/font\]/gi,
	/\[list[^\]]*?\]/gi,/\[\/list\]/gi,
	/\[\*\]([\s\S]*?)(?:\[\*\]|\[\/list\])/gi,
	/\[img\]([\s\S]*?)\[\/img\]/gi,
	/\[attachment=["]?([\s\S]*?)["]?\]/gi];

	var html = ['<br>',
	'<b>','</b>',
	'<i>','</i>',
	'<u>','</u>',
	'<sup>','</sup>',
	'<sub>','</sub>',
	'<div align="left">','</div>',
	'<div align="center">','</div>',
	'<div align="right">','</div>',
	'<a href="$1">','</a>',
	'<div class="post-block quote"><div class="block-title">$1</div><div class="block-body">','</div></div>',
	'<font style="font-size:9px;color:gray;">','</font>',
	'<div class="post-block hidden"><div class="block-title"></div><div class="block-body">','</div></div>',
	'<span style="font-size:$1">','</span>',
	'<div class="post-block code box"><div class="block-title">$1</div><div class="block-body">','</div></div>',
	'<div class="post-block spoil close"><div class="block-title">$1</div><div class="block-body">','</div></div>',
	'<span style="color:$1">','</span>',
	'<span style="background-color:$1">','</span>',
	'<div class="post-block tbl cur"><div class="block-title">K</div><div class="block-body">','</div></div>',
	'<div class="post-block tbl mod"><div class="block-title">M</div><div class="block-body">','</div></div>',
	'<div class="post-block tbl ex"><div class="block-title">!</div><div class="block-body">','</div></div>',
	'<a href="/forum/index.php?act=findpost&amp;pid=$1" target="_blank" title="Перейти к сообщению"><img src="/forum/style_images/1/post_snapback.gif" alt="*" border="0"></a>',
	'<a name="$1" title="$1"></a>',
	'<span style="font-family:$1">','</span>',
	'<ul>','</ul>',
	'<li>$1</li>',
	'<img alt="Изображение" src="$1">',
	'<div><strong><span class="edit">Прикреплённый файл</span></strong></div><br><span>example.exe</span><br><br>'];
	
	var bbCodesfontSize = ['0', '8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
	
	for (var i = 0; i < bb.length; i++) {
		str = str.replace(bb[i], html[i]);
	}
	post.innerHTML = str;
	blocksOpenClose();
	numberingCodeLines();
}

function bbCodesSelect() {
	document.querySelector('.bb_panel').addEventListener('click',clickBtn);
	function clickBtn(event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		while (target != this) {
			if (target.classList.contains('button')) {
				alert(getSelectedText());
				return;
			}
			target = target.parentNode;
		}
	}
}
document.addEventListener('DOMContentLoaded',bbCodesSelect);
