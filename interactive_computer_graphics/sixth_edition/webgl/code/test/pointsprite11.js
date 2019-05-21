"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var spriteNumber = 1;
var spriteNumberLoc;

var texture;

var program;

var numSprites = 16;

// Create a checkerboard pattern using floats

function configureTexture( image ) {
    gl.activeTexture( gl.TEXTURE0 );
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA,
         gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

     var vertices = [];
     for(var i = 0; i<numSprites; i++)
      vertices.push(vec2(0.5*Math.sin(2.0*Math.PI*i/numSprites), 0.5*Math.cos(2.0*Math.PI*i/numSprites)));

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    spriteNumberLoc = gl.getUniformLocation( program, "spriteNumber" );

    var image = document.getElementById("texImage");

    configureTexture( image );

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );

    for(var i =0; i<numSprites; i++) {
      gl.uniform1i( spriteNumberLoc, i );
      gl.drawArrays( gl.POINTS, i, 1 );
    }

    window.requestAnimFrame(render);
}
