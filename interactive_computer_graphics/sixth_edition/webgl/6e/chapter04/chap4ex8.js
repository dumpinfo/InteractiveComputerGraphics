

var canvas;
var gl;

var pointsArray = new Array(4);

var zNear = -4;
var zFar = 4;

var theta  = 0.0;

var left = -4.0;
var right = 4.0;
var ytop =4.0;
var bottom = -4.0;

var mvMatrix, pMatrix;
var modelViewId, projectionId;

var colorLoc;

var eye, at, up;
var light, nlight;

var m;

var red;
var black;

//var eye2;

window.onload = init;



function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    mvMatrix = mat4.create();
    pMatrix = mat4.create();
    
    light = vec3.create([0.0, 2.0, 0.0]);
    lightn = vec3.create([0.0, -2.0, 0.0]);
    
    m = mat4.create();
    mat4.identity(m);
    m[15] = 0.0;
    m[7] = -1/light[1];

    
    at = vec3.create([0.0, 0.0, 0.0]);
    up = vec3.create([0.0, 1.0, 0.0]);
    eye = vec3.create([1.0, 1.0, 1.0]);
    
    
    red = vec4.create([1.0, 0.0, 0.0, 1.0]);
    black = vec4.create([0.0, 0.0, 0.0, 1.0]);
    
    pointsArray[0] = point4.create([ -0.5, 0.5,  -0.5, 1.0 ]);     
    pointsArray[1] = point4.create([ -0.5,  0.5,  0.5, 1.0 ]);  
    pointsArray[2] = point4.create([ 0.5, 0.5,  0.5, 1.0 ]);
    pointsArray[3] = point4.create([ 0.5,  0.5,  -0.5, 1.0 ]);                  

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    
    colorLoc = gl.getUniformLocation(program, "fcolor");
 
    modelViewId = gl.getUniformLocation( program, "model_view" );
    projectionId = gl.getUniformLocation( program, "projection" );
    
    pMatrix = mat4.ortho(left, right, bottom, ytop, zNear, zFar);
    gl.uniformMatrix4fv( projectionId, false, pMatrix );
        
    render();
 
}


var render = function() {

        theta += 0.1;
        if(theta > 2*Math.PI) theta -= 2*Math.PI;
        
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        

        mvMatrix = mat4.lookAt(eye, at, up);

        gl.uniformMatrix4fv( modelViewId, false, mvMatrix );

        
        gl.uniform4fv(colorLoc, red);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
        light[0] = Math.sin(theta);
        light[2] = Math.cos(theta);
        
        vec3.negate(light, lightn);

        mat4.translate(mvMatrix, light);
        mat4.multiply(mvMatrix, m);
        mat4.translate(mvMatrix, lightn);
    
        
        gl.uniformMatrix4fv( modelViewId, false, mvMatrix );
        
        gl.uniform4fv(colorLoc, black);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        requestAnimFrame(render);
    }
