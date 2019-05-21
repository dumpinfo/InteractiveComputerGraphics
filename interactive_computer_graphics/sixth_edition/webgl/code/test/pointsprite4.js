"use strict";

var canvas;
var gl;

var texSize = 64;

var numVertices = 1000000;
var vertices = new Float32Array(2*numVertices);
var angles = new Float32Array(numVertices);

var bufferId, anglesId;


function configureTexture(image) {
    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  for(var i = 0; i<numVertices; i++) {
    vertices[2*i] = 2.0*(Math.random() - 0.5);
    vertices[2*i+1] = 2.0*(Math.random() - 0.5);
    angles[i] = 2.0*(Math.random() - 0.5);
  }

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    anglesId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, anglesId );
    gl.bufferData( gl.ARRAY_BUFFER, angles, gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vAngle = gl.getAttribLocation( program, "vAngle" );
    gl.vertexAttribPointer( vAngle, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vAngle );

    var image = document.getElementById("texImage");
    configureTexture(image);

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i =0; i<numVertices; i++) {
      vertices[2*i] += 0.01*(Math.random()-0.5);
      vertices[2*i+1] += 0.01*(Math.random()-0.5);
      angles[i] += 0.1*(Math.random()-0.5);
    }

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferSubData( gl.ARRAY_BUFFER, 0, vertices );

    gl.bindBuffer( gl.ARRAY_BUFFER, anglesId );
    gl.bufferSubData( gl.ARRAY_BUFFER, 0, angles );

    gl.drawArrays( gl.POINTS, 0, numVertices );

    window.requestAnimFrame(render);
}
