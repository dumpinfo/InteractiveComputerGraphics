
"use strict";

function cylinder(numSlices, numStacks, caps) {

var slices = 36;
if(numSlices) slices = numSlices;
var stacks = 1;
if(numStacks) stacks = numStacks;
var capsFlag = true;
if(caps==false) capsFlag = caps;

var data = {};


var top = 0.5;
var bottom = -0.5;
var radius = 0.5;
var topCenter = [0.0, top, 0.0];
var bottomCenter = [0.0, bottom, 0.0];


var sideColor = [1.0, 0.0, 0.0, 1.0];
var topColor = [0.0, 1.0, 0.0, 1.0];
var bottomColor = [0.0, 0.0, 1.0, 1.0];


var cylinderVertexCoordinates = [];
var cylinderNormals = [];
var cylinderVertexColors = [];
var cylinderTextureCoordinates = [];

// side

for(var j=0; j<stacks; j++) {
  var stop = bottom + (j+1)*(top-bottom)/stacks;
  var sbottom = bottom + j*(top-bottom)/stacks;
  var topPoints = [];
  var bottomPoints = [];
  var topST = [];
  var bottomST = [];
  for(var i =0; i<slices; i++) {
    var theta = 2.0*i*Math.PI/slices;
    topPoints.push([radius*Math.sin(theta), stop, radius*Math.cos(theta), 1.0]);
    bottomPoints.push([radius*Math.sin(theta), sbottom, radius*Math.cos(theta), 1.0]);
  };

  topPoints.push([0.0, stop, radius, 1.0]);
  bottomPoints.push([0.0,  sbottom, radius, 1.0]);


  for(var i=0; i<slices; i++) {
    var a = topPoints[i];
    var d = topPoints[i+1];
    var b = bottomPoints[i];
    var c = bottomPoints[i+1];
    var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    var v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];

    var normal = [
      u[1]*v[2] - u[2]*v[1],
      u[2]*v[0] - u[0]*v[2],
      u[0]*v[1] - u[1]*v[0]
    ];

    var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
    normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag];
    cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([i/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([d[0], d[1], d[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);
  };
};

  var topPoints = [];
  var bottomPoints = [];
  for(var i =0; i<slices; i++) {
    var theta = 2.0*i*Math.PI/slices;
    topPoints.push([radius*Math.sin(theta), top, radius*Math.cos(theta), 1.0]);
    bottomPoints.push([radius*Math.sin(theta), bottom, radius*Math.cos(theta), 1.0]);
  };
  topPoints.push([0.0, top, radius, 1.0]);
  bottomPoints.push([0.0,  bottom, radius, 1.0]);

if(capsFlag) {

//top

for(i=0; i<slices; i++) {
  normal = [0.0, 1.0, 0.0];
  var a = [0.0, top, 0.0, 1.0];
  var b = topPoints[i];
  var c = topPoints[i+1];
  cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);
};

//bottom

for(i=0; i<slices; i++) {
  normal = [0.0, -1.0, 0.0];
  var a = [0.0, bottom, 0.0, 1.0];
  var b = bottomPoints[i];
  var c = bottomPoints[i+1];
  cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);
};

};
function translate(x, y, z){
   for(var i=0; i<cylinderVertexCoordinates.length; i++) {
     cylinderVertexCoordinates[i][0] += x;
     cylinderVertexCoordinates[i][1] += y;
     cylinderVertexCoordinates[i][2] += z;
   };
}

function scale(sx, sy, sz){
    for(var i=0; i<cylinderVertexCoordinates.length; i++) {
        cylinderVertexCoordinates[i][0] *= sx;
        cylinderVertexCoordinates[i][1] *= sy;
        cylinderVertexCoordinates[i][2] *= sz;
    };
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function rotate( angle, axis) {

    var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

    var x = axis[0]/d;
    var y = axis[1]/d;
    var z = axis[2]/d;

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var mat = [
        [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
        [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
        [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
    ];

    for(var i=0; i<cylinderVertexCoordinates.length; i++) {
          var u = [0, 0, 0];
          var v = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++) {
              u[j] += mat[j][k]*cylinderVertexCoordinates[i][k];
              v[j] += mat[j][k]*cylinderNormals[i][k];
            };
           for( var j =0; j<3; j++) {
             cylinderVertexCoordinates[i][j] = u[j];
             cylinderNormals[i][j] = v[j];
           };
    };
}

data.TriangleVertices = cylinderVertexCoordinates;
data.TriangleNormals = cylinderNormals;
data.TriangleVertexColors = cylinderVertexColors;
data.TextureCoordinates = cylinderTextureCoordinates;
data.rotate = rotate;
data.translate = translate;
data.scale = scale;
return data;

}
