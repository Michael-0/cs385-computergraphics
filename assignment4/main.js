
var gl;
var year = 0;
var day = 0;

function init() {

    /*
    in miles
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
    Sun = new Sphere(100,100);
    Earth = new Sphere(100,100);
    Moon = new Sphere(100,100);
	Mars = new Sphere(100,100);

    Sun.radius = 432.690;
    Sun.color = vec4(1,1,0,1);

	Earth.radius = 100;
    //Earth.radius = 3.958;
    Earth.color = vec4(0,0,1,1);
    //Earth.orbit = 2453.000;
	Earth.orbit = 1200;

	Moon.radius = 50;
    //Moon.radius = 1.079;
    Moon.color = vec4(1,1,1,1);
    //Moon.orbit = 238.900;
	Moon.orbit = 400;

	Mars.radius = 100;
    //Earth.radius = 3.958;
    Mars.color = vec4(1,0,0,1);
    //Earth.orbit = 2453.000;
	Mars.orbit = 1400;

	near = 1;
	far = 135000;

	//
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
    var perspProjection = perspective(3.14129886+1, aspect, near, far)
    Sun.P = perspProjection;
    Earth.P = perspProjection;
    Moon.P = perspProjection;
	Mars.P = perspProjection;


    requestAnimationFrame(render);
}

function render() {

    // Update your motion variables here
    year+=.2;
	day+=.5;
	//
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	//
    // // Add your rendering sequence here
    ms = new MatrixStack();
	let eyeVec = vec3(0,0,-1/3*far);
	let atVec = vec3(0,0,-1);
	let upVec = vec3(1,1,1);
	var V = lookAt(eyeVec, atVec, upVec);
    ms.load(V);

    ms.push();
    ms.scale(Sun.radius);
	Sun.MV = ms.current();
    Sun.render();
    ms.pop();

	ms.push();
	ms.rotate(year, vec3(0,0,1));
	ms.translate(Mars.orbit, 0, 0);
	ms.push();
	ms.rotate(day, vec3(1,0,0));
	ms.scale(Mars.radius);
	Mars.MV = ms.current();
	Mars.render();
	ms.pop();
	ms.pop();

	ms.push();
 	ms.rotate(year, vec3(0,1,0));
 	ms.translate(Earth.orbit, 0, 0);
	ms.push();
 	ms.rotate(day, vec3(1,0,0));
 	ms.scale(Earth.radius);
 	Earth.MV = ms.current();
 	Earth.render();
	ms.pop();
	ms.rotate(day, vec3(1,0,0));
	ms.translate(0, Moon.orbit, 0);
 	ms.scale(Moon.radius);
 	Moon.MV = ms.current();
 	Moon.render();
 	ms.pop();


    requestAnimationFrame(render);
}

window.onload = init;
