var width;
var height;
var cube;
var rotation;
var dx = 0;
var dy = 0;

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var near = 1;
	var far = 15;

	// random amounts for each axis that I thought looked interesting
	cube.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, -dx+dy));
	// Translate to origin
	//cube.T = translate(-0.5, -0.5, -0.5);

	cube.perspProj = perspective(90, width / height, near, far); // 4 number arguments: fovy, aspect, near, far

	// moving the eye just for fun to make the cube do more interesting dancing
	let eyeVec = vec3(1, 1, 2);
	let atVec = vec3(-1, 0, -1);
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
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	var startX;
	var startY;
	function mousemove(event) {
		var x = event.clientX;
		var y = event.clientY;
		dx = x - startX;
		dy = y - startY;
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
	render();
}
window.onload = init;

