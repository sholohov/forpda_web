/**
 *		===================
 *		blocks close & open
 *		===================
 */

function blocksOpenClose() {
	var blockTitleAll = document.querySelectorAll('.post-block.spoil>.block-title,.post-block.code>.block-title'),
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
		if (p.classList.contains('spoil')) toggler("close", "open");
		if (p.classList.contains('code')) toggler("unbox", "box");
		function toggler(c, o) {
			if (p.classList.contains(c)) {
				p.classList.remove(c);
				p.classList.add(o);
			} else if (p.classList.contains(o)) {
				p.classList.remove(o);
				p.classList.add(c);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', blocksOpenClose);

/**
 *		================
 *		scroll to anchor
 *		================
 */

function scrollToAnchor() {
	var link = document.querySelector('.topic_title_post a');
	var anchor = document.querySelector('a[name="' + link.hash.match(/[^#].*/) + '"]');
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
}
document.addEventListener('DOMContentLoaded', scrollToAnchor);

/**
 *		=============
 *		selected text
 *		=============
 */

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

/**
 *		====================
 *		code lines numbering
 *		====================
 */

function numberingCodeLinesFoo() {
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
			} else codeBlockAll[i].setAttribute('wraptext', 'wrap');
		}
	}
}

document.addEventListener('DOMContentLoaded', numberingCodeLinesFoo);

/* ------------ */

var codeBlocks;
var initCodeType = true; //true - break, false - wrap;
var breakClass = "break";

function numberingCodeLinesFoo2() {
	var date = new Date();
    codeBlocks = document.querySelectorAll(".post-block.code");
    var myRegEx = /([^$][\s\S]*?)(?:<[^>]*>|$|\n)/g;
    var numbers, item, nums, blockBody, newCode, linesCount;
    for (var i = 0; i < codeBlocks.length; i++) {
        item = codeBlocks[i];
        blockBody = item.querySelector(".block-body");
        nums = document.createElement("DIV");
        numbers = "";
        newCode = "";
        linesString = "";
        linesCount = 0;

        if (initCodeType) item.classList.add(breakClass);

        var match;
        while (match = myRegEx.exec(blockBody.innerHTML)) {
            newCode += "<div>" + match[1] + "</div>";
            linesCount++;
            numbers += linesCount + "\n";
        }
        blockBody.innerHTML = newCode;

        nums.classList.add("num-pre");
        nums.innerHTML = numbers;
        item.appendChild(nums);

        item.querySelector(".block-title").insertAdjacentHTML("afterEnd", '<span class="toggle-btn"><span>PRE</span></span>');
        item.querySelector(".toggle-btn").onclick = onClickToggleBreak;
    }
	var date2 = new Date();
	alert(date2 - date);
}

function onClickToggleBreak() {
    for (var i = 0; i < codeBlocks.length; i++) {
        if (codeBlocks[i].classList.contains(breakClass))
            codeBlocks[i].classList.remove(breakClass);
        else
            codeBlocks[i].classList.add(breakClass);
    }
}
//document.addEventListener('DOMContentLoaded', numberingCodeLinesFoo2);

/**
 *		======================
 *		HIDE IMAGES IN SPOILER
 *		======================
 */

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

/**
 *		=================
 *		ALL POST ATTACHES
 *		=================
 */

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
window.onload = function() {
	HTMLOUT.sendPostsAttaches(JSON.stringify(getAttaches()));
};

/**
 *	===========
 *	RELOAD PAGE
 *	===========
 */

document.addEventListener('DOMContentLoaded', locationReload);

function locationReload() {
	var pageUrl = document.querySelector(".topic_title_post > A").href;
	var cutHashUrl = pageUrl.match(/.+st=\d+/g);
	window.onkeydown = function(e) {
		if (event.keyCode == 116) window.location.assign(cutHashUrl);
	};
}

/**
 *		================================
 *		MULTIMODERATION NAVIGATION PANEL
 *		================================
 */

function pagesPanelFoo() {
	var panels = document.querySelectorAll('#curator .panel');

	for (var i = 0; i < panels.length; i++) {
		var panel = panels[i];
		var pageList = panel.querySelector('.pages');
		var pages = panel.querySelectorAll('a, b');
		var activePage = pageList.querySelector('b');

		function getPage(el) {
			if (el.nodeName == "B") return '<b></b>';
			else return '<a href="' + el.getAttribute("href") + '"></a>';
		}

		var firstPage = document.createElement('span');
		firstPage.innerHTML = getPage(pages[0]);
		firstPage.className = 'first-page';
		panel.insertBefore(firstPage, pageList);

		var lastPage = document.createElement('span');
		lastPage.innerHTML = getPage(pages[pages.length - 1]);
		lastPage.className = 'last-page';
		panel.insertBefore(lastPage, pageList.nextSibling);

		pageList.classList.add('close');
		pageList.addEventListener('click', toggle);

		function toggle() {
			if (this.classList.contains('close')) {
				this.classList.remove('close');
				this.classList.add('open');
			} else {
				this.classList.remove('open');
				this.classList.add('close');
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', pagesPanelFoo);

window.addEventListener("load", function() {
							var panels = document.querySelectorAll('#curator .panel');
							for (var i = 0; i < panels.length; i++) {
								var panel = panels[i];
								var pageList = panel.querySelector('.pages');
								var activePage = pageList.querySelector('b');

								pageList.scrollTop = (activePage.offsetTop - activePage.parentNode.offsetTop);
							}
						});

/**	
 *		==================
 *		QMS SELECT MESSAGE
 *		==================
 */

document.addEventListener("click", checkedQmsMessage);
var messForDeleteCount = 0;

function checkedQmsMessage() {
	var event = event || window.event;
	var target = event.target || event.srcElement;
	while (target != this) {
		if (target.nodeName == 'A') return;
		if (~target.className.indexOf('list-group-item')) {
			var checkbox = target.getElementsByTagName('input')[0];
			if (checkbox.checked) {
				checkbox.checked = false;
				target.classList.remove('selected');
				messForDeleteCount--;
			} else {
				checkbox.checked = true;
				target.classList.add('selected');
				messForDeleteCount++;
			}
			if (messForDeleteCount > 0) {
				HTMLOUT.startDeleteModeJs(messForDeleteCount);
			} else {
				HTMLOUT.stopDeleteModeJs();
			}
			return;
		}
		target = target.parentNode;
	}
}

/**
 *		===
 *		END
 *		===
 */

function kek(postId, logined) {
	window.onload = function() {
		var anchors = document.querySelectorAll('.karma');
		var data = JSON.parse(getCommentsData())[postId];
		for (var i = 0; i < anchors.length; i++) {
			var found = anchors[i].getAttribute("data-karma").match(/([\d]*)-([\d]*)/);
			anchors[i].innerHTML = '<b class="icon-karma-up" title="Мне нравится" data-karma-act="1-264127-2745153"></b><span class="num-wrap"><span class="num" title="Понравилось"></span></span>';
			anchors[i].querySelector(".num-wrap .num").innerHTML = data[found[2]][3];
			if (logined) {
				anchors[i].onclick = function() {
					found = this.getAttribute("data-karma").match(/([\d]*)-([\d]*)/);
					this.querySelector(".num-wrap .num").innerHTML = data[found[2]][3] + 1;
					HTMLOUT.likeComment(found[1], found[2]);
				};
			}
		}
	};
}

function getIds() {
	var p = document.documentElement ? document.documentElement : document.body;
	var c = p.getElementsByTagName('input');
	var result = [];
	for (i = 0; i < c.length; ++i) {
		if ('checkbox' == c[i].type) {
			if (c[i].checked) {
				result.push(c[i].getAttribute('value'));
			}
		}
	}
	HTMLOUT.showCuratorDialog(result.join());
}

function invertCheckboxes() {
	var p = document.documentElement ? document.documentElement : document.body;
	var c = p.getElementsByTagName('input');
	for (i = 0; i < c.length; ++i)
		if ('checkbox' == c[i].type) c[i].checked = !c[i].checked;
}

//Уникальная переменная
var checkedCheckboxInCheckboxesPostCurator = false;

function setCheckedAll() {
	var p = document.documentElement ? document.documentElement : document.body;
	var c = p.getElementsByTagName('input');
	for (i = 0; i < c.length; ++i) {
		if ('checkbox' == c[i].type) {
			if (checkedCheckboxInCheckboxesPostCurator)
				c[i].checked = true;
			else
				c[i].checked = false;
		}
	}
	checkedCheckboxInCheckboxesPostCurator = !checkedCheckboxInCheckboxesPostCurator;
}

function copySelection() {
	var selObj = window.getSelection();
	var selectedText = selObj.toString();
	if (selectedText != null && selectedText != '')
		alert(selectedText);
}

function deleteMessages(formId) {
	try {
		//var f=elem(formId);
		var checkboxes = document.body.getElementsByTagName('input');

		var checkboxesChecked = [];
		// loop over them all
		for (var i = 0; i < checkboxes.length; i++) {
			// And stick the checked ones onto an array...
			if (checkboxes[i].checked) {
				checkboxesChecked.push(checkboxes[i].name);
			}
		}

		// Return the array if it is non-empty, or null
		window.HTMLOUT.deleteMessages(checkboxesChecked.length > 0 ? checkboxesChecked : null);
	} catch (err) {
		window.HTMLOUT.showMessage(err.toString());
	}
}

function toggleSpoilerVisibility(e) {
	var t = e.parentNode.parentNode.getElementsByTagName("div")[1];
	"none" == t.style.display ? (t.style.display = "", e.parentNode.setAttribute("class", "hidetop open")) : (t.style.display = "none", e.parentNode.setAttribute("class", "hidetop close"))
};

function openHat(e) {
	var t = e.parentNode.getElementsByTagName("div")[1];
	"none" == t.style.display ? (t.style.display = "", e.setAttribute("class", "hidetop open")) : (t.style.display = "none", e.setAttribute("class", "hidetop close"))
};

function changeStyle(cssFile) {
	var newlink = document.createElement("link");
	newlink.setAttribute("rel", "stylesheet");
	newlink.setAttribute("type", "text/css");
	newlink.setAttribute("href", cssFile);
	document.getElementsByTagName("head").item(0).replaceChild(newlink, document.getElementsByTagName("link").item(0));
}

function scrollToElement(id) {

	var el = document.getElementById(id);
	var x = 0;
	var y = 0;
	while (el != null) {
		x += el.offsetLeft;
		y += el.offsetTop;
		el = el.parent;
	}
	window.scrollTo(0, y);
	/**
	 *				=====================
	 *				HIGHLIGHT ACTIVE POST
	 *				=====================
	 */
	document.querySelector('DIV[name="' + id + '"] + .post_container').classList.add('active');
};

function areaPlus() {
	var textarea_obj = elem("Post");
	textarea_obj.rows += 2;
}

function areaMinus() {
	var textarea_obj = elem("Post");
	if (textarea_obj.rows <= 8) return;
	textarea_obj.rows -= 2;
}

function getSctollPosition(id) {
	var elem = document.getElementById(id);
	var x = 0;
	var y = 0;

	while (elem != null) {
		x += elem.offsetLeft;
		y += elem.offsetTop;
		elem = elem.parent;
	}
	window.HTMLOUT.getSctollPosition(y);
}

function getPostBody() {
	var textarea_obj = elem("Post");

	window.HTMLOUT.setPostBody(textarea_obj.value);

};

function clearPostBody() {
	var textarea_obj = elem("Post");

	textarea_obj.value = null;

};

function preparePost() {
	var textarea_obj = elem("Post");

	window.HTMLOUT.post(textarea_obj.value);

};

function advPost() {
	var textarea_obj = elem("Post");

	window.HTMLOUT.advPost(textarea_obj.value);

};

function insertText(text) {
	try {
		window.HTMLOUT.insertTextToPost(text);
	} catch (err) {

	}

	//	var textarea_obj = elem ( "Post" );
	//	textarea_obj.value+=text;
	//	return false;
}

function getDivInnerText(msgId) {
	var textarea_obj = elem(msgId);
	return textarea_obj.innerText;

}

function postQuote(postId, date, userNick) {
	var textarea_obj = elem("msg" + postId);
	var text = textarea_obj.innerText;
	return insertText("[quote name='" + userNick + "' date='" + date + "' post='" + postId + "']\n" + text + "\n[/quote]");
}


function elem(id) {
	if (isdef(typeof(document.getElementById))) return document.getElementById(id);
	else if (isdef(typeof(document.all))) return document.all[id];
	else if (isdef(typeof(document.layers))) return document[id];
	else return null;
}


function elemByName(name) {
	if (isdef(typeof(document.getElementsByName))) return document.getElementsByName(name)[0];
	else if (isdef(typeof(document.all))) return document.all[name];
	else if (isdef(typeof(document.layers))) return document[name];
	else return null;
}

function isdef(typestr) {
	return ((typestr != "undefined") && (typestr != "unknown")) ? true : false;
}
