"use strict";

var modelViewMatrix = [];
var projectionMatrix = [];

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];

var flag = false;

var program;
var canvas, render, gl;

var points = [];
var colors = [];

var myTeapot = [];

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    myTeapot = teapot(3);

    points = myTeapot.TriangleVertices;
    colors = myTeapot.VertexColors;


    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    //var tBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW );

    //var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    //gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vTexCoord);

    projectionMatrix = ortho(-4, 4, -4, 4, -200, 200);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    render();
}

var render = function() {

      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if(flag) theta[axis] += 0.5;

      modelViewMatrix = mat4();

      modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
      modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
      modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));

      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false,
          flatten(modelViewMatrix) );

      gl.drawArrays( gl.TRIANGLES, 0, points.length);
      requestAnimFrame(render);
  }
