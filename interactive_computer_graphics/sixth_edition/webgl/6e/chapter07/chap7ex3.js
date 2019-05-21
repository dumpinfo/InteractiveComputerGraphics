

var canvas;
var gl;

var texSize = 256;


var data = new Array()
    for ( var i = 0; i <= texSize; i++ )  data[i] = new Float32Array();
    for ( var i = 0; i <= texSize; i++ ) for ( var j = 0; j<= texSize; j++ ) data[i][j] = 0.0;
    for ( var i = texSize/4; i < 3*texSize/4; i++ ) for ( var j = texSize/4; j < 3*texSize/4; j++ ) data[i][j] = 1.0;
    
var normalst = new Array()
    for ( var i = 0; i < texSize; i++ )  normalst[i] = new Array();
    for ( var i = 0; i < texSize; i++ ) for ( var j = 0; j < texSize; j++ ) normalst[i][j] = new Float32Array(3);
    for ( var i = 0; i < texSize; i++ ) for ( var j = 0; j < texSize; j++ )  {
        normalst[i][j][0] = data[i][j]-data[i+1][j];
        normalst[i][j][1] = data[i][j]-data[i][j+1];
        normalst[i][j][2] = 1;
    }

    for ( var i = 0; i < texSize; i++ ) for ( var j = 0; j < texSize; j++ )  {
    var d = 0;
    for(k=0;k<3;k++) d+=normalst[i][j][k]*normalst[i][j][k];
    d = Math.sqrt(d);
    for(k=0;k<3;k++) normalst[i][j][k]= 0.5*normalst[i][j][k]/d+0.5;
    }
    
    
var image1 = new ArrayBuffer(3*texSize*texSize);

var normals = new Uint8Array(image1);

    for ( var i = 0; i < texSize; i++ ) 
        for ( var j = 0; j < texSize; j++ ) 
           for(var k =0; k<3; k++) 
                normals[3*texSize*i+3*j+k] = 255*normalst[i][j][k];

var NumVertices  = 6;

var pointsArray = new Array(NumVertices);
var texCoordsArray = new Array(NumVertices);

var texCoord = new Array(4);

    texCoord[0] = [0, 0];
    texCoord[1] = [0, 1];
    texCoord[2] = [1, 1];
    texCoord[3] = [1, 0];

var vertices = new Array(4);

    vertices[0] = [ 0.0, 0.0, 0.0, 1.0 ];
    vertices[1] = [ 1.0,  0.0,  0.0, 1.0 ];
    vertices[2] = [ 1.0,  0.0,  1.0, 1.0 ];
    vertices[3] = [ 0.0, 0.0,  1.0, 1.0 ];
    
window.onload = init;

var ctm, projection, normalMatrix;
var eye, at, up;
var normal, tangent;

var light_position;

var program;

var time = 0;

var Index = 0;

function CheckError( msg )  {
    var error = gl.getError();
    if ( error != 0 ) {
        var errMsg = "OpenGL error: " + error.toString(16);

        if ( msg ) { errMsg = msg + "\n" + errMsg; }
        alert( errMsg );
    }
}

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, normals);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}




function mesh() {
     pointsArray[0] = point4.create(vertices[0]); 
     texCoordsArray[0] = vec2.create(texCoord[0]);

     pointsArray[1] = point4.create(vertices[1]); 
     texCoordsArray[1] = vec2.create(texCoord[1]); 

     pointsArray[2] = point4.create(vertices[2]); 
     texCoordsArray[2] = vec2.create(texCoord[2]); 
    
     pointsArray[3] = point4.create(vertices[2]); ;
     texCoordsArray[3] = vec2.create(texCoord[2]); 

     pointsArray[4] = point4.create(vertices[3]); 
     texCoordsArray[4] = vec2.create(texCoord[3]); 

     pointsArray[5] = point4.create(vertices[0]); 
     texCoordsArray[5] = vec2.create(texCoord[0]);   
     
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    eye =  point3.create([2.0, 2.0, 2.0]);
    at = point3.create([0.5, 0.0, 0.5]);
    up = vec3.create([0.0, 1.0, 0.0]);
    
    normal = vec4.create([0.0, 1.0, 0.0, 0.0]);
    tangent = vec3.create([1.0, 0.0, 0.0]);
    
    ctm = mat4.create();
    nm = mat3.create();
    
    projection = mat4.create();
    mat4.lookAt(eye, at, up, ctm);
    mat4.ortho(-0.75,0.75,-0.75,0.75,-5.5,5.5, projection);
    var nm = mat3.create();
    nm = mat4.toInverseMat3(ctm);
    
    mesh();

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    
    
    
    var tBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTex = gl.getAttribLocation( program, "texcoord" );
    gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTex );

    configureTexture(normals);

    light_position = point4.create([0.0, 2.0, 0.0, 1.0] );
    var light_diffuse = point4.create([ 1.0, 1.0, 1.0, 1.0 ]);

    var material_diffuse = point4.create([ 0.7, 0.7, 0.7, 1.0] );

    var diffuse_product = point4.create();
    
    
    point4.mult(light_diffuse, material_diffuse, diffuse_product);

    gl.uniform4fv( gl.getUniformLocation(program, "DiffuseProduct"),diffuse_product );	
    gl.uniform4fv( gl.getUniformLocation(program, "LightPosition"),light_position );
    gl.uniform4fv( gl.getUniformLocation(program, "Normal"),normal );
    gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),tangent );

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "ModelView"), false, ctm);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "Projection"), false, projection);
    gl.uniformMatrix3fv( gl.getUniformLocation(program, "NormalMatrix"), false, nm);
    
    //gl.uniform1i( gl.getUniformLocation(program, "texMap"), 0 );

       
                       
    render();
 
}

    var render = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            
    time += 1;
    light_position[0] = 5.5*Math.sin(0.01*time);
    light_position[2] = 5.5*Math.cos(0.01*time);
    gl.uniform4fv( gl.getUniformLocation(program, "LightPosition"),light_position );
    
    requestAnimFrame(render);
}
