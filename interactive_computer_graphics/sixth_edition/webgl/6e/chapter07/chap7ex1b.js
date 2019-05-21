

var canvas;
var gl;

var NumVertices  = 36;

var texSize = 64;

var image1 = new ArrayBuffer(4*texSize*texSize);

var image2 = new Uint8Array(image1);

    // Create a checkerboard pattern
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j < texSize; j++ ) {
            var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0)) * 255;
            image2[4*i*texSize+4*j] = c;
            image2[4*i*texSize+4*j+1] = c;
            image2[4*i*texSize+4*j+2] = c;
            image2[4*i*texSize+4*j+3] = 255;
        }
    }


var pointsArray = new Array(NumVertices);
var colorsArray = new Array(NumVertices);
var texCoordsArray = new Array(NumVertices);

var texCoord = new Array(4);

    texCoord[0] = [0, 0];
    texCoord[1] = [0, 1];
    texCoord[2] = [1, 1];
    texCoord[3] = [1, 0];

var vertices = new Array(8);

    vertices[0] = [ -0.5, -0.5,  0.5, 1.0 ];
    vertices[1] = [ -0.5,  0.5,  0.5, 1.0 ];
    vertices[2] = [ 0.5,  0.5,  0.5, 1.0 ];
    vertices[3] = [ 0.5, -0.5,  0.5, 1.0 ];
    vertices[4] = [ -0.5, -0.5, -0.5, 1.0 ];
    vertices[5] = [ -0.5,  0.5, -0.5, 1.0 ];
    vertices[6] = [ 0.5,  0.5, -0.5, 1.0 ];
    vertices[7] = [ 0.5, -0.5, -0.5, 1.0 ];

var vertex_colors = new Array(8);

    vertex_colors[0] = [ 0.0, 0.0, 0.0, 1.0 ];  // black
    vertex_colors[1] = [ 1.0, 0.0, 0.0, 1.0 ];  // red
    vertex_colors[2] = [ 1.0, 1.0, 0.0, 1.0 ];  // yellow
    vertex_colors[3] = [ 0.0, 1.0, 0.0, 1.0 ];  // green
    vertex_colors[4] = [ 0.0, 0.0, 1.0, 1.0 ];  // blue
    vertex_colors[5] = [ 1.0, 0.0, 1.0, 1.0 ];  // magenta
    vertex_colors[6] = [ 0.0, 1.0, 1.0, 1.0 ];  // white
    vertex_colors[7] = [ 0.0, 1.0, 1.0, 1.0 ];   // cyan
    
var image = new Float32Array(texSize*texSize);
for(var i = 0; i<texSize*texSize; i++) image[i] = 1.0;

window.onload = init;


var Xaxis = 0;
var Yaxis = 1;
var Zaxis = 2;
var Axis = 0;
var Theta = new Array(3);

Theta = [45.0, 45.0, 45.0];

var ThetaId;

var Index = 0;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}




function quad(a, b, c, d) {
     pointsArray[Index] = point4.create(vertices[a]); 
     colorsArray[Index] = color4.create(vertex_colors[a]); 
     texCoordsArray[Index] = vec2.create(texCoord[0]);
     Index++;
     pointsArray[Index] = point4.create(vertices[b]); 
     colorsArray[Index] = color4.create(vertex_colors[a]);
     texCoordsArray[Index] = vec2.create(texCoord[1]); 
     Index++;
     pointsArray[Index] = point4.create(vertices[c]); 
     colorsArray[Index] = color4.create(vertex_colors[a]);
     texCoordsArray[Index] = vec2.create(texCoord[2]); 
     Index++;    
     pointsArray[Index] = point4.create(vertices[a]); 
     colorsArray[Index] = color4.create(vertex_colors[a]);
     texCoordsArray[Index] = vec2.create(texCoord[0]); 
     Index++;
     pointsArray[Index] = point4.create(vertices[c]); 
     colorsArray[Index] = color4.create(vertex_colors[a]);
     texCoordsArray[Index] = vec2.create(texCoord[2]); 
     Index++;
     pointsArray[Index] = point4.create(vertices[d]); 
     colorsArray[Index] = color4.create(vertex_colors[a]);
     texCoordsArray[Index] = vec2.create(texCoord[3]); 
     Index++;    
}


function color_cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    color_cube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    
    var tBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTex = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTex );

    configureTexture(image2);

    thetaId = gl.getUniformLocation(program, "theta"); 
    

var a = document.getElementById("Button1")
a.addEventListener("click", function(){Axis = Xaxis;}, false);
var b = document.getElementById("Button2")
b.addEventListener("click", function(){Axis = Yaxis;}, false);
var c = document.getElementById("Button3")
c.addEventListener("click", function(){Axis = Zaxis;}, false);
       
                       
    render();
 
}

var render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Theta[Axis] += 2.0;
            gl.uniform3fv(thetaId, Theta);
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            requestAnimFrame(render);
        }
