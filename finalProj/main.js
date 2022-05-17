var width;
var height;
var knife;
var rotation = mat4();
var dx = 0;
var dy = 0;
var overallX = 1;
var overallY = 1;
var zoomAmount = 5;
var isLeftMouseDown = false;
var trackball;

class Trackball {
	constructor() {
		this.mouseSphere0 = null;
		this.prevRotations = mat4(); // initialize to identity
		this.netRotation = mat4(); // init to ident
		this.dimensions = vec2(0, 0);
	}

	setViewport(width, height) {
		this.dimensions[0] = width;
		this.dimensions[1] = height;
	}

	pixelsToSphere(mousePixels) {
		let mouseNdc = mousePixels / this.dimensions * 2 - 1;
		let zSquared = 1 - mouseNdc.x ^ 2 - mouseNdc.y ^ 2;
		if (zSquared > 0) {
			return vec3(mouseNdc.x, mouseNdc.y, zSquared ^ 0.5);
		}
		else {
			return vec3(mouseNdc.x, mouseNdc.y, 0).normalize();
		}
	}

	start(mousePixels) {
		this.mouseSphere0 = this.pixelsToSphere(mousePixels);
	}

	drag(mousePixels, multiplier) {
		let mouseSphere = this.pixelsToSphere(mousePixels);
		dot = this.mouseSphere0.dot(mouseSphere);
		if (Math.abs(dot) < 0.9999) {
			radians = acos(dot) * multiplier;
			let axis = this.mouseSphere0.cross(mouseSphere).normalize();
			currentRotation = Matrix4.rotateAroundAxis(axis, radians * 180 / pi);
			this.rotation = currentRotation * this.previousRotation;
		}
	}

	end() {
		this.previousRotation = this.rotation;
		this.mouseSphere0 = null;
	}

	cancel() {
		this.rotation = this.previousRotation;
		this.mouseSphere0 = null;
	}
}

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
	//gl.setUniformMatrix4('modelToWorld', trackball.rotation);
	if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
		//console.log("in if statement");
		//knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, dy, dx-dy));
		//rotation = knife.R;
		//knife.R = rotate(Math.sqrt(dx*dx + dy*dy), vec3(-dx, -dy, (dx+dy)/2));
		knife.R = rotate(Math.sqrt(overallX * overallX + overallY * overallY), vec3(1, 1, 1));
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

	function onMouseDown(event) {
		if (event.button === 0) {
			isLeftMouseDown = true;
			const mousePixels = new vec2(event.clientX, canvas.height - event.clientY);
			trackball.start(mousePixels);
		}
	}

	function onMouseDrag(event) {
		if (isLeftMouseDown) {
			const mousePixels = new vec2(event.clientX, canvas.height - event.clientY);
			trackball.drag(mousePixels, 2);
			render();
		}
	}

	function onMouseUp(event) {
		if (isLeftMouseDown) {
			isLeftMouseDown = false;
			const mousePixels = new vec2(event.clientX, canvas.height - event.clientY);
			trackball.end(mousePixels);
		}
	}

	function onSizeChanged() {
		trackball.setViewport(canvas.width, canvas.height);
	}

	trackball = new Trackball();
	var startX = 0;
	var startY = 0;
	function zoom(event) {
		zoomAmount += event.deltaY / 100;
	}
	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mousemove', onMouseDrag);
	window.addEventListener('mouseup', onMouseUp);
	canvas.addEventListener("wheel", zoom);
	render();
}
window.onload = init;

