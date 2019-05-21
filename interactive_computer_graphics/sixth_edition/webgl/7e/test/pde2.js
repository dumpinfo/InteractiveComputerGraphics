var canvas;
var gl;

var flag = true;

var texSize = 1024;
var diffuse = 4.0;

var texCoord = new Float32Array([
    0, 0,
    0, 1,
    1, 0,
    1, 1
]);

var vertices = new Float32Array([
    -1.0, -1.0,
    -1.0, 1.0 ,
    1.0, -1.0 ,
    1.0, 1.0
]);

var points = new Float32Array([
  -0.25, -0.9,
  -0.25, 0.9,
  -0.15, -0.9,
  -0.15, 0.9,

  0.25, -0.5,
  0.25, 0.5,
  0.15, -0.5,
  0.15, 0.5,

  -1.0, 0.9,
  1.0, 0.9,
  -1.0, 1.0,
  1.0, 1.0,

  -1.0, -0.9,
  1.0, -0.9,
  -1.0, -1.0,
  1.0, -1.0,

  -1.0, -0.9,
  -0.9, -0.9,
  -1.0, 0.9,
  -0.9, 0.9,

  0.9, -0.9,
  1.0, -0.9,
  0.9, 0.9,
  1.0, 0.9
  ]);

var program1, program2, program3;
var framebuffer;
var texture1, texture2;

var buffer1, buffer2, buffer3;

var vPosition1, vPosition2, vPosition3;
var texLoc;

var image = new Uint8Array(4*texSize*texSize);
for ( var i = 0; i < texSize; i++ )
  for ( var j = 0; j < texSize; j++ ) {
          image[4*texSize*i+4*j] = 0;
          image[4*texSize*i+4*j+1] = 0;
          image[4*texSize*i+4*j+2] = 0;
          image[4*texSize*i+4*j+3] = 255;
  }
  for ( var i = texSize/4; i < 3*texSize/4; i++ )
    for ( var j = texSize/4; j < 3*texSize/4; j++ ) {
      image[4*texSize*i+4*j] = 255;
      image[4*texSize*i+4*j+1] = 255;
      image[4*texSize*i+4*j+2] = 255;
      image[4*texSize*i+4*j+3] = 255;
    }

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport(0, 0, texSize, texSize);
    gl.activeTexture( gl.TEXTURE0 );

    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

    gl.bindTexture(gl.TEXTURE_2D, texture2);

    //
    //  Load shaders and initialize attribute buffers
    //

    program1 = initShaders( gl, "vertex-shader1", "fragment-shader1" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    program3 = initShaders( gl, "vertex-shader3", "fragment-shader3" );


    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);
    framebuffer.width = texSize;
    framebuffer.height = texSize;

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) alert('Framebuffer Not Complete');

    buffer1 = gl.createBuffer();
    buffer2 = gl.createBuffer();
    buffer3 = gl.createBuffer();

    gl.useProgram(program2);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, 32, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, 32, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, texCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
    gl.bufferData(gl.ARRAY_BUFFER, 192, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, points);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);

    document.getElementById("slider").onchange = function() {
        diffuse = event.srcElement.value;
        init();
    };

    // buffers and vertex arrays

    gl.useProgram(program3);
    vPosition3 = gl.getAttribLocation( program3, "vPosition3" );
    gl.enableVertexAttribArray( vPosition3 );
    gl.vertexAttribPointer( vPosition3, 2, gl.FLOAT, false, 0,0 );

    gl.useProgram(program1);

    vPosition1 = gl.getAttribLocation( program1, "vPosition1" );
    gl.enableVertexAttribArray( vPosition1 );
    gl.vertexAttribPointer( vPosition1, 2, gl.FLOAT, false, 0,0 );

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    var vTexCoord = gl.getAttribLocation( program1, "vTexCoord");
    gl.enableVertexAttribArray( vTexCoord );
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0,0 );
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);

    gl.uniform1i( gl.getUniformLocation(program1, "texture"), 0 );
    gl.uniform1f( gl.getUniformLocation(program1, "d"), 1/texSize );
    gl.uniform1f( gl.getUniformLocation(program1, "s"), diffuse );

    gl.bindTexture(gl.TEXTURE_2D, texture2);

    render();
}

var render = function(){

   // render to texture

    gl.useProgram(program1);

    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

    if(flag) {
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2, 0);

    }
    else {
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);

    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.useProgram(program2);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
    gl.vertexAttribPointer( vPosition2, 2, gl.FLOAT, false, 0, 0);

// draw surrounding area in black

    gl.uniform4f( gl.getUniformLocation(program2, "color"), 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);


    gl.useProgram(program1);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.vertexAttribPointer( texLoc, 2, gl.FLOAT, false, 0, 0);
    //gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);


// render to display

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    if(flag) gl.bindTexture(gl.TEXTURE_2D, texture2);
      else gl.bindTexture(gl.TEXTURE_2D, texture1);

    var r = 1024/texSize;
    gl.viewport(0, 0, r*texSize, r*texSize);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );



// swap textures

    flag = !flag;

    requestAnimFrame(render);
}
