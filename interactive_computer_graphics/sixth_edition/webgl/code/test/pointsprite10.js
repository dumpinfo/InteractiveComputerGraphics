"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var spriteNumber = 1;
var spriteNumberLoc;

var texSize = 64;

var texture1, texture2, texture3, texture4;

// Create a checkerboard pattern using floats


var checkerboard = new Array()
    for (var i =0; i<2*texSize; i++)  checkerboard[i] = new Array();
    for (var i =0; i<2*texSize; i++)
        for ( var j = 0; j < 2*texSize; j++)
           checkerboard[i][j] = new Float32Array(4);
    for (var i =0; i<2*texSize; i++) for (var j=0; j<2*texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
        if((i<texSize)&&(j<texSize))
         checkerboard[i][j] = [c, 0, c, 1];
        else if(i<texSize&&j>texSize) checkerboard[i][j] = [0, 0, c, 1];
        else if (i>texSize&&j<texSize) checkerboard[i][j] = [0, c, 0, 1];
        else  if(i>texSize&&j>texSize)checkerboard[i][j] = [c, 0, 0, 1];
    }

// Convert floats to ubytes for texture

var image1 = new Uint8Array(16*texSize*texSize);

    for ( var i = 0; i < 2*texSize; i++ )
        for ( var j = 0; j < 2*texSize; j++ )
           for(var k =0; k<4; k++) {
                image1[8*texSize*i+4*j+k] = 255*checkerboard[i][j][k];
              }



function configureTexture(texture, image) {
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2*texSize, 2*texSize, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
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
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec2(  0,  0.5 ),
        vec2(  -0.5,  0 ),
        vec2( 0.5,  0 ),
        vec2(  0, -0.5 )
    ];




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

     texture1 = gl.createTexture();

    configureTexture(texture1, image1);

    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.1;
    gl.uniform1f( thetaLoc, theta );


    gl.bindTexture(gl.TEXTURE_2D, texture1);

    spriteNumber = 1;
    gl.uniform1i( spriteNumberLoc, spriteNumber );
    gl.drawArrays( gl.POINTS, 0, 1 );
    spriteNumber = 2;
    gl.uniform1i( spriteNumberLoc, spriteNumber );
    gl.drawArrays( gl.POINTS, 1, 1 );
    spriteNumber = 3;
    gl.uniform1i( spriteNumberLoc, spriteNumber );
    gl.drawArrays( gl.POINTS, 2, 1 );
    spriteNumber = 4;
    gl.uniform1i( spriteNumberLoc, spriteNumber );
    gl.drawArrays( gl.POINTS, 3, 1 );

    window.requestAnimFrame(render);
}
