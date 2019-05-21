"use strict";

var canvas;
var gl;

var numVertices = 100000;
var vertices = new Float32Array(2*numVertices);

var theta = 0.0;
var thetaLoc;

var t1 = new Date();
var t2;
var frames = 0.0;
var sum = 0.0;
var times = [];

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
  }

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i =0; i<numVertices; i++) {
      vertices[2*i] += 0.1*(Math.random()-0.5);
      vertices[2*i+1] += 0.1*(Math.random()-0.5);
    }

    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );

    gl.bufferSubData( gl.ARRAY_BUFFER, 0, vertices );

    t2 = new Date;
    //sum += t2.valueOf()-t1.valueOf();
    times[frames] = t2.valueOf()-t1.valueOf();
    //frames++;
    frames ++;
    frames = frames%10;
    //console.log("fps = ", Math.floor(1000*frames/sum+0.5));
    var sum = 0;
    for(var i=0; i<10; i++) sum  += times[i];
    console.log("fps = ", Math.floor(10000/sum+0.5));
    t1 = t2;

    gl.drawArrays( gl.POINTS, 0, numVertices );

    window.requestAnimFrame(render);
}
