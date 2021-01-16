//Coded by John-Henry Lim
//Functionality for RI Visit Registration Page

//convenience short hand
function get(id){
	return document.getElementById(id);
}

//convenient error box marking
function mark(e){
	e.style.backgroundColor = "red";
	e.style.color = "white";
	e.className += " invalid";
}

//convenient error box unmarking
function unmark(e){
	e.style.backgroundColor = "white";
	e.style.color = "black";
	e.className += " valid";
}

//Make visible additional reason text field depending on the selection
function is_secondary_reason(){
	//get elements
	var selector = get("reason");
	var otherbox = get("other");
	
	//list of values and the relevant placeholder
	var secondaries = {
		"Other":"Reason",
		"Meeting":"Name of Staff",
		"Event":"Name of Event"
	};
	
	//actual check
	var selected = selector.options[selector.selectedIndex].value;
	if(selected in secondaries){
		otherbox.style.display = "inline";
		otherbox.value = "";
		otherbox.placeholder = secondaries[selected];
		backing_change(new_page,true);
	}else{
		otherbox.style.display = "none";
		otherbox.value = "none";
		otherbox.placeholder = "";
	}
	
	//special workaround for later parts (checking and sending)
	selector.value = selector.options[selector.selectedIndex].value;
}

//checks if all necessary fields are filled in correctly
function isValid(){
	//things to check, add on to here for new things in the form
	var checkboxlist = ['req1','req2'];
	var checklist = {
		'nric':/^[STFG]\d{7}[A-Z]$/i,
		'telno':/(6|8|9)\d{7}/i,
		'email':/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		'other':/\S+/i,
		'reason':/\S+/i,
		'name':/\S+/i
	};
	var invalids=[];

	//actual checks
	for (var id in checklist){
		var e = get(id);
		var re = checklist[id];
		if(re.test(e.value)){
			unmark(e);
		}else{
			mark(e);
			invalids.push(id);
			is_valid = false;
		}
	}
	//unsafe to use for in loops for arrays in general
	for (var i = 0; i < checkboxlist.length; i++){
		var e = get(checkboxlist[i]);
		if (!e.checked){
			invalids.push('checkbox');
			is_valid = false;
			break;
		}
	}
	return invalids;
}

//prepares data for qr-generation
function gen_qr(){
	//list of things to put in QR code
	var send_list = ['reason','nric','telno','email','other','name'];
	
	//Dictionary to hold stuff
	var pairs = {};
	//adding to that dictionary above
	for (var i = 0; i < send_list.length; i++){
		var e = get(send_list[i]);
		pairs[e.name] = e.value;
	}
	
	//turning dictionary into JSON
	enc = JSON.stringify(pairs);
	
	//Changing page
	document.title = "Screenshot This!";
	
	//Preparing QR code library
	var typeNumber = 0;
	var errorCorrectionLevel = 'L';
	var qr = qrcode(typeNumber, errorCorrectionLevel);
	
	//Adding data and making QR code
	qr.addData(enc);
	qr.make();
	
	//Modifying provided QR code image
	var add_on = 'id="qr" class="img-fluid mb-5" style="image-rendering:crisp-edges;image-rendering:pixelated;border-style:solid;border-width:thick;border-color:#003333;"/>';
	var elm_str = (qr.createImgTag(10,5).slice(0,-2)).concat(add_on);
	
	//Adding QR code to page 2 and making it visible
	get('qrcontainer').innerHTML = elm_str;
	get('qrdwn').href = get('qr').src;
	toggle_icon();
	page_change('pg2');
}

//function that submit button calls
function submit_form(){
	var invalids = isValid();
	if(invalids.length==0){
		gen_qr();
	}else{
		alert(invalids.join(', ')+" is invalid!");
	}
}

//wrapper code for getting data from server while avoiding busy server issues (Credit: stackoverflow.com/questions/4401608)
var global_xHttpRequest = null;
function xmlHttpHandler(type, params, complete, postData){
	//cancels existing request if present
	if (global_xHttpRequest == null) {
		global_xHttpRequest = new XMLHttpRequest();
	} else {
		global_xHttpRequest.abort();
	}
	
	//gets current URL
	var baseURL = window.location.host;
	var svc = "http://" + baseURL + "/";
	var url = svc + params;
	
	//opens request and calls function when request is complete
	global_xHttpRequest.open(type, url, true);
	global_xHttpRequest.onreadystatechange = complete;
	global_xHttpRequest.send(postData);
}

//fades pages in and out
var active_pg = 'pg0';
function page_change(new_page){
	var old_pg = get(active_pg);
	old_pg.style.opacity = 0;
	setTimeout(function(){
		old_pg.style.display="none";
		var new_pg = get(new_page);
		new_pg.style.display = "block";
		backing_change(new_page,true);
		new_pg.style.opacity = 1;
		active_pg = new_page;
		window.scroll({top:0, left:0, behavior:'smooth'});		
		},500);
}
//resizes black backing
function backing_change(new_pg,isStatic){
	var prop = get(new_pg).getBoundingClientRect();
	var bg = get('bg');
	bg.setAttribute("data-move",isStatic);
	bg.style.left = prop.left+window.scrollX+"px";
	bg.style.top = prop.top+window.scrollY+"px";
	bg.style.right = prop.right+"px";
	bg.style.bottom = prop.bottom+"px";
	bg.style.x = prop.x+"px";
	bg.style.y = prop.y+"px";
	bg.style.width = prop.width+"px";
	bg.style.height = prop.height+"px";
}
//handlers
window.onresize = function(e){
	backing_change(active_pg,false);
};
window.onscroll = function(e){
	backing_change(active_pg,false);
};
//setInterval(function(){backing_change(active_pg,false);},100);

//Wanted to keep icon separate from dimback so i had to create separate method for it
function toggle_icon(){
	var icon = get("icon");
	if (icon.style.display=="none"){
		icon.style.display = 'block';
		setTimeout(function(){icon.style.opacity = 1;},300);
	}else{
		icon.style.opacity = 0;
		setTimeout(function(){icon.style.display = 'none';},333);
	}
}

//begins retrieving the terms and conditions page
function show_terms_page(){
	var raw = new XMLHttpRequest();
	xmlHttpHandler("GET", "terms.txt", show_terms_page_pt2);
}

//paranoia regarding escaping of characters
function escapeHtml(text) {
	'use strict';
	return text.replace(/[\"&'\/<>]/g, function (a) {
		return {
			'"': '&quot;', '&': '&amp;', "'": '&#39;',
			'/': '&#47;',  '<': '&lt;',  '>': '&gt;'
		}[a];
	});
}

//show the terms of conditions page 
function show_terms_page_pt2(){
	//placeholder message
	var terms = "Error Loading Terms and Conditions.";
	
	//aka if request is actually complete
	if(global_xHttpRequest.readyState===4&&global_xHttpRequest.status===200){
		terms = global_xHttpRequest.responseText;
		//more character escaping and newline replacing paranoia
		terms = terms.replace("\n\r", "\n");
		terms = terms.replace("\r\n", "\n");
		terms = terms.replace("/[\u2018\u2019]/g", "'");
		terms = terms.replace("/[\u201C\u201D]/g", '"');
		terms = terms.replace("\r", "\n");
		
		//get the container
		var page = get("terms");
		//split according to newline so CSS works properly
		var paragraphs = terms.split("\n");
		page.innerHTML = "";
		//unsafe to use for in loop for generated array
		for (var i=0;i<paragraphs.length;i++){
			var section = document.createElement("p");
			section.innerHTML = escapeHtml(paragraphs[i]);
			page.appendChild(section);
		}
	}
	
	//make t&c downloadable
	get("tcdwn").href = "data:text/plain,".concat(terms);
	
	//make page visible
	document.title = "Terms & Conditions";
	toggle_icon();
	page_change('pg3');
}

//return to form page from terms and conditions page
function return_to_main(){
	document.title = "RI Visit Registration";
	setTimeout(toggle_icon,333);
	page_change('pg1');
}