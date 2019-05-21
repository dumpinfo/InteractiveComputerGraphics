

var canvas;
var gl;

var NumVertices  = 36;

var pointsArray = new Array(NumVertices);
var normalsArray = new Array(NumVertices);

var vertices = new Array(8);

    vertices[0] = [ -0.5, -0.5,  0.5, 1.0 ];
    vertices[1] = [ -0.5,  0.5,  0.5, 1.0 ];
    vertices[2] = [ 0.5,  0.5,  0.5, 1.0 ];
    vertices[3] = [ 0.5, -0.5,  0.5, 1.0 ];
    vertices[4] = [ -0.5, -0.5, -0.5, 1.0 ];
    vertices[5] = [ -0.5,  0.5, -0.5, 1.0 ];
    vertices[6] = [ 0.5,  0.5, -0.5, 1.0 ];
    vertices[7] = [ 0.5, -0.5, -0.5, 1.0 ];

window.onload = init;

var ctm;
var ambient_color, diffuse_color, specular_color;
var model_view, projection;
var viewer_pos;
var program;

var Xaxis = 0;
var Yaxis = 1;
var Zaxis = 2;
var Axis = 0;
var Theta = new Array(3);

Theta = [45.0, 45.0, 45.0];

var ThetaId;

var Index = 0;


function quad(a, b, c, d) {

     var normal = vec4.create();
     var t1 = vec4.create();
     var t2 = vec4.create();
     vec4.subtract(vertices[b], vertices[a], t1);
     vec4.subtract(vertices[c], vertices[b], t2);
     vec3.cross(t1, t2, normal);
     vec4.normalize(normal);

     pointsArray[Index] = point4.create(vertices[a]); normalsArray[Index] = vec4.create(normal); Index++;
     pointsArray[Index] = point4.create(vertices[b]); normalsArray[Index] = vec4.create(normal); Index++;
     pointsArray[Index] = point4.create(vertices[c]); normalsArray[Index] = vec4.create(normal); Index++;    
     pointsArray[Index] = point4.create(vertices[a]); normalsArray[Index] = vec4.create(normal); Index++;
     pointsArray[Index] = point4.create(vertices[c]); normalsArray[Index] = vec4.create(normal); Index++;
     pointsArray[Index] = point4.create(vertices[d]); normalsArray[Index] = vec4.create(normal); Index++;    
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    color_cube();

    var nBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    var vNormalId = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormalId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormalId );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPosId = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosId, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosId );

    thetaId = gl.getUniformLocation(program, "theta"); 
    
    viewer_pos = point3.create([ 0.0, 0.0, -20.0] );

    projection = mat4.ortho(-1, 1, -1, 1, -100, 100);
    
    var light_position = point4.create([1.0, 1.0, 1.0, 0.0] );
    var light_ambient = point4.create([0.2, 0.2, 0.2, 1.0 ]);
    var light_diffuse = point4.create([ 1.0, 1.0, 1.0, 1.0 ]);
    var light_specular = point4.create([ 1.0, 1.0, 1.0, 1.0 ]);

    var material_ambient = point4.create([ 1.0, 0.0, 1.0, 1.0] );
    var material_diffuse = point4.create([ 1.0, 0.8, 0.0, 1.0] );
    var material_specular = point4.create([ 1.0, 0.8, 0.0, 1.0] );
    var material_shininess = 100.0;

    var ambient_product = point4.create();
    var diffuse_product = point4.create();
    var specular_product = point4.create();
    
    
    point4.mult(light_ambient, material_ambient,  ambient_product);
    point4.mult(light_diffuse, material_diffuse, diffuse_product);
    point4.mult(light_specular, material_specular, specular_product);


    var a = document.getElementById("Button1")
    a.addEventListener("click", function(){Axis = Xaxis;}, false);
    var b = document.getElementById("Button2")
    b.addEventListener("click", function(){Axis = Yaxis;}, false);
    var c = document.getElementById("Button3")
    c.addEventListener("click", function(){Axis = Zaxis;}, false);

    var d = document.getElementById("gl-canvas");
    //d.addEventListener("click", function(){alert("click");}, false);
    d.addEventListener("mousedown", function(){if(event.button==0) Axis = Xaxis;else if(event.button==1) Axis = Yaxis; else Axis = Zaxis;}, false);
    //d.addEventListener("click", function(){if(event.altKey) Axis = Zaxis;else if(event.shiftKey) Axis = Yaxis; else Axis = Xaxis;}, false);
    gl.uniform4fv( gl.getUniformLocation(program, "AmbientProduct"),ambient_product );
    gl.uniform4fv( gl.getUniformLocation(program, "DiffuseProduct"),diffuse_product );
    gl.uniform4fv( gl.getUniformLocation(program, "SpecularProduct"),specular_product );	
    gl.uniform4fv( gl.getUniformLocation(program, "LightPosition"),light_position );
    gl.uniform1f( gl.getUniformLocation(program, "Shininess"),material_shininess );
    
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "Projection"), false, projection);
                       
    render();
 
}


var render = function(){
            

            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Theta[Axis] += 0.05;
            
            model_view = mat4.create();
            mat4.identity(model_view);
 
            mat4.rotateX(model_view, Theta[Xaxis] );
            mat4.rotateY(model_view, Theta[Yaxis] );
            mat4.rotateZ(model_view, Theta[Zaxis] );
    
            gl.uniformMatrix4fv( gl.getUniformLocation(program, "ModelView"), false, model_view );

            gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
            
            
            requestAnimFrame(render);
        }
