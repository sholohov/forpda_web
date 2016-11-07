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
	var tex = document.querySelector('.text_form > textarea');
	tex.addEventListener('click', function() {tex.scrollIntoView();});
}
document.addEventListener("DOMContentLoaded", changeBBCodesTheme);

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
	blocksOpenClose();
	numberingCodeLines();
}

var newSel;
function bbCode(openTag, closeTag) {
    var textComponent = document.getElementById('text'),
		sel,
		bbStr = openTag + closeTag,
		startPos = textComponent.selectionStart,
		endPos = textComponent.selectionEnd;

	textComponent.focus();

	if (startPos != endPos) {
		sel = textComponent.value.substring(startPos, endPos);
		newSel = openTag + sel + closeTag;
		textComponent.value = textComponent.value.substr(0, startPos) + newSel + textComponent.value.substr(endPos);
		textComponent.setSelectionRange(startPos, endPos + bbStr.length);
    }
}
