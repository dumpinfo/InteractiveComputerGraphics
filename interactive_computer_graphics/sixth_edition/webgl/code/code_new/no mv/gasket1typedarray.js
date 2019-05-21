"use strict";

var gl;
var points;

var numPoints = 5000;

var points = new Float32Array(2*numPoints);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = new Float32Array(
        [ -1, -1 ,
          0,  1 ,
          1, -1 ]
    );

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    points[0] = 0.33*(vertices[0] + vertices[2]  + vertices[4]);
    points[1] = 0.33*(vertices[1] + vertices[3] + vertices[5]);

    // And, add our initial point into our array of points


    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 1; i < numPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);

        points[2*i] = 0.5*(points[2*i-2] + vertices[2*j]),
        points[2*i+1] = 0.5*(points[2*i-1] + vertices[2*j+1]) ;

    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, numPoints );
}
