//Coded by John-Henry Lim
//BEST BG EVAR!!!! VERSION 2
//default settings
var colours = ['#ffffff','#0c7c5f','#000000','#fab20b','#e62840','#8862b8','#fddb0d','#deddde','#ffffff','#0c7c5f','#000000']; //colours to vary between
var bg_colour = '#fab20b'; //background behind triangles
var min_speed = 20; //min speed of transition animation in seconds
var max_speed = 50; //max speed of transition animation in seconds
var gap_length = 0.1; //size of gaps between triangles as ratio
var number_row = 10; //number of unique triangles along y-axis (preferably even numbered)
var number_col = 4; //number of unique triangles touching base along x-axis (actually two times)
var randomness = 0.75;//smart random seriousness
//generates svg in one function
function gen_bg(cols=colours,bgcol=bg_colour,minspd=min_speed,maxspd=max_speed,glen=gap_length,nrow=number_row,ncol=number_col,rand=randomness){
	//added 2D aware smart randomness to it (based on top and left, so i dont have to be all 4 directions)
	function smart_shuffle(up,prev){
		var frndarr = cols.slice();
		var shuffled = [];
		
		//assuming its in list, highly likely considering context of usage
		if (Math.random() < rand && up != undefined) frndarr.splice(frndarr.indexOf(up),1); 
		if (Math.random() < rand && prev != undefined) frndarr.splice(frndarr.indexOf(prev),1);
		
		shuffled.push(frndarr[Math.floor(Math.random() * frndarr.length)]);
		var nrndarr = cols.slice();
		nrndarr.splice(nrndarr.indexOf(shuffled[0]),1);
		
		for (var i = nrndarr.length - 1; i>0; i--){
			var j = Math.floor(Math.random() * (i + 1));
			[nrndarr[i], nrndarr[j]] = [nrndarr[j], nrndarr[i]];
		}
		
		return shuffled.concat(nrndarr);
	}
	
	//generating triangle information
	function gen_tri(up, prev){
		var tri = {};
		var r_seq = smart_shuffle(up,prev);
		r_seq.push(r_seq.slice(0,1)[0]);
		tri['color_seq'] = r_seq;
		tri['speed'] =  Math.floor(Math.random() * (maxspd - minspd + 1)) + minspd;
		return tri;
	}
	
	//math calculations
	var tlen = 0.5;
	var thgt = ((tlen/2)*1.73205080756888); //1.73205... is tan60 btw !DO NOT MODIFY THIS STATEMENT
	var width = Math.floor(tlen*ncol);
	var height = Math.floor(thgt*nrow);
	var glen = glen*tlen/2;
	
	//creating svg container
	var bg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	bg.setAttribute('width','100%')
	bg.setAttribute('height','100%')
	bg.setAttribute('viewBox',('0 0 ' + width.toString() + ' ' + height.toString()));
	bg.setAttribute('xmlns','http://www.w3.org/2000/svg');
	bg.setAttribute('shape-rendering','geometricPrecision');
	var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	bg.appendChild(g);
	
	//generation
	var upright = false;
	var prevarr = [];
	var curarr = [];
	var prevc = undefined;
	rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute('x','0');
	rect.setAttribute('y','0');
	rect.setAttribute('width','100%');
	rect.setAttribute('height','100%');
	rect.setAttribute('fill',bgcol);
	g.appendChild(rect);
	for (var y = 0; y < nrow; y++){
		//for first triangle	
		if (y%2==1){
			upright = false;
			var tri = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
		
			var tri_p = gen_tri(prevarr[0],prevc);
			prevc = tri_p['color_seq'][0];
			curarr.push(tri_p['color_seq'][0]);
			tri.setAttribute('fill',tri_p['color_seq'][0]);
			tri2.setAttribute('fill',tri_p['color_seq'][0]);
			
			var p1x = (0).toString();
			var p1y = (y*thgt+glen/2).toString();
			var p2x = (0).toString();
			var p2y = ((y+1)*thgt-glen/2).toString();
			var p3x = (tlen/2-glen).toString();
			var p3y = ((y+1)*thgt-glen/2).toString();
			tri.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri.setAttribute('shape-rendering','geometricPrecision');
			
			var p1x = (width).toString();
			var p1y = (y*thgt+glen/2).toString();
			var p2x = (width).toString();
			var p2y = ((y+1)*thgt-glen/2).toString();
			var p3x = (width-(tlen/2)+glen).toString();
			var p3y = ((y+1)*thgt-glen/2).toString();
			tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri2.setAttribute('shape-rendering','geometricPrecision');
			
			var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
			ani.setAttribute('attributeName','fill');
			ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
			ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
			ani.setAttribute('repeatCount', "indefinite");
			
			tri.appendChild(ani.cloneNode(true));
			tri2.appendChild(ani.cloneNode(true));

			g.appendChild(tri);
			g.appendChild(tri2);
			
		}else{
			upright = true;
			var tri = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
			var tri2 = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
		
			var tri_p = gen_tri(undefined,prevc);
			prevc = tri_p['color_seq'][0];
			curarr.push(tri_p['color_seq'][0]);
			tri.setAttribute('fill',tri_p['color_seq'][0]);
			tri2.setAttribute('fill',tri_p['color_seq'][0]);
			
			var p1x = (0).toString();
			var p1y = (y*thgt+glen/2).toString();
			var p2x = (0).toString();
			var p2y = ((y+1)*thgt-glen/2).toString();
			var p3x = (tlen/2-glen).toString();
			var p3y = (y*thgt+glen/2).toString();
			tri.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri.setAttribute('shape-rendering','geometricPrecision');
			
			var p1x = (width).toString();
			var p1y = (y*thgt+glen/2).toString();
			var p2x = (width).toString();
			var p2y = ((y+1)*thgt-glen/2).toString();
			var p3x = (width-(tlen/2)+glen).toString();
			var p3y = (y*thgt+glen/2).toString();
			tri2.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
			tri2.setAttribute('shape-rendering','geometricPrecision');
			
			var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
			ani.setAttribute('attributeName','fill');
			ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
			ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
			ani.setAttribute('repeatCount', "indefinite");
			
			tri.appendChild(ani.cloneNode(true));
			tri2.appendChild(ani.cloneNode(true));
			
			g.appendChild(tri);
			g.appendChild(tri2);
		}
		
		//for rest of triangles in row
		for (var x = 1; x < ncol*2; x++){ //start from 2nd tri cause 1st tri "wraps" around
			if (!upright){
				var tri = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
				
				var tri_p = gen_tri(prevarr[x], prevc);
				curarr.push(tri_p['color_seq'][0]);
				prevc = tri_p['color_seq'][0];
				tri.setAttribute('fill',tri_p['color_seq'][0]);
				
				var p1x = ((x-1)*(tlen/2)+glen).toString();
				var p1y = (y*thgt+glen/2).toString();
				var p2x = ((x+1)*(tlen/2)-glen).toString();
				var p2y = (y*thgt+glen/2).toString();
				var p3x = (x*(tlen/2)).toString();
				var p3y = ((y+1)*thgt-glen/2).toString();
				tri.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
				tri.setAttribute('shape-rendering','geometricPrecision');
				
				var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
				ani.setAttribute('attributeName','fill');
				ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
				ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
				ani.setAttribute('repeatCount', "indefinite");
				tri.appendChild(ani.cloneNode(true));
				g.appendChild(tri);					
			}
			if (upright){
				var tri = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
				
				var tri_p = gen_tri(undefined, prevc);
				curarr.push(tri_p['color_seq'][0]);
				prevc = tri_p['color_seq'][0];
				tri.setAttribute('fill',tri_p['color_seq'][0]);
				
				var p1x = ((x-1)*(tlen/2)+glen).toString();
				var p1y = ((y+1)*thgt-glen/2).toString();
				var p2x = ((x+1)*(tlen/2)-glen).toString();
				var p2y = ((y+1)*thgt-glen/2).toString();
				var p3x = (x*(tlen/2)).toString();
				var p3y = ((y)*thgt+glen/2).toString();
				tri.setAttribute('points',(p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y));
				tri.setAttribute('shape-rendering','geometricPrecision');
				
				var ani = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
				ani.setAttribute('attributeName','fill');
				ani.setAttribute('values',(tri_p['color_seq'].join(';')+";"));
				ani.setAttribute('dur', (tri_p['speed'].toString()+"s"));
				ani.setAttribute('repeatCount', "indefinite");
				
				tri.appendChild(ani.cloneNode(true));
				
				g.appendChild(tri);
				
			}
			upright = !upright;
		}
		var prevc = undefined;
		var prevarr = curarr;
		var curarr = [];
	}
	return bg.outerHTML;
}

document.addEventListener("DOMContentLoaded", function(e) {
	//console.log(bg.outerHTML);
	var svg_code = ("url(data:image/svg+xml;utf8," + encodeURIComponent(gen_bg()) + ")");
	document.body.style.backgroundImage = svg_code;
	get("removepls").href = "data:image/svg+xml;utf8,"+encodeURI(gen_bg());
	//document.getElementById("bg").innerHTML = bg.outerHTML;
});