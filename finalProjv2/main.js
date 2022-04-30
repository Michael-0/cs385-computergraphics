
var gl;
var year = 0;
var day = 0;

function init() {

    /* Googled values in miles

	Suns radius: 432,690
    Earth radius: 3,958
    Moon radius: 1,079

    Distance from earth to sun: 92,453,000
    Distance from earth to moon: 238,900

    D = 2(Oe + Om + rm)
    D = 2(92453000 + 238900 + 1079)
    D = 185385958
    */

    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Add your sphere creation and configuration code here
    Sun = new Sphere(gl);


	// commented out values are googled astronomically
	// accurate values that looked terrible on screen.

	Sun.color = vec4(1,1,0,1);

	near = 1;
	far = 4;

	// Based on google search for accuracy... Didn't look
	// good so I ended up playing with the numbers until I liked them

    // // fovy = 2 arcsin((D/2) / (near + D/2))
    // // fovy = 2 arcsin(92692979 / 92692980)
    // // fovy = 2 * 1.57064943
    // // fovy = 3.14129886
	//
    // dist = 185385958;
    // var near = 1;
	// var far = near + dist;
	//
    var aspect = canvas.clientWidth / canvas.clientHeight;
	// +1 to zoom in because of the modified radius and size values
    var perspProjection = perspective(90, aspect, near, far)
    Sun.P = perspProjection;

    requestAnimationFrame(render);
}

function render() {

    // Update your motion variables here
	// played with different values to find a speed
	// I liked
    year+=.2;
	day+=.5;

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    // Add your rendering sequence here
    ms = new MatrixStack();
	let eyeVec = vec3(0,0,1/3*far);
	let atVec = vec3(0,0,-1);
	let upVec = vec3(1,1,1);
	var V = lookAt(eyeVec, atVec, upVec);
    ms.load(V);

    ms.push();
	Sun.MV = ms.current();
    Sun.render();
    ms.pop();

    requestAnimationFrame(render);
}

window.onload = init;
