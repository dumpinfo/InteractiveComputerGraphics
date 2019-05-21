"use strict";

var canvas;
var gl;

var t1, t2;
t1 = new Date();

// turtle points

var size = 0.2;

var numSprites = 10000;
var spriteArray = [];

for(var i=0; i<numSprites; i++)
  spriteArray.push(vec2(2.0*Math.random()-1.0, 2.0*Math.random()-1.0));

var theta = (3.14159/180.0)*90.0;
var dtheta = 0.1;

var pointsArray = [
    vec2(size, 0.0),
    vec2(-size, size * 0.8 ),
    vec2(-size * 0.4, 0) ,
    vec2(-size * 0.4, 0) ,
    vec2(-size, -size * 0.8),
    vec2(size, 0.0),
];

var program1, program2;
var texture1;

var framebuffer, renderbuffer;


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


// Create an empty texture

    texture1 = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.bindTexture(gl.TEXTURE_2D, null);


// Allocate a framebuffer object

   framebuffer = gl.createFramebuffer();
   gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

   renderbuffer = gl.createRenderbuffer();
   gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

// Attach color buffer


   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);


// check for completeness

   var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
   if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');

    //
    //  Load shaders and initialize attribute buffers
    //
    program1 = initShaders( gl, "vertex-shader1", "fragment-shader1" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );

    gl.useProgram( program1 );


    // Create and initialize a buffer object with turtle vertices

    var buffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    // Initialize the vertex position attribute from the vertex shader

    var vPosition = gl.getAttribLocation( program1, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Render  sprite

    gl.viewport(0, 0, 64, 64);
    gl.clearColor(1.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT );

    gl.drawArrays(gl.TRIANGLES, 0, 6);


    // Bind to window system frame buffer, unbind the texture

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);


    gl.disableVertexAttribArray(vPosition);

    gl.useProgram(program2);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture1);

    // send data to GPU for normal render


    var buffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer2);

//  pointsArray

    gl.bufferData(gl.ARRAY_BUFFER, flatten(spriteArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program2, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    gl.uniform1i( gl.getUniformLocation(program2, "texture"), 0);
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );

    gl.viewport(0, 0, 1024, 1024);


    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f( gl.getUniformLocation(program2, "theta"), theta);

    // render point with texture

    theta += dtheta;
    gl.drawArrays(gl.POINTS, 0, numSprites);

    t2 = new Date()
    var fps = Math.floor(1000/(t2.valueOf()-t1.valueOf())+0.5);
    t1 = t2;
    console.log(fps);

    requestAnimFrame(render);
}
