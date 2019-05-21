

var canvas;
var gl;

var NumVertices  = 36;

var pointsArray = new Array(NumVertices);
var colorsArray = new Array(NumVertices);

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
    vertex_colors[6] = [ 1.0, 1.0, 1.0, 1.0 ];  // white
    vertex_colors[7] = [ 0.0, 1.0, 1.0, 1.0 ];   // cyan

var zNear = 0.5;
var zFar = 3.0;
var radius = 3.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var model_viewId, projectionId;
var eye, at, up;

window.onload = init;


var Index = 0;


function quad(a, b, c, d) {
     pointsArray[Index] = point4.create(vertices[a]); colorsArray[Index] = color4.create(vertex_colors[a]); Index++;
     pointsArray[Index] = point4.create(vertices[b]); colorsArray[Index] = color4.create(vertex_colors[b]); Index++;
     pointsArray[Index] = point4.create(vertices[c]); colorsArray[Index] = color4.create(vertex_colors[c]); Index++;    
     pointsArray[Index] = point4.create(vertices[a]); colorsArray[Index] = color4.create(vertex_colors[a]); Index++;
     pointsArray[Index] = point4.create(vertices[c]); colorsArray[Index] = color4.create(vertex_colors[c]); Index++;
     pointsArray[Index] = point4.create(vertices[d]); colorsArray[Index] = color4.create(vertex_colors[d]); Index++;    
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
    
    aspect =  canvas.width/canvas.height;
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    mvMatrix = mat4.create();
    pMatrix = mat4.create();
    at = vec3.create([0.0, 0.0, 0.0]);
    up = vec3.create([0.0, 1.0, 0.0]);
    eye = vec3.create([radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta)]);
    mvMatrix = mat4.lookAt(eye, at , up);
    pMatrix = mat4.perspective(fovy, aspect, zNear, zFar);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "shaders/vshader43.glsl", "shaders/fshader43.glsl" );
    gl.useProgram( program );
    
    color_cube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
 
    model_viewId = gl.getUniformLocation( program, "model_view" );
    projectionId = gl.getUniformLocation( program, "projection" );

    gl.uniformMatrix4fv( model_viewId, false, mvMatrix );
    gl.uniformMatrix4fv( projectionId, false, pMatrix );

var b1 = document.getElementById("Button1")
b1.addEventListener("click", function(){zNear  *= 1.1; zFar *= 1.1;}, false);
var b2 = document.getElementById("Button2")
b2.addEventListener("click", function(){zNear *= 0.9; zFar *= 0.9;}, false);
var b3 = document.getElementById("Button3")
b3.addEventListener("click", function(){radius *= 2.0;}, false);
var b4 = document.getElementById("Button4")
b4.addEventListener("click", function(){radius *= 0.5;}, false);
var b5 = document.getElementById("Button5")
b5.addEventListener("click", function(){theta += dr;}, false);
var b6 = document.getElementById("Button6")
b6.addEventListener("click", function(){theta -= dr;}, false);
var b7 = document.getElementById("Button7")
b7.addEventListener("click", function(){phi += dr;}, false);
var b8 = document.getElementById("Button8")
b8.addEventListener("click", function(){phi -= dr;}, false);
       
                       
    animate();
 
}

var animate = function () {  
        function anim() {
            render();
        }        
        anim();
    }

var render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            eye = vec3.create([radius*Math.sin(theta)*Math.cos(phi), 
                radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta)]);

            mvMatrix = mat4.lookAt(eye, at , up);
            pMatrix = mat4.perspective(fovy, aspect, zNear, zFar);

            gl.uniformMatrix4fv( model_viewId, false, mvMatrix );
            gl.uniformMatrix4fv( projectionId, false, pMatrix );
            
            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            requestAnimFrame(render);
        }
