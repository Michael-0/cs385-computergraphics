
function Cube( gl, vertexShaderId, fragmentShaderId ) {

	// Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cube-vertex-shader";
    var fragShdr = fragmentShaderId || "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return;
    }

	// Initialize arrays for the Cube's indices and vertex positions
	//
	var positions = [
		0,1,0, // vertex 0
		0,0,0, // vertex 1
		1,0,0, // vertex 2
		1,1,0, // vertex 3
		1,1,1, // vertex 4
		1,0,1, // vertex 5
		0,1,1, // vertex 6
		0,0,1  // vertex 7
	 ];

	var indices = [
		0,1,3, 2, // back face on x,y
		4, 5,	  // right face on y,z
		6, 7,	  // front face on x,y
		0, 1,	  // left face on y,z
		0,3,6, 4, // top
		1,7,2, 5 // bottom
	];


    this.positions = { numComponents : 3 };

    this.indices = { count : indices.length };

    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

	// uniform plumbing for the transformations
	this.Rloc = gl.getUniformLocation(this.program, "R");
	this.R = mat4();

	this.Lloc = gl.getUniformLocation(this.program, "T");
	this.T = mat4();

	this.perspProjloc = gl.getUniformLocation(this.program, "perspProj");
	this.perspProj = mat4();

	this.viewTransloc = gl.getUniformLocation(this.program, "viewTrans");
	this.viewTrans = mat4();

    this.render = function () {
        gl.useProgram( this.program );

		gl.uniformMatrix4fv(this.Rloc, gl.FALSE, flatten(this.R));
		gl.uniformMatrix4fv(this.Lloc, gl.FALSE, flatten(this.T));
		gl.uniformMatrix4fv(this.perspProjloc, gl.FALSE, flatten(this.perspProj));
		gl.uniformMatrix4fv(this.viewTransloc, gl.FALSE, flatten(this.viewTrans));

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

		// Drawing 4 sides of the cube using triangle strip only
		// reading the first 10 elements
        gl.drawElements( gl.TRIANGLE_STRIP, 10, gl.UNSIGNED_SHORT, 0 );

		// Drawing top of cube with triangle strip in the same indeces buffer
		// but only reading the next 4 points after the side finished. 10 * 2
		// because it is the offset in bytes. Each element is 2 bytes long, and
		// there are 10 indices before getting to the top part
		gl.drawElements( gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 10*2);

		// Drawing bottom of cube with triangle strip in the same indeces buffer
		// but only reading the next 4 points after the top finished. 10 * 2
		// because it is the offset in bytes. Each element is 2 bytes long, and
		// there are 14 indices before getting to the bottom part
		gl.drawElements( gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 14*2);

    }
};
