var width;
var height;
var cube;
var rotation = mat4();
var dx = 0;
var dy = 0;
var overallX = 1;
var overallY = 1;
var zoomAmount = 5;

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var near = 1;
	var far = 20;

	if ((Math.abs(dx) > 0 || Math.abs(dy) > 0) && cube.R !== rotation)
	{
		//console.log("in if statement");
		//cube.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, dy, dx-dy));
		rotation = cube.R;
		cube.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, dx+dy));
		// cube.R = rotate(Math.sqrt(overallX*overallX + overallY*overallY), vec3(-dx, -dy, dx+dy));
	}
	
	

	// if (cube.hasOwnProperty("R"))
	// {
	// 	//console.log(cube.R);
	// 	cube.R = add(rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, dx+dy)), cube.R);
	// }
	// else
	// {
	// 	console.log("In else");
	// 	//console.log(cube.R);
	// 	cube.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, -dx+dy));
	// }

	cube.perspProj = perspective(90, width / height, near, far); // 4 number arguments: fovy, aspect, near, far

	// moving the eye forward or back to zoom in or out
	let eyeVec = vec3(0, 0, zoomAmount);
	let atVec = vec3(0, 0, -1);
	let upVec = vec3(1, 1, 1);
	cube.viewTrans = lookAt(eyeVec, atVec, upVec); // 3 vec3 arguments: eye, at, up

	cube.render();
	requestAnimationFrame(render);
}

function init() {
	var canvas = document.getElementById("webgl-canvas");
	gl = canvas.getContext("webgl2");
	width = canvas.clientWidth;
	height = canvas.clientHeight;
	gl.clearColor(.25, .5, .75, 1);
	cube = new Cube(gl);
	//cube.R = mat4(1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
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

