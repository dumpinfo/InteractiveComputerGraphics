"use strict";

var canvas;
var gl;

var modelView, projection;
var viewerPos;
var program1, program2, program3;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var flag = false;

var points = [];
var normals = [];
var colors = [];
var texCoord = [];

var numCubes = 100;
var numCylinders = 100;
var numSpheres = 100;

var myCubes = [];
var mySpheres = [];
var myCylinders = [];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

// specify objects and instance them

/*
for(var i=0; i<numCubes; i++) {
  myCubes[i] = cube();
  //myCubes[i].scale(0.2*Math.random(), 0.2*Math.random(), 0.2*Math.random());
  var s = 0.2*Math.random();
  myCubes[i].scale(s, s, s);
  myCubes[i].rotate(360*Math.random(), [2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0]);
  myCubes[i].translate(2.0*Math.random()-1.0, 2.0*Math.random()-1.0, 2.0*Math.random()-1.0);
}


colors = myCubes[0].TriangleVertexColors;
points = myCubes[0].TriangleVertices;
normals = myCubes[0].TriangleNormals;
texCoord = myCubes[0].TextureCoordinates;

for(i = 1; i<numCubes; i++) {
  points = points.concat(myCubes[i].TriangleVertices);
  colors = colors.concat(myCubes[i].TriangleVertexColors);
  normals = normals.concat(myCubes[i].TriangleNormals);
  texCoord = texCoord.concat(myCubes[i].TextureCoordinates);
};

*/
/*
for(var i=0; i<numCylinders; i++) {
  myCylinders[i] = cylinder(72, 3, true);
  //myCylinders[i].scale(0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random());
  myCylinders[i].scale(0.3, 0.3, 0.3);
  myCylinders[i].translate(2.0*Math.random()-1.0, 2.0*Math.random()-1.0, 2.0*Math.random()-1.0);
  //myCylinders[i].rotate(360*Math.random(), [2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0]);
}


colors = myCylinders[0].TriangleVertexColors;
points = myCylinders[0].TriangleVertices;
normals = myCylinders[0].TriangleNormals;
texCoord = myCylinders[0].TextureCoordinates;

for(i = 1; i<numCylinders; i++) {
  points = points.concat(myCylinders[i].TriangleVertices);
  colors = colors.concat(myCylinders[i].TriangleVertexColors);
  normals = normals.concat(myCylinders[i].TriangleNormals);
  texCoord = texCoord.concat(myCylinders[i].TextureCoordinates);
};
*/



for(var i=0; i<numSpheres; i++) {
  mySpheres[i] = sphere(3);
  //var s = 0.1*(2.0*Math.random()-1.0);
  //mySpheres[i].scale(0.5*Math.random(), 0.5*Math.random(), 0.5*Math.random());
  mySpheres[i].scale(0.1, 0.1, 0.1);
  mySpheres[i].rotate(360*Math.random(), [2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0, 2.0*Math.random() - 1.0]);
  var s = 0.3*(2.0*Math.random()-1.0);
  mySpheres[i].translate(0.5*(2.0*Math.random()-1.0), 0.5*(2.0*Math.random()-1.0), 0.5*(2.0*Math.random()-1.0));
}


colors = mySpheres[0].TriangleVertexColors;
points = mySpheres[0].TriangleVertices;
normals = mySpheres[0].TriangleNormals;
texCoord = mySpheres[0].TextureCoordinates;

for(i = 1; i<numSpheres; i++) {
  points = points.concat(mySpheres[i].TriangleVertices);
  colors = colors.concat(mySpheres[i].TriangleVertexColors);
  normals = normals.concat(mySpheres[i].TriangleNormals);
  texCoord = texCoord.concat(mySpheres[i].TextureCoordinates);
};



// light, material, texture

    var myMaterial = goldMaterial();
    var myLight = light0();
    var texture = checkerboardTexture();

    //
    //  Load shaders and initialize attribute buffers
    //
    program1 = initShaders( gl, "vertex-shader", "fragment-shader" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    program3 = initShaders( gl, "vertex-shader3", "fragment-shader3" );

// program1: render with lighting
//    need position and normal attributes sent to shaders
// program2: render with vertex colors
//    need position and color attributes sent to shaders
// program3: render with texture and vertex colors
//    need position, color and texture coordinate attributes send to shaders

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program2, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );

    var vColor2 = gl.getAttribLocation( program3, "vColor" );
    gl.vertexAttribPointer( vColor2, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor2 );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program1, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vPosition2 = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition2, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);

    var vPosition3 = gl.getAttribLocation(program3, "vPosition");
    gl.vertexAttribPointer(vPosition3, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition3);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program3, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

// set up projection matrix

    viewerPos = vec3(0.0, 0.0, -20.0 );

    projection = ortho(-1, 1, -1, 1, -100, 100);

// products of material and light properties

    var ambientProduct = mult(myLight.lightAmbient, myMaterial.materialAmbient);
    var diffuseProduct = mult(myLight.lightDiffuse, myMaterial.materialDiffuse);
    var specularProduct = mult(myLight.lightSpecular, myMaterial.materialSpecular);

// listeners

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

// uniforms for each program object

    gl.useProgram(program2);

    gl.uniformMatrix4fv( gl.getUniformLocation(program2, "projectionMatrix"),
       false, flatten(projection));

    gl.useProgram(program3);

    gl.uniformMatrix4fv( gl.getUniformLocation(program3, "projectionMatrix"),
          false, flatten(projection));


    gl.useProgram(program1);

    gl.uniform4fv(gl.getUniformLocation(program1, "ambientProduct"),
          flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program1, "diffuseProduct"),
          flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program1, "specularProduct"),
          flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program1, "lightPosition"),
          flatten(myLight.lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program1,
          "shininess"), myMaterial.materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program1, "projectionMatrix"),
          false, flatten(projection));


    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//update rotation angles and form modelView matrix

    if(flag) theta[axis] += 2.0;

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

// by commenting and uncommenting gl.drawArrays we can choose which shaders to use for each object

// shaded

    gl.useProgram(program1);
    gl.uniformMatrix4fv( gl.getUniformLocation(program1,
            "modelViewMatrix"), false, flatten(modelView) );

    gl.drawArrays( gl.TRIANGLES, 0, points.length);

// color

    gl.useProgram(program2);
    gl.uniformMatrix4fv( gl.getUniformLocation(program2,
            "modelViewMatrix"), false, flatten(modelView) );

    //gl.drawArrays( gl.TRIANGLES, 0, points.length);


// texture + color

    gl.useProgram(program3);
    gl.uniformMatrix4fv( gl.getUniformLocation(program3,
            "modelViewMatrix"), false, flatten(modelView) );

    //gl.drawArrays( gl.TRIANGLES, 0, points.length);


    requestAnimFrame(render);
}
