"use strict";

var canvas;
var gl;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var time = 0.0;
var dt = 5.0;

var near = -3.0;
var far = 3.0;
var radius = 1.5;

// initial orientation of camera in radians

var theta  = 45.0 * Math.PI/180.0;;
var phi    = 45.0 * Math.PI/180.0;0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.5;
var right = 1.5;
var ytop = 1.5;
var bottom = -1.5;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var nMatrix, nMatrixLoc;

var nBuffer, vBuffer;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// initial mesh heights

var N = 64;
var data = {};
for(var i =0; i<N; i++) data[i] = {};
for(var i=0; i<N; i++) for(var j=0; j<N; j++) data[i][j]= 0.0;

// generates 2*N-1)*(N-1) triangles and face normals
// each vertex of form p = (i, data[i][j], j, 1)

function mesh() {
    for(var i=0; i< N-1; i++) {
      for(var j=0; j< N-1; j++) {

        var a = vec4(2*i/N-1, 2*data[i][j]-1, 2*j/N-1, 1.0);
        var b = vec4(2*(i+1)/N-1, 2*data[(i+1)][j]-1, 2*j/N-1, 1.0);
        var c = vec4(2*(i+1)/N-1, 2*data[(i+1)][j+1]-1, 2*(j+1)/N-1, 1.0);
        var d = vec4(2*i/N-1, 2*data[i][j+1]-1, 2*(j+1)/N-1, 1.0);

        pointsArray.push( a);
        pointsArray.push( b);
        pointsArray.push( c);

        var t1 = subtract(b, a);
        var t2 = subtract(c, a);
        var normal = normalize(cross(t2, t1));
        normal = vec4(normal[0], normal[1], normal[2], 0.0);

        normalsArray.push(normal);
        normalsArray.push(normal);
        normalsArray.push(normal);

        pointsArray.push(c);
        pointsArray.push(d);
        pointsArray.push(a);

        t1 = subtract(d, c);
        t2 = subtract(a, c);
        normal = normalize(cross(t2, t1));
        normal = vec4(normal[0], normal[1], normal[2], 0.0);

        normalsArray.push(normal);
        normalsArray.push(normal);
        normalsArray.push(normal);

        index += 6;
      }
    }
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    mesh();

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    nMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    document.getElementById("Button1").onclick = function(){theta += dr;};
    document.getElementById("Button2").onclick = function(){theta -= dr;};
    document.getElementById("Button3").onclick = function(){phi += dr;};
    document.getElementById("Button4").onclick = function(){phi -= dr;};


    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"), ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"), diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    nMatrix = normalMatrix(modelViewMatrix, true);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix ));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix ));
    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix ));

    time += dt;
    var a = 0.1; // mesh height scale factor
    var b = 0.001 // time scale factor
    var c = 5.0 // x period scale factor
    var d = 5.0 // z period scale factor
    for(var i=0; i<N; i++) for(var j=0; j<N; j++) {
      data[i][j] = a*Math.sin(b*time+c*(2*i/N-1))*Math.sin(b*time+d*(2*j/N-1));
    }

// generate new mesh when time incremented
// this code not needed of mesh does not change in time

    pointsArray = [];
    normalsArray = [];
    index = 0;
    mesh();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(normalsArray));

    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
}
