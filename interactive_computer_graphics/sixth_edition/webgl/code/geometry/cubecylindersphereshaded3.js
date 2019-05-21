"use strict";

var canvas;
var gl;

var numVertices  = 36;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta =[0, 0, 0];

var flag = false;

var points = [];
var normals = [];
var colors = [];

var ncube, ncylinder, nsphere;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    var myCube = cube(0.3);
    myCube.rotate(45.0, [1, 1, 1]);
    myCube.translate(0.7, 0.0, 0.0);

    var myCylinder = cylinder(72, 3, true);
    myCylinder.scale(0.5, 0.5, 0.5);
    myCylinder.rotate(45.0, [ 1, 1, 1]);
    myCylinder.translate(0.0, 0.0, 0.0);

    var mySphere = sphere();
    mySphere.scale(0.6, 0.6, 0.6);
    mySphere.rotate(45.0, [ 1, 1, 1]);
    mySphere.translate(-0.2, -0.1, 0.0);


    var myMaterial = goldMaterial();
    var myLight = light0();

    points = myCube.TriangleVertices;
    normals = myCube.TriangleNormals;
    colors = myCube.TriangleVertexColors;
    points = points.concat(myCylinder.TriangleVertices);
    normals = normals.concat(myCylinder.TriangleNormals);
    colors = colors.concat(myCylinder.TriangleVertexColors);
    points = points.concat(mySphere.TriangleVertices);
    normals = normals.concat(mySphere.TriangleNormals);
    colors = colors.concat(mySphere.TriangleVertexColors);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);





    viewerPos = vec3(0.0, 0.0, -20.0 );

    projection = ortho(-1, 1, -1, 1, -100, 100);

    var ambientProduct = mult(myLight.lightAmbient, myMaterial.materialAmbient);
    var diffuseProduct = mult(myLight.lightDiffuse, myMaterial.materialDiffuse);
    var specularProduct = mult(myLight.lightSpecular, myMaterial.materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};


       gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
          flatten(ambientProduct));
       gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
          flatten(diffuseProduct) );
       gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
          flatten(specularProduct) );
       gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
          flatten(myLight.lightPosition) );

       gl.uniform1f(gl.getUniformLocation(program,
          "shininess"), myMaterial.materialShininess);

       gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
          false, flatten(projection));


    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

    gl.useProgram(program);

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
            "modelViewMatrix"), false, flatten(modelView) );


    gl.drawArrays( gl.TRIANGLES, 0, points.length);



    requestAnimFrame(render);
}
