"use strict";

var canvas;
var gl;

var numVertices  = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var thetaLoc;

var flag = false;

var program;

var pointsArray = [];
var normalsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var triangleVertices = [
    vec4(0.0, 0.3, 0.8, 1.0),
    vec4(0.3, -0.3, 0.8, 1.0),
    vec4(-0.3, -0.3, 0.8, 1.0)
];

window.onload = init;

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function triangle(a, b, c) {
     pointsArray.push(triangleVertices[a]);
     pointsArray.push(triangleVertices[b]);
     pointsArray.push(triangleVertices[c]);
}



function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();
    triangle(0, 1, 2);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    var fovy = 30.0;
    var near = 4.0;
    var far = 6.0;
    var aspect = 1.0;
    var lightProjectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "lightProjectionMatrix"), false, flatten(lightProjectionMatrix) );

    var lightPosition = vec3(0, 0, 5.0);

    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    var lightViewMatrix = lookAt(lightPosition, at, up);

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "lightViewMatrix"), false, flatten(lightViewMatrix) );

    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 0.5;

    var instanceMatrix = mat4();

    instanceMatrix = mult(instanceMatrix, rotateX(theta[xAxis] ));
    instanceMatrix = mult(instanceMatrix, rotateY(theta[yAxis]));
    instanceMatrix = mult(instanceMatrix, rotateZ(theta[zAxis]));
    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "instanceMatrix"), false, flatten(instanceMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    var identityMatrix = mat4();

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "instanceMatrix"), false, flatten(identityMatrix) );

    gl.drawArrays( gl.TRIANGLES, numVertices,  3);


    requestAnimFrame(render);
}
