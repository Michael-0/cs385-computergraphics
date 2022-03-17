
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

    Sun.radius = 432.690;
    Sun.color = vec4(1,1,0,1);

    Earth.radius = 3.958;
    Earth.color = vec4(0,0,1,1);
    Earth.orbit = 92453.000;

    Moon.radius = 1.079;
    Moon.color = vec4(1,1,1,1);
    Moon.orbit = 238.900;

	near = 1;
	far = 185386.958;

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
    var perspProjection = perspective(3.14129886, aspect, near, far)
    Sun.P = perspProjection;
    Earth.P = perspProjection;
    Moon.P = perspProjection;


    requestAnimationFrame(render);
}

function render() {

    // Update your motion variables here
    year+=1;
	day+=2;
	//
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	//
    // // Add your rendering sequence here
    ms = new MatrixStack();
    var V = translate(0,0,-0.5*(near+far));
	// let eyeVec = vec3(0,0,1000000);
	// let atVec = vec3(0,0,-1);
	// let upVec = vec3(1,1,1);
	// var V = lookAt(eyeVec, atVec, upVec);
    ms.load(V);

    ms.push();
    ms.scale(Sun.radius);
	Sun.MV = ms.current();
    Sun.render();
    ms.pop();

	ms.push();
 	ms.rotate(year, vec3(1,0,0));
 	ms.translate(Earth.orbit, 0, 0);
	ms.push();
 	ms.rotate(day, vec3(1,0,0));
 	ms.scale(Earth.radius);
 	Earth.MV = ms.current();
 	Earth.render();
	ms.pop();
	ms.translate(Moon.orbit, 0, 0);
 	ms.scale(Moon.radius);
 	Moon.MV = ms.current();
 	Moon.render();
 	ms.pop();


    requestAnimationFrame(render);
}

window.onload = init;
