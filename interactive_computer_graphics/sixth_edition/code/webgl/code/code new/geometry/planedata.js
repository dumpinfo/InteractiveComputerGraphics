
"use strict";

function plane(s) {

var data = {};

var size;
if (!s) size = 0.5;
else size = s/2;

var planeVertices = [
    [ -size, -size,  0.0, 1.0 ],
    [ -size,  size,  0.0, 1.0 ],
    [  size, size, 0.0, 1.0 ],
    [  size, -size,  0.0, 1.0 ],
];

var planeNormal = [
   0, 0, 1
];

var planeIndices = [
 1, 0, 3, 2
];

var planeVertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ],  // black
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
    [ 1.0, 1.0, 1.0, 1.0 ]   // white
];

var planeElements = [
    1, 0, 3,
    3, 2, 1
];

var planeTexElements = [
    1, 0, 3,
    3, 2, 1,
];

var planeNormalElements = [
  0, 0, 0,
  0, 0, 0
];

var faceTexCoord = [
    [ 0, 0],
    [ 0, 1],
    [ 1, 1],
    [ 1, 0]
];

var planeTriangleVertices = [];
var planeTexElementsTriangleVertexColors = [];
var planeTriangleVerticesTriangleFaceColors = [];
var planeTriangleVertexColors = [];
var planeTextureCoordinates = [];
var planeTriangleNormals = [];
var planeTriangleFaceColors = [];

for ( var i = 0; i < planeElements.length; i++ ) {
    planeTriangleVertices.push( planeVertices[planeElements[i]] );
    planeTriangleVertexColors.push( planeVertexColors[planeElements[i]] );
    planeTextureCoordinates.push( faceTexCoord[planeTexElements[i]]);
    planeTriangleNormals.push(planeNormal[planeNormalElements[i]]);
}

for ( var i = 0; i < planeElements.length; i++ ) {
    planeTriangleFaceColors[i] = planeVertexColors[1+Math.floor((i/6))];
}

function translate(x, y, z){
   for(i=0; i<4; i++) {
     planeVertices[i][0] += x;
     planeVertices[i][1] += y;
     planeVertices[i][2] += z;
   };
}

function scale(sx, sy, sz){
    for(i=0; i<4; i++) {
        planeVertices[i][0] *= sx;
        planeVertices[i][1] *= sy;
        planeVertices[i][2] *= sz;
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

    for(i=0; i<4; i++) {
          var t = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++)
              t[j] += mat[j][k]*planeVertices[i][k];
           for( var j =0; j<3; j++) planeVertices[i][j] = t[j];
    };
}


data.Indices = planeIndices;
data.VertexColors = planeVertexColors;
data.Vertices = planeVertices;
data.Elements = planeElements;
data.TextureCoordinates = planeTextureCoordinates;
data.TriangleVertices = planeTriangleVertices;
data.TriangleVertexColors = planeTriangleVertexColors;
data.TriangleFaceColors = planeTriangleFaceColors;
data.TriangleNormals = planeTriangleNormals;
data.translate = translate;
data.scale = scale;
data.rotate = rotate;

return data;

}
