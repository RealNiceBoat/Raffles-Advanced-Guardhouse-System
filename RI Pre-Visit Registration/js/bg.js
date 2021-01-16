//Coded by John-Henry Lim
//BEST BG EVAR!!!! (generates background filled with colour changing equilateral triangles)

//additional functions
//added 2D aware smart randomness to it (based on top and left, so i dont have to be all 4 directions)
function smart_shuffle(rndarr,up,prev,smart_threshold=0.75){
    var frndarr = rndarr.slice();
	var shuffled = [];
	
	//assuming its in list, highly likely considering context of usage
	if (Math.random() < smart_threshold && up != undefined){
		//console.log(up);
		//console.log(frndarr.indexOf(up));
		frndarr.splice(frndarr.indexOf(up),1); 
	}
	if (Math.random() < smart_threshold && prev != undefined){
		//console.log(prev);
		//console.log(frndarr.indexOf(prev));
		frndarr.splice(frndarr.indexOf(prev),1);
	}
	//console.log(frndarr);
	
	shuffled.push(frndarr[Math.floor(Math.random() * frndarr.length)]);
	var nrndarr = rndarr.slice();
	nrndarr.splice(nrndarr.indexOf(shuffled[0]),1);
	
	for (var i = nrndarr.length - 1; i>0; i--){
		var j = Math.floor(Math.random() * (i + 1));
		[nrndarr[i], nrndarr[j]] = [nrndarr[j], nrndarr[i]];
	}
	
	return shuffled.concat(nrndarr);
}

//gets a hex for a random colour between two colours (i coded this one)
//if this was python i would have used matrix multiplication
//now unused
function random_start(hex1,hex2){
	hex1 = hex1.substring(1);
	
	var hex1r = parseInt(hex1.substring(0,2),16);
	var hex1g = parseInt(hex1.substring(2,4),16);
	var hex1b = parseInt(hex1.substring(4),16);
	
	hex2 = hex2.substring(1);
	
	var hex2r = parseInt(hex2.substring(0,2),16);
	var hex2g = parseInt(hex2.substring(2,4),16);
	var hex2b = parseInt(hex2.substring(4),16);
	
	var r_diff = hex1r - hex2r;
	var g_diff = hex1g - hex2g;
	var b_diff = hex1b - hex2b;
	
	var extent = Math.random();
	
	var r_chng = Math.round(r_diff * extent);
	var g_chng = Math.round(g_diff * extent);
	var b_chng = Math.round(b_diff * extent);
	
	var hex3r = hex1r - r_chng;
	var hex3g = hex1g - g_chng;
	var hex3b = hex1b - b_chng;
	
	var nr = hex3r.toString(16);
	var ng = hex3g.toString(16);
	var nb = hex3b.toString(16);
	
	var r = (nr.length == 1 ? "0" + nr : nr);
	var g = (ng.length == 1 ? "0" + ng : ng);
	var b = (nb.length == 1 ? "0" + nb : nb);
	
	return '#' + r + g + b;
}

//mine too
function gen_tri(up, prev){
	var tri = {};
	var r_seq = smart_shuffle(colours.slice(0),up,prev);
	r_seq.push(r_seq.slice(0,1)[0]);
	tri['color_seq'] = r_seq;
	tri['speed'] =  Math.floor(Math.random() * (max_speed - min_speed + 1)) + min_speed;
	return tri;
}

//settings lol
var colours = ['#ffffff','#0c7c5f','#000000','#fab20b','#e62840','#8862b8','#fddb0d','#deddde','#ffffff','#0c7c5f','#000000']; //colours to vary between
var min_speed = 20; //min speed of transition animation in seconds
var max_speed = 50; //max speed of transition animation in seconds
var tri_length = 200; //base of triangle length (use something even numbered)
var nrow = 8; //number of unique triangles along y-axis (preferably even numbered)
var ncol = 4; //number of unique triangles touching base along x-axis (actually two times)
/*
var nrow = 34;
var ncol = 35;
var min_speed = 1;
var max_speed = 120;
*/
var offset_fill = tri_length/450 //related to filling in white lines from imprecise measurements
var pic_height = '50%';
var pic_length = '50%';

var tri_height = ((tri_length/2)*1.73205080756888); //1.73205... is tan60 btw !DO NOT MODIFY THIS STATEMENT

//creating SVG
var bg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

//Setting properties
var width = Math.floor(tri_length*ncol);
var height = Math.floor(tri_height*nrow);

bg.setAttribute('width',pic_length)
bg.setAttribute('height',pic_height)
bg.setAttribute('viewBox',('0 0 ' + width.toString() + ' ' + height.toString()));
bg.setAttribute('preserveAspectRatio','meet');
bg.setAttribute('xmlns','http://www.w3.org/2000/svg');
bg.setAttribute('shape-rendering','geometricPrecision');

//creating SVG actual draw area
var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
bg.appendChild(g);

//Seeding (i think thats the wrong word but i mean generating random properties) and rendering
var upright = false;
var prevarr = [];
var curarr = [];
var prevc = undefined;
for (var y = 0; y < nrow; y++){
	
	//for first triangle	
	if (y%2==1){
		upright = false;
		var tri1 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
		var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
	
		var tri_p = gen_tri(prevarr[0],prevc);
		prevc = tri_p['color_seq'][0];
		curarr.push(tri_p['color_seq'][0]);
		tri1.setAttribute('fill',tri_p['color_seq'][0]);
		tri2.setAttribute('fill',tri_p['color_seq'][0]);
		
		var p1x = (0-offset_fill).toString();
		var p1y = (y*tri_height-offset_fill).toString();
		var p2x = (0-offset_fill).toString();
		var p2y = ((y+1)*tri_height+offset_fill).toString();
		var p3x = (tri_length/2+offset_fill).toString();
		var p3y = ((y+1)*tri_height+offset_fill).toString();
		tri1.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
		tri1.setAttribute('shape-rendering','geometricPrecision');
		
		var p1x = (width+offset_fill).toString();
		var p1y = (y*tri_height-offset_fill).toString();
		var p2x = (width+offset_fill).toString();
		var p2y = ((y+1)*tri_height+offset_fill).toString();
		var p3x = (width-(tri_length/2)-offset_fill).toString();
		var p3y = ((y+1)*tri_height+offset_fill).toString();
		tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
		tri2.setAttribute('shape-rendering','geometricPrecision');
		
		var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
		ani.setAttribute('attributeName','fill');
		ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
		ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
		ani.setAttribute('repeatCount', "indefinite");
		
		tri1.appendChild(ani.cloneNode(true));
		tri2.appendChild(ani.cloneNode(true));
				
		g.appendChild(tri1);
		g.appendChild(tri2);
		
	}else{
		upright = true;
		var tri1 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
		var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
	
		var tri_p = gen_tri(undefined,prevc);
		prevc = tri_p['color_seq'][0];
		curarr.push(tri_p['color_seq'][0]);
		tri1.setAttribute('fill',tri_p['color_seq'][0]);
		tri2.setAttribute('fill',tri_p['color_seq'][0]);
		
		var p1x = (0-offset_fill).toString();
		var p1y = (y*tri_height-offset_fill).toString();
		var p2x = (0-offset_fill).toString();
		var p2y = ((y+1)*tri_height+offset_fill).toString();
		var p3x = (tri_length/2+offset_fill).toString();
		var p3y = (y*tri_height-offset_fill).toString();
		tri1.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
		tri1.setAttribute('shape-rendering','geometricPrecision');
		
		var p1x = (width+offset_fill).toString();
		var p1y = (y*tri_height-offset_fill).toString();
		var p2x = (width+offset_fill).toString();
		var p2y = ((y+1)*tri_height+offset_fill).toString();
		var p3x = (width-(tri_length/2)-offset_fill).toString();
		var p3y = (y*tri_height-offset_fill).toString();
		tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
		tri2.setAttribute('shape-rendering','geometricPrecision');
		
		var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
		ani.setAttribute('attributeName','fill');
		ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
		ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
		ani.setAttribute('repeatCount', "indefinite");
		
		tri1.appendChild(ani.cloneNode(true));
		tri2.appendChild(ani.cloneNode(true));
		
		g.appendChild(tri1);
		g.appendChild(tri2);
	}
	
	//for rest of triangles in row
	for (var x = 1; x < ncol*2; x++){ //start from 2nd tri cause 1st tri special
		if (!upright){
			var tri1 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			
			var tri_p = gen_tri(prevarr[x], prevc);
			curarr.push(tri_p['color_seq'][0]);
			prevc = tri_p['color_seq'][0];
			tri1.setAttribute('fill',tri_p['color_seq'][0]);
			tri2.setAttribute('fill',tri_p['color_seq'][0]);
			
			var p1x = ((x-1)*(tri_length/2)-offset_fill).toString();
			var p1y = (y*tri_height-offset_fill).toString();
			var p2x = (x*(tri_length/2)+offset_fill).toString();
			var p2y = (y*tri_height-offset_fill).toString();
			var p3x = (x*(tri_length/2)+offset_fill).toString();
			var p3y = ((y+1)*tri_height+offset_fill).toString();
			tri1.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri1.setAttribute('shape-rendering','geometricPrecision');
			
			var p1x = ((x+1)*(tri_length/2)+offset_fill).toString();
			var p1y = (y*tri_height-offset_fill).toString();
			var p2x = (x*(tri_length/2)-offset_fill).toString();
			var p2y = (y*tri_height-offset_fill).toString();
			var p3x = (x*(tri_length/2)-offset_fill).toString();
			var p3y = ((y+1)*tri_height+offset_fill).toString();
			tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri2.setAttribute('shape-rendering','geometricPrecision');
			
			var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
			ani.setAttribute('attributeName','fill');
			ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
			ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
			ani.setAttribute('repeatCount', "indefinite");
			
			tri1.appendChild(ani.cloneNode(true));
			tri2.appendChild(ani.cloneNode(true));
					
			g.appendChild(tri1);
			g.appendChild(tri2);
			
		}
		if (upright){
			var tri1 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			
			var tri_p = gen_tri(undefined, prevc);
			curarr.push(tri_p['color_seq'][0]);
			prevc = tri_p['color_seq'][0];
			tri1.setAttribute('fill',tri_p['color_seq'][0]);
			tri2.setAttribute('fill',tri_p['color_seq'][0]);
			
			var p1x = ((x-1)*(tri_length/2)-offset_fill).toString();
			var p1y = ((y+1)*tri_height+offset_fill).toString();
			var p2x = (x*(tri_length/2)+offset_fill).toString();
			var p2y = (y*tri_height-offset_fill).toString();
			var p3x = (x*(tri_length/2)+offset_fill).toString();
			var p3y = ((y+1)*tri_height+offset_fill).toString();
			tri1.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri1.setAttribute('shape-rendering','geometricPrecision');
			
			var p1x = ((x+1)*(tri_length/2)+offset_fill).toString();
			var p1y = ((y+1)*tri_height+offset_fill).toString();
			var p2x = (x*(tri_length/2)-offset_fill).toString();
			var p2y = (y*tri_height-offset_fill).toString();
			var p3x = (x*(tri_length/2)-offset_fill).toString();
			var p3y = ((y+1)*tri_height+offset_fill).toString();
			tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri2.setAttribute('shape-rendering','geometricPrecision');
			
			var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
			ani.setAttribute('attributeName','fill');
			ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
			ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
			ani.setAttribute('repeatCount', "indefinite");
			
			tri1.appendChild(ani.cloneNode(true));
			tri2.appendChild(ani.cloneNode(true));
			
			g.appendChild(tri1);
			g.appendChild(tri2);
			
		}
		upright = !upright;
	}
	var prevc = undefined;
	var prevarr = curarr;
	var curarr = [];
}


//handler
document.addEventListener("DOMContentLoaded", function(e) {
	//console.log(bg.outerHTML);
	var svg_code = ("url(data:image/svg+xml;utf8," + encodeURI(bg.outerHTML) + ")");
	document.body.style.backgroundImage = svg_code;
	//get("removepls").href = "data:image/svg+xml;utf8,"+encodeURI(bg.outerHTML);
	//document.getElementById("bg").innerHTML = bg.outerHTML;
});