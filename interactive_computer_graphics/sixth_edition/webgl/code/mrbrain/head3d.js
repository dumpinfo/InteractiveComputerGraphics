"use strict";

var canvas;
var gl;

var numVertices  = 18;

var texSize = 256;

var flag = false;
var flagX = true;
var flagY = true;
var flagZ = true;

var hx = 0.0;
var hy = 0.0;
var hz = 0.0;

var nSlices = 109;

// Create a checkerboard pattern using floats


var image3 = new Uint8Array(4*nSlices*texSize*texSize);
/*
var max = data[0];
var min = data[0];

for(var k=0; k<nSlices; k++)
  for(var i=0; i<texSize; i++)
    for(var j=0; j<texSize; j++)  {
      if(data[i+texSize*j+texSize*texSize*k]>max) max = data[i+texSize*j+texSize*texSize*k];
      if(data[i+texSize*j+texSize*texSize*k]<min) min = data[i+texSize*j+texSize*texSize*k];
  }
console.log(max, min);
*/
for(var k=0; k<nSlices; k++)
  for(var i=0; i<texSize; i++)
    for(var j=0; j<texSize; j++)  {
               image3[4*(i+texSize*j+texSize*texSize*k)] = data[i+texSize*j+texSize*texSize*k] ;
               image3[4*(i+texSize*j+texSize*texSize*k)+1] = data[i+texSize*j+texSize*texSize*k];
               image3[4*(i+texSize*j+texSize*texSize*k)+2] = data[i+texSize*j+texSize*texSize*k];
               image3[4*(i+texSize*j+texSize*texSize*k)+3] = 255;
   }

var pointsArray = [];


var vertices = [
    vec4( -0.5, -0.5,  hz, 1.0 ),
    vec4( -0.5,  0.5,  hz, 1.0 ),
    vec4( 0.5,  0.5,  hz, 1.0 ),
    vec4( 0.5, -0.5,  hz, 1.0 ),

    vec4( -0.5, hy,  -0.5, 1.0 ),
    vec4( -0.5,  hy,  0.5, 1.0 ),
    vec4( 0.5,  hy,  0.5, 1.0 ),
    vec4( 0.5, hy,  -0.5, 1.0 ),

    vec4( hx, -0.5, -0.5, 1.0 ),
    vec4( hx,  -0.5, 0.5, 1.0 ),
    vec4( hx,  0.5, 0.5, 1.0 ),
    vec4( hx , 0.5, -0.5, 1.0 )
];

window.onload = init;


var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = vec3(45.0, 45.0, 45.0);

var thetaLoc;



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
    quad( 5, 4, 7, 6 );
    quad( 9, 8, 11, 10 );

}


function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);


    var texture3D = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_3D, texture3D );
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, texSize, texSize, nSlices, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image3);
    gl.texParameteri( gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.generateMipmap( gl.TEXTURE_3D );


    gl.uniform1i( gl.getUniformLocation(program, "textureMap3D"), 0);

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("toggleX").onclick = function(){flagX = !flagX};
    document.getElementById("toggleY").onclick = function(){flagY = !flagY};
    document.getElementById("toggleZ").onclick = function(){flagX = !flagZ};

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    document.getElementById("xSlider").onchange = function(event) {
        hx = event.target.value;
        for(var i=8; i<12; i++) vertices[i][0] = hx;
        pointsArray = [];
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    };
    document.getElementById("ySlider").onchange = function(event) {
        hy = event.target.value;
        for(var i=4; i<8; i++) vertices[i][1] = hy;
        pointsArray = [];
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    };
    document.getElementById("zSlider").onchange = function(event) {
        hz = event.target.value;
        for(var i=0; i<4; i++) vertices[i][2] = hz;
        pointsArray = [];
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    };

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    if(flagX) gl.drawArrays( gl.TRIANGLES, 0, numVertices/3 );
    if(flagY) gl.drawArrays( gl.TRIANGLES, numVertices/3, numVertices/3 );
    if(flagZ) gl.drawArrays( gl.TRIANGLES, 2*numVertices/3, numVertices/3 );
    requestAnimationFrame(render);
}
