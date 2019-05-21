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
var myCubes = [];
var numCubes = 100;

var rArray = [];
var tArray = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    for(var i=0; i<numCubes; i++) {
      myCubes[i] = cube();
      rArray[i]= [90*Math.random(), Math.floor(2.0*Math.random()), Math.floor(2.0*Math.random()), Math.floor(2.0*Math.random())];
      myCubes[i].scale(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
      tArray[i] = [2.0*Math.random()-1.0, 2.0*Math.random()-1.0, 2.0*Math.random()-1.0];
      //myCubes[i].translate(tArray[i][0], tArray[i][1], tArray[i][2]);
      myCubes[i].rotate(rArray[i][0], [rArray[i][1], rArray[i][2], rArray[i][3]]);;
    }


    colors = myCubes[0].TriangleVertexColors;
    points = myCubes[0].TriangleVertices;
    for(i = 1; i<numCubes; i++) {
      points = points.concat(myCubes[i].TriangleVertices);
      colors = colors.concat(myCubes[i].TriangleFaceColors);
    };

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

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
    document.getElementById("ButtonT").onclick = function(){
      flag = !flag;
    };
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var i=0; i<numCubes; i++) {
      //myCubes[i].translate(tArray[i][0], tArray[i][1], tArray[i][2]);
      rArray[i][0]+=0.0*Math.random()
      rArray[i]= [rArray[i][0], Math.floor(2.0*Math.random()), Math.floor(2.0*Math.random()), Math.floor(2.0*Math.random())];
      myCubes[i].rotate(rArray[i][0], [rArray[i][1], rArray[i][2], rArray[i][3]]);
      //myCubes[i].translate(-tArray[i][0], -tArray[i][1], -tArray[i][2]);
    }
    points = myCubes[0].TriangleVertices;
    for(i = 1; i<numCubes; i++) {
      points = points.concat(myCubes[i].TriangleVertices);
    };
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW )
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    requestAnimFrame( render );
}
