"use strict";

function  f0(x, z, t) {
   return 0.2*Math.sin(10.0*x)*Math.cos(10.0*z)*Math.cos(t);


}

function  f1(x, z, t) {

   var r = Math.sqrt(x*x+z*z);
   if(r == 0.0) return 2.0*Math.cos(t);
   else return 0.1*Math.sin(20.0*r)/r*Math.cos(t);

}

function  f2(x, z, t) {

   return 0.2*Math.sin(80.0*x*z*Math.cos(t));
}

var examples = [f0, f1, f2];

var f = examples[0];

var first = true;

var mesh = true;
var surface = true;

var vNormal, vPosition;

var xmax = 0.5;
var xmin = -0.5;
var zmax = 0.5;
var zmin = -0.5;
var ymax, ymin;
var yscale = 1.0;

var gl;

var nRows = 50;
var nColumns = 50;

var time = 0.0;
var dt = 0.01;

var next = 0;

var nBufferId, vBufferId;
var color;

const black = vec4(0.0, 0.0, 0.0, 1.0);
const cyan = vec4(0.0, 1.0, 1.0, 1.0);


var modeViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

     nBufferId = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId );


    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


     vBufferId = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    color = gl.getUniformLocation(program, "color");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

      document.getElementById("Faster").onclick = function (event) {
          dt *= 1.5;
        };
        document.getElementById("Slower").onclick = function (event) {
          dt *= 0.75;
      };
      document.getElementById("Near").onclick = function (event) {
          xmax *= 0.75;
          xmin *= 0.75;
          zmax *= 0.75;
          zmin *= 0.75;
        };
        document.getElementById("Far").onclick = function (event) {
          xmax *= 1.5;
          xmin *= 1.5;
          zmax *= 1.5;
          zmin *= 1.5;
      };
      document.getElementById("Expand").onclick = function (event) {
          yscale *= 1.5;
        };
        document.getElementById("Compress").onclick = function (event) {
          yscale *= 0.75;
      };

      document.getElementById("Next").onclick = function (event) {
        next= (next+1)%examples.length;
        f = examples[next];
    };
    document.getElementById("Mesh").onclick = function (event) {
      mesh = !mesh;
    };
    document.getElementById("Surface").onclick = function (event) {
      surface = !surface;
    };



    render();
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    var data = [];
    var normalx = [];
    var normalz = [];

    if(first) {
       ymax = f(-1.0, -1.0, time);
       ymin = ymax;
    }

    for( var i = 0; i < nRows; ++i ) {
        data.push( [] );
        //var x = 2.0*i/nRows-1.0;
        var x = (xmax-xmin)*i/nRows+xmin;
        for( var j = 0; j < nColumns; ++j ) {
            //var z = 2.0*j/nColumns-1.0;
            var z = (zmax-zmin)*j/nRows+zmin;
            data[i][j] =  yscale*f(x, z, time);
            if(first) {
              if(data[i][j]>ymax) ymax = data[i][j];
              else if(data[i][j]<ymin) ymin = data[i][j];
          }
        }
        first = false;
    }


    for( var i = 0; i < nRows-1; ++i ) {
        normalx.push( [] );
        normalz.push( [] );
        for( var j = 0; j < nColumns-1; ++j ) {
            normalx[i][j] = nRows*(data[i+1][j]-data[i][j]);
            normalz[i][j] =  nColumns*(data[i][j+1]-data[i][j]);
        }
    }

    var pointsArray = [];
    var normalsArray = [];

    for(var i=0; i<nRows-2; i++) {
        for(var j=0; j<nColumns-2;j++) {
            pointsArray.push( vec4(2*i/nRows-1, data[i][j], 2*j/nColumns-1, 1.0));
            pointsArray.push( vec4(2*(i+1)/nRows-1, data[i+1][j], 2*j/nColumns-1, 1.0));
            pointsArray.push( vec4(2*(i+1)/nRows-1, data[i+1][j+1], 2*(j+1)/nColumns-1, 1.0));
            pointsArray.push( vec4(2*i/nRows-1, data[i][j+1], 2*(j+1)/nColumns-1, 1.0) );
            normalsArray.push( vec4(normalx[i][j], 1.0, normalz[i][j], 0.0));
            normalsArray.push( vec4(normalx[i+1][j], 1.0, normalz[i+1][j], 0.0));
            normalsArray.push( vec4(normalx[i+1][j+1], 1.0, normalz[i+1][j+1],  0.0));
            normalsArray.push( vec4(normalx[i][j+1], 1.0, normalz[i][j+1],  0.0));
    }
}

  gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var at = vec3((xmax+xmin)/2,0, (ymax+ymin)/2, (zmax+zmin)/2);
  var up = vec3(0.0, 1.0, 0.0);
  var eye = vec3((xmax+xmin)/2.0, 2*ymax, zmax);

  var modelViewMatrix = lookAt( eye, at, up );
  var projectionMatrix = ortho( xmin, xmax, 5*ymin, 5*ymax, 5*zmin, 5*zmax );

  gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    // draw each quad as two filled red triangles
    // and then as two black line loops

    for(var i=0; i<pointsArray.length; i+=4) {
        if(surface) {
          gl.uniform4fv(color, flatten(cyan));
          gl.drawArrays( gl.TRIANGLE_FAN, i, 4);
        }
        if(mesh) {
          gl.uniform4fv(color, flatten(black));
          gl.drawArrays( gl.LINE_LOOP, i, 4 );
        }
    }
    time += dt;
    requestAnimFrame(render);
}
