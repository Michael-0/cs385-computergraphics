
//"use strict";

var gl;
var time = 0;

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
    sun = new Sphere(100,100);
    earth = new Sphere(100,100);
    moon = new Sphere(100,100);

    sun.radius = 432690;
    sun.color = "yellow";

    earth.radius = 3958;
    earth.color = "blue";
    earth.orbit = 92453000;

    moon.radius = 1079;
    moon.color = "white";
    moon.orbit = 92691900; // distance from earth -> sun + earth -> moon

    // fovy = 2 arctan((D/2) / (near + D/2))
    // fovy = 2 arctan(92692979 / 92692980)
    // fovy = 2 * 0.785398
    // fovy = 1.570796226

    dist = 185385958;
    var near = 1;
	var far = near + dist;

    var aspect = canvas.clientWidth / canvas.clientHeight;
    var perspProjection = perspective(1.570796226, aspect, near, far)
    sun.P = perspProjection;
    earth.P = perspProjection;
    moon.P = perspProjection

    // let z = -1/2 * (near + far);
    // var view = vec4(0,0,z,1);
    let eyeVec = vec3(0,0,185385958);
	let atVec = vec3(0,0,-1);
	let upVec = vec3(1,1,1);
	let view = lookAt(eyeVec, atVec, upVec);

    sun.MV = view;
    earth.MV = view;
    moon.MV = view;


    requestAnimationFrame(render);
}

function render() {

    // Update your motion variables here
    time+=1;

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    // Add your rendering sequence here
    ms = new MatrixStack();
    var V = translate(0,0,-0.5*(near+far));
    ms.load(V);

    ms.push();
    ms.scale(sun.radius);
    sun.color = vec4(1,0,1,1);
    sun.draw();
    ms.pop();

    // let earthPos = translate(0,0,-earth.orbit);
    // let earthRot = rotate(time, vec3(1,0,0));
    // ms = mult(earthPos, earthRot);

    sun.MV = ms.current();

	sun.render();
    earth.render();
    moon.render();

    requestAnimationFrame(render);
}

window.onload = init;
