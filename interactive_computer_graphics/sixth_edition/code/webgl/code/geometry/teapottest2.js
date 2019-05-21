"use strict";

var modelViewMatrix = [];
var projectionMatrix = [];

var normalMatrix, normalMatrixLoc;

var axis =0;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var dTheta = 5.0;

var flag = true;

var program;
var canvas, render, gl;

var points = [];
var normals = [];
var myTeapots = [];
var numTeapots = 100;

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    for(var i =0; i<numTeapots; i++){
      myTeapots[i] = teapot(3);
      var s = 0.5*Math.random();
      myTeapots[i].scale(s, s, s);
      myTeapots[i].translate(3.0*(2.0*Math.random()-1.0), 3.0*(2.0*Math.random()-1.0), 3.0*(2.0*Math.random()-1.0));
      myTeapots[i].rotate(360*Math.random(), [2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0]);
    }

    points = myTeapots[0].TriangleVertices;
    normals = myTeapots[0].Normals;
    for(var i =0; i<numTeapots; i++) {
      points = points.concat(myTeapots[i].TriangleVertices);
      normals = normals.concat(myTeapots[i].Normals);
    }

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


    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    projectionMatrix = ortho(-4, 4, -4, 4, -200, 200);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );


    var myMaterial = goldMaterial();
    var myLight = light0();

    var ambientProduct = mult(myLight.lightAmbient, myMaterial.materialAmbient);
    var diffuseProduct = mult(myLight.lightDiffuse, myMaterial.materialDiffuse);
    var specularProduct = mult(myLight.lightSpecular, myMaterial.materialSpecular);


    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(myLight.lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),myMaterial.materialShininess );


    render();
}

var render = function(){
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if(flag) theta[axis] += 0.5;

      modelViewMatrix = mat4();

      modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
      modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
      modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));

      gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false,
          flatten(modelViewMatrix) );
      normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
      ];
      gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

      gl.drawArrays( gl.TRIANGLES, 0, points.length);
      requestAnimFrame(render);
  }
