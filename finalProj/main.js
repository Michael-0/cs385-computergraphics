var width;
var height;
var knife;
var rotation = mat4();
var zoomAmount = 1;
var isLeftMouseDown = false;
var trackball;

// implementation of virtual trackball based on Dave's suggestion
// references:
// https://www.cs.unm.edu/~angel/CS433.S05/LECTURES/AngelCG15.pdf
// https://twodee.org/blog/17829
class Trackball {
	constructor() {
		this.mouseSphere0 = null;
		this.previousRotation = mat4(); // initialize to identity
		this.currentRotation = mat4(); // init to ident
		this.dimensions = vec2(0, 0);
	}

	setViewport(width, height) {
		this.dimensions.x = width;
		this.dimensions.y = height;
	}

	pixelsToSphere(mousePixels) {
		let mouseNdcX = mousePixels[0] / this.dimensions.x * 2 - 1;
		let mouseNdcY = mousePixels[1] / this.dimensions.y * 2 - 1;
		let zSquared = 1 - Math.pow(mouseNdcX, 2) - Math.pow(mouseNdcY, 2);
		if (zSquared > 0) {
			return vec3(mouseNdcX, -mouseNdcY, Math.pow(zSquared, 0.5));
		}
		else {
			return normalize(vec3(mouseNdcX, -mouseNdcY, 0));
		}
	}

	start(mousePixels) {
		this.mouseSphere0 = this.pixelsToSphere(mousePixels);
	}

	drag(mousePixels, multiplier) {
		let mouseSphere = this.pixelsToSphere(mousePixels);
		let dotProd = dot(mouseSphere, this.mouseSphere0);
		if (Math.abs(dotProd) < 0.9999) {
			let radians = Math.acos(dotProd) * multiplier;
			let axis = normalize(cross(this.mouseSphere0, mouseSphere));
			this.currentRotation = rotate(radians * 180 / Math.PI, axis);
			this.currentRotation && this.previousRotation? this.rotation = mult(this.currentRotation, this.previousRotation) : this.rotation = mat4();
			// this.rotation = mult(this.currentRotation, this.previousRotation);
		}
	}

	end() {
		this.previousRotation = this.rotation;
		this.mouseSphere0 = null;
	}

	cancel() {
		this.previousRotation? this.rotation = this.previousRotation : this.rotation = mat4();
		this.mouseSphere0 = null;
	}
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var near = 0.1;
	var far = 100;

	// used a check to make sure the rotation matrix was not undefined
	// caught an error when the object first loaded
	trackball.rotation === undefined ? knife.R = rotate(0, vec3(1, 1, 1)) : knife.R = trackball.rotation;

	knife.perspProj = perspective(90, width / height, near, far); // 4 number arguments: fovy, aspect, near, far

	// moving the eye forward or back to zoom in or out
	// let eyeVec = vec3(0, 0, zoomAmount);
	let eyeVec = vec3(0, 0, 5);
	let atVec = vec3(0, 0, -1);
	let upVec = vec3(1, 1, 1);
	knife.viewTrans = lookAt(eyeVec, atVec, upVec); // 3 vec3 arguments: eye, at, up

	// prevent negative scaling to prevent the model from mirroring
	if (zoomAmount < 0) {
		zoomAmount = 1;
	}
	else {
		knife.T = scalem(zoomAmount, zoomAmount, zoomAmount);
	}

	knife.render();
	requestAnimationFrame(render);
}

function initTexture(url) {
	texture = gl.createTexture();
	texImage = new Image();
	texImage.onload = function () {
		loadTexture(texImage, texture);
	};
	requestCORSIfNotSameOrigin(texImage, url);
	texImage.src = url;
	return texture;
}

function loadTexture(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
		gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D,
		gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,
		gl.TEXTURE_MIN_FILTER,
		gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

// code I found online that was supposed to fix the CORS error I
// was getting
function requestCORSIfNotSameOrigin(img, url) {
	if ((new URL(url, window.location.href)).origin !== window.location.origin) {
		img.crossOrigin = "";
	}
}

function init() {
	var canvas = document.getElementById("webgl-canvas");
	gl = canvas.getContext("webgl2");
	width = canvas.clientWidth;
	height = canvas.clientHeight;
	gl.clearColor(.25, .5, .75, 1);
	knife = new Knife(gl);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	// texture initializing
	knife.tex = initTexture("./folding-knife/source/model/textures/low_DefaultMaterial_BaseColor.png");

	// setting up mouse input events based on virtual trackball reference
	function onMouseDown(event) {
		if (event.button === 0) {
			isLeftMouseDown = true;
			const mousePixels = vec2(event.clientX, event.clientY);
			trackball.start(mousePixels);
		}
	}

	function onMouseDrag(event) {
		if (isLeftMouseDown) {
			const mousePixels = vec2(event.clientX, event.clientY);
			trackball.drag(mousePixels, 2);
		}
	}

	function onMouseUp(event) {
		if (isLeftMouseDown) {
			isLeftMouseDown = false;
			const mousePixels = vec2(event.clientX, event.clientY);
			trackball.end(mousePixels);
		}
	}

	trackball = new Trackball();
	trackball.setViewport(width, height);
	function zoom(event) {
		// dividing by a constant to control the amount of zoom per scroll
		// multiplying by zoomAmount to keep the zoom proportion feeling the same.
		// ie. the zoom doesn't zoom a lot far away and only a little close up
		zoomAmount += (-event.deltaY / 1000) * (zoomAmount);
	}
	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mousemove', onMouseDrag);
	window.addEventListener('mouseup', onMouseUp);
	canvas.addEventListener("wheel", zoom);
	render();
}
window.onload = init;

// I wanted to add a texture picker so you could easily see the
// different textures that came with the model
function materialPickerHandler() {
	var elements = document.getElementsByName("matPicker");

	var selectedTexture = "baseColor";
	for (let i = 0; i < elements.length; i++) {
		if (elements[i].checked) {
			selectedTexture = elements[i].value;
		}
	}
	knife.tex = initTexture("./folding-knife/source/model/textures/low_DefaultMaterial_" + selectedTexture + ".png");
}

