
"use strict";

function sphere(numSubdivisions) {

var subdivisions = 3;
if(numSubdivisions) subdivisions = numSubdivisions;


var data = {};

var radius = 0.5;

var sphereVertexCoordinates = [];
var sphereVertexCoordinatesNormals = [];
var sphereVertexColors = [];
var sphereTextureCoordinates = [];
var sphereNormals = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

function triangle(a, b, c) {

     sphereVertexCoordinates.push(a);
     sphereVertexCoordinates.push(b);
     sphereVertexCoordinates.push(c);

     // normals are vectors

     sphereNormals.push([a[0],a[1], a[2]]);
     sphereNormals.push([b[0],b[1], b[2]]);
     sphereNormals.push([c[0],c[1], c[2]]);

     sphereVertexColors.push([(1+a[0])/2.0, (1+a[1])/2.0, (1+a[2])/2.0, 1.0]);
     sphereVertexColors.push([(1+b[0])/2.0, (1+b[1])/2.0, (1+b[2])/2.0, 1.0]);
     sphereVertexColors.push([(1+c[0])/2.0, (1+c[1])/2.0, (1+c[2])/2.0, 1.0]);

     sphereTextureCoordinates.push([0.5*Math.acos(a[0])/Math.PI, 0.5*Math.asin(a[1]/Math.sqrt(1.0-a[0]*a[0]))/Math.PI]);
     sphereTextureCoordinates.push([0.5*Math.acos(b[0])/Math.PI, 0.5*Math.asin(b[1]/Math.sqrt(1.0-b[0]*b[0]))/Math.PI]);
     sphereTextureCoordinates.push([0.5*Math.acos(c[0])/Math.PI, 0.5*Math.asin(c[1]/Math.sqrt(1.0-c[0]*c[0]))/Math.PI]);

     //sphereTextureCoordinates.push([0.5+Math.asin(a[0])/Math.PI, 0.5+Math.asin(a[1])/Math.PI]);
     //sphereTextureCoordinates.push([0.5+Math.asin(b[0])/Math.PI, 0.5+Math.asin(b[1])/Math.PI]);
     //sphereTextureCoordinates.push([0.5+Math.asin(c[0])/Math.PI, 0.5+Math.asin(c[1])/Math.PI]);

}

//float pi = acos(0.0);

//s= 0.5*acos(vPosition.x)/pi;

//t = 0.5*asin(vPosition.y/sqrt(1.0-vPosition.x*vPosition.x))/pi;


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

tetrahedron(va, vb, vc, vd, subdivisions);


function translate(x, y, z){
   for(var i=0; i<sphereVertexCoordinates.length; i++) {
     sphereVertexCoordinates[i][0] += x;
     sphereVertexCoordinates[i][1] += y;
     sphereVertexCoordinates[i][2] += z;
   };
}

function scale(sx, sy, sz){
    for(var i=0; i<sphereVertexCoordinates.length; i++) {
        sphereVertexCoordinates[i][0] *= sx;
        sphereVertexCoordinates[i][1] *= sy;
        sphereVertexCoordinates[i][2] *= sz;
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

    for(var i=0; i<sphereVertexCoordinates.length; i++) {
          var u = [0, 0, 0];
          var v = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++) {
              u[j] += mat[j][k]*sphereVertexCoordinates[i][k];
              v[j] += mat[j][k]*sphereNormals[i][k];
            };
           for( var j =0; j<3; j++) {
             sphereVertexCoordinates[i][j] = u[j];
             sphereNormals[i][j] = v[j];
           };
    };
}
//for(var i =0; i<sphereVertexCoordinates.length; i++) console.log(sphereTextureCoordinates[i]);

data.TriangleVertices = sphereVertexCoordinates;
data.TriangleNormals = sphereNormals;
data.TriangleVertexColors = sphereVertexColors;
data.TextureCoordinates = sphereTextureCoordinates;
data.rotate = rotate;
data.translate = translate;
data.scale = scale;
return data;

}
