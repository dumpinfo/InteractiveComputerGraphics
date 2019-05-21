"use strict";

var canvas;
var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var flag = false;

var points = [];
var colors = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var mySphere1 = sphere();
    mySphere1.scale(0.5, 0.5, 0.5);
    mySphere1.rotate(45.0, [ 1, 1, 1]);
    mySphere1.translate(0.1, 0.1, 0.0);

    var mySphere2 = sphere();
    mySphere2.scale(0.5, 0.5, 0.5);
    mySphere2.rotate(45.0, [ -1, 1, 1]);
    mySphere2.translate(0.0, 0.0, 0.0);

    var mySphere3 = sphere();
    mySphere3.scale(0.5, 0.5, 0.5);
    mySphere3.rotate(45.0, [ 1, -1, 1]);
    mySphere3.translate(-0.1, 0.0, 0.0);

    colors = mySphere1.TriangleVertexColors;
    points = mySphere1.TriangleVertices;

    colors = colors.concat(mySphere2.TriangleVertexColors);
    colors = colors.concat(mySphere3.TriangleVertexColors);

    points = points.concat(mySphere2.TriangleVertices);
    points = points.concat(mySphere3.TriangleVertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    //console.log(points.length);
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    requestAnimFrame( render );
}
