var width;
var height;
var knife;
var rotation = mat4();
var dx = 0;
var dy = 0;
var overallX = 1;
var overallY = 1;
var zoomAmount = 5;

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var near = 1;
	var far = 100;

	// if ((Math.abs(dx) > 0 || Math.abs(dy) > 0) && knife.R !== rotation)
	// {
	// 	//console.log("in if statement");
	// 	//knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, dy, dx-dy));
	// 	rotation = knife.R;
	// 	knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, (dx+dy)/2));
	// 	// knife.R = rotate(Math.sqrt(overallX*overallX + overallY*overallY), vec3(-dx, -dy, dx+dy));
	// }

	// https://www.cs.unm.edu/~angel/CS433.S05/LECTURES/AngelCG15.pdf
	// https://twodee.org/blog/17829
	if (Math.abs(dx) > 0 || Math.abs(dy) > 0)
	{
		//console.log("in if statement");
		//knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, dy, dx-dy));
		//rotation = knife.R;
		//knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, (dx+dy)/2));
		knife.R = rotate(Math.sqrt(overallX*overallX + overallY*overallY), vec3(1, 1, 1));
	}
	
	

	// if (knife.hasOwnProperty("R"))
	// {
	// 	//console.log(knife.R);
	// 	knife.R = add(rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, dx+dy)), knife.R);
	// }
	// else
	// {
	// 	console.log("In else");
	// 	//console.log(knife.R);
	// 	knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, -dx+dy));
	// }

	knife.perspProj = perspective(90, width / height, near, far); // 4 number arguments: fovy, aspect, near, far

	// moving the eye forward or back to zoom in or out
	let eyeVec = vec3(0, 0, zoomAmount);
	let atVec = vec3(0, 0, -1);
	let upVec = vec3(1, 1, 1);
	knife.viewTrans = lookAt(eyeVec, atVec, upVec); // 3 vec3 arguments: eye, at, up

	knife.render();
	requestAnimationFrame(render);
}

function init() {
	var canvas = document.getElementById("webgl-canvas");
	gl = canvas.getContext("webgl2");
	width = canvas.clientWidth;
	height = canvas.clientHeight;
	gl.clearColor(.25, .5, .75, 1);
	knife = new Knife(gl);
	//knife.R = mat4(1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	// texture initializing
	

	var startX = 0;
	var startY = 0;
	function zoom (event) {
		zoomAmount += event.deltaY/100;
	}
	function mousemove(event) {
		var x = event.clientX;
		var y = event.clientY;
		dx = x - startX;
		dy = y - startY;
		overallX += dx;
		overallY += dy;
		startX = x;
		startY = y;

		// rotation = Math.sqrt(dx*dx + dy*dy);
		console.log(dx, dy);
	}
	canvas.onmousedown = function (event) {
		startX = event.clientX;
		startY = event.clientY;
		canvas.addEventListener("mousemove", mousemove);
	};
	canvas.onmouseup = function (event) {
		canvas.removeEventListener("mousemove", mousemove);
		
	};
	canvas.addEventListener("wheel", zoom);
	render();
}
window.onload = init;

