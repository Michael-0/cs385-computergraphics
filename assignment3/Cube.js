const DefaultNumSides = 8;

function Cube( gl, numSides, vertexShaderId, fragmentShaderId ) {

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

    var n = numSides || DefaultNumSides; // Number of sides

    // Initialize temporary arrays for the Cube's indices and vertex positions
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
	// 8 unique vertices from 0 - 7
	var indices = [
		0,1,3, 2, // back face on x,y
		4, 5,	  // right face on y,z
		6, 7,	  // front face on x,y
		0, 1	  // left face on y,z
	];
	console.log(indices);


    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        // Draw the cube's base
        //
        gl.drawElements( gl.POINTS, this.indices.count, gl.UNSIGNED_SHORT, 0 );

        // Draw the cube's top
        //
        var offset = this.indices.count * 2 /* sizeof(UNSIGNED_INT) */;
        gl.drawElements( gl.POINTS, this.indices.count, gl.UNSIGNED_SHORT, offset );
    }
};
