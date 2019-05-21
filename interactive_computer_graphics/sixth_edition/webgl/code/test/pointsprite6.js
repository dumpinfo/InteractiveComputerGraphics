"use strict";

var canvas;
var gl;

var numVertices = 10000;
var vertices = new Float32Array(3*numVertices);

var theta = 0.0;
var thetaLoc;

var t1 = new Date();
var t2;

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
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  for(var i = 0; i<numVertices; i++) {
    vertices[3*i] = 2.0*(Math.random() - 0.5);
    vertices[3*i+1] = 2.0*(Math.random() - 0.5);
    vertices[3*i+2] = 2.0*(Math.random() - 0.5);
  }

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
/*
    for(var i =0; i<numVertices; i++) {
      vertices[2*i] += 0.05*(Math.random()-0.5);
      vertices[2*i+1] += 0.05*(Math.random()-0.5);
    }
*/
    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );

    //gl.bufferSubData( gl.ARRAY_BUFFER, 0, vertices );

    t2 = new Date;
    //console.log(Math.floor(1000/(t2.valueOf()-t1.valueOf())+0.5));
    t1 = t2;

    gl.drawArrays( gl.POINTS, 0, numVertices );

    window.requestAnimFrame(render);
}
