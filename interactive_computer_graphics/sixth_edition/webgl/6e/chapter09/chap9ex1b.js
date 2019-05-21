

var canvas;
var gl;

var numVertices  = 24;
var maxNumParticles = 1000;
var initialNumParticles = 25;
var initialPointSize = 5;
var initialSpeed = 0.01;
var numColors = 8;

var program;

var time = 0;
var dt = 1;

var numParticles = initialNumParticles;
var pointSize = initialPointSize;
var speed = initialSpeed;
var gravity = false;
var elastic = false;
var repulsion = false;
var coef = 1.0;


var pointsArray = new Array(numVertices+maxNumParticles);
var colorsArray = new Array(numVertices+maxNumParticles);

for(i=0; i<numVertices+maxNumParticles; i++) {
    pointsArray[i] = [0, -0, 0, 1];
    colorsArray = [0, 0, 0, 1];
    }


var projection, modelView;
var eye;
var at;
var up;

var vertices = new Array(8);

    vertices[0] = [ -1.1, -1.1,  1.1, 1.0 ];
    vertices[1] = [ -1.1,  1.1,  1.1, 1.0 ];
    vertices[2] = [ 1.1,  1.1,  1.1, 1.0 ];
    vertices[3] = [ 1.1, -1.1,  1.1, 1.0 ];
    vertices[4] = [ -1.1, -1.1, -1.1, 1.0 ];
    vertices[5] = [ -1.1,  1.1, -1.1, 1.0 ];
    vertices[6] = [ 1.1,  1.1, -1.1, 1.0 ];
    vertices[7] = [ 1.1, -1.1, -1.1, 1.0 ];

var vertex_colors = new Array(8);

    vertex_colors[0] = [ 0.0, 0.0, 0.0, 1.0 ];  // black
    vertex_colors[1] = [ 1.0, 0.0, 0.0, 1.0 ];  // red
    vertex_colors[2] = [ 1.0, 1.0, 0.0, 1.0 ];  // yellow
    vertex_colors[3] = [ 0.0, 1.0, 0.0, 1.0 ];  // green
    vertex_colors[4] = [ 0.0, 0.0, 1.0, 1.0 ];  // blue
    vertex_colors[5] = [ 1.0, 0.0, 1.0, 1.0 ];  // magenta
    vertex_colors[6] = [ 1.0, 1.0, 1.0, 1.0 ];  // white
    vertex_colors[7] = [ 0.0, 1.0, 1.0, 1.0 ];   // cyan

window.onload = init;


function particle(){

    var p ={};
    p.color = [1, 1, 0, 0];
    p.position = [0, 0, 0, 0];
    p.velocity = [0, 0, 0, 0];
    p.mass = 1;
    
    return p;
}

particleSystem = new Array(maxNumParticles);

for(var i = 0; i< maxNumParticles; i++) particleSystem[i] =  particle();

var presentTime, lastTime;


var d2 = new Array(maxNumParticles)
for(var i=0; i<maxNumParticles; i++) d2[i] =  new Float32Array(maxNumParticles);


var Index = 0;


function quad(a, b, c, d) {
     pointsArray[Index] = point4.create(vertices[a]); colorsArray[Index] = color4.create(vertex_colors[0]); Index++;
     pointsArray[Index] = point4.create(vertices[b]); colorsArray[Index] = color4.create(vertex_colors[0]); Index++;
     pointsArray[Index] = point4.create(vertices[c]); colorsArray[Index] = color4.create(vertex_colors[0]); Index++;    
     pointsArray[Index] = point4.create(vertices[d]); colorsArray[Index] = color4.create(vertex_colors[0]); Index++;    
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
    

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    gl.useProgram( program );
    
    eye =  point3.create([1.5, 1.0, 1.0]);
    at = point3.create([0.0, 0.0, 0.0]);
    up = vec3.create([0.0, 1.0, 0.0]);
    
    modelView = mat4.create();
    projection = mat4.create();
    mat4.lookAt(eye, at, up, modelView);
    mat4.ortho(-2.0,2.0,-2.0,2.0,-4.0,4.0, projection);
        
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "ModelView" ), false, modelView );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "Projection" ), false, projection );

    color_cube();
    
    // set up particles with random locations and velocities 
        
    for ( var i = 0; i < numParticles; i++ ) {
        particleSystem[i].mass = 1.0;
        particleSystem[i].color = vertex_colors[i % numColors];
        for ( var j = 0; j < 3; j++ ) {
            particleSystem[i].position[j] = 2.0 * Math.random() - 1.0;
            particleSystem[i].velocity[j] = speed * 2.0 * Math.random() - 1.0;
        }
        particleSystem[i].position[3] = 1.0;
    }
    
    for(var i =0; i<numParticles; i++) {
       pointsArray[i+numVertices] = point4.create(particleSystem[i].position);
       colorsArray[i+numVertices] = point4.create(particleSystem[i].color);
       }
       
    //alert(pointsArray[numVertices][0]);

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBufferId = gl.createBuffer();
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    

    var b1 = document.getElementById("Button1")
    b1.addEventListener("click", function(){doubleNumParticles();}, false);
    
    var b2 = document.getElementById("Button2")
    b2.addEventListener("click", function(){numParticles /= 2;}, false);
    
    var b3 = document.getElementById("Button3")
    b3.addEventListener("click", function(){speed *=2;}, false);
    
    var b4 = document.getElementById("Button4")
    b4.addEventListener("click", function(){speed /= 2;}, false);
    
    var b5 = document.getElementById("Button5")
    b5.addEventListener("click", function(){pointSize *= 2;gl.uniform1f(gl.getUniformLocation(program, "PointSize"), pointSize);}, false);
    
    var b6 = document.getElementById("Button6")
    b6.addEventListener("click", function(){pointSize /= 2;gl.uniform1f(gl.getUniformLocation(program, "PointSize"), pointSize);}, false);
    
    var b7 = document.getElementById("Button7")
    b7.addEventListener("click", function(){gravity = !gravity;}, false);
    
    var b8 = document.getElementById("Button8")
    b8.addEventListener("click", function(){elastic = !elastic; }, false);
    
    var b9 = document.getElementById("Button9")
    b9.addEventListener("click", function(){repulsion = !repulsion; }, false);
       
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    
    gl.uniform1f(gl.getUniformLocation(program, "PointSize"), pointSize); 

                       
    render();
 
}

var doubleNumParticles = function(){
        
    if(2*numParticles > maxNumParticles) return;
    for ( var i = 0; i < 2*numParticles; i++ ) {
        particleSystem[i].mass = 1.0;
        particleSystem[i].color = vertex_colors[i % numColors];
        for ( var j = 0; j < 3; j++ ) {
            particleSystem[i].position[j] = 2.0 * Math.random() - 1.0;
            particleSystem[i].velocity[j] = speed * 2.0 * Math.random() - 1.0;
        }
        particleSystem[i].position[3] = 1.0;;
    }
    
       numParticles *= 2;

       update();
}

var forces = function(  ParticleI,  ParticleJ )
{
    var ParticleK;
    var force = 0.0;
    if ( gravity && ParticleJ == 1 )
        force = -1.0;           /* simple gravity */
    if ( repulsion )
        for ( var ParticleK = 0; ParticleK < numParticles; ParticleK++ ) { /* repulsive force */
            if ( ParticleK != ParticleI )
                force +=
                    0.001 * ( particleSystem[ParticleI].position[ParticleJ] -
                              particleSystem[ParticleK].position[ParticleJ] ) / ( 0.001 + d2[ParticleI][ParticleK] );
        }
    return ( force );
}

var collision = function(particleId)

/* tests for collisions against cube and reflect particles if necessary */
{
    if(elastic) coef = 0.9; else coef = 1.0;
    for (var i = 0; i < 3; i++ ) {
        if ( particleSystem[particleId].position[i] >= 1.0 ) {
            particleSystem[particleId].velocity[i] = -coef * particleSystem[particleId].velocity[i];
            particleSystem[particleId].position[i] =
                1.0 - coef * ( particleSystem[particleId].position[i] - 1.0 );
        }
        if ( particleSystem[particleId].position[i] <= -1.0 ) {
            particleSystem[particleId].velocity[i] = -coef * particleSystem[particleId].velocity[i];
            particleSystem[particleId].position[i] =
                -1.0 - coef * ( particleSystem[particleId].position[i] + 1.0 );
        }
    }
}


var update = function(){
    var i,j,k;
    for ( i = 0; i < numParticles; i++ ) {
        for ( j = 0; j < 3; j++ ) {
            particleSystem[i].position[j] += dt * particleSystem[i].velocity[j];
            particleSystem[i].velocity[j] +=
                dt * forces( i, j ) / particleSystem[i].mass;
        }
        collision( i );
    }
    //repulsion = false;
    if ( repulsion )
        for ( i = 0; i < numParticles; i++ )
            for ( k = 0; k < i; k++ ) {
                d2[i][k] = 0.0;
                for ( j = 0; j < 3; j++ )
                    d2[i][k] += ( particleSystem[i].position[j] -
                                  particleSystem[k].position[j] ) *
                        ( particleSystem[i].position[j] -
                          particleSystem[k].position[j] );
                d2[k][i] = d2[i][k];
            }
    
    for(var i =0; i<numParticles; i++) {
       pointsArray[i+numVertices] = point4.create(particleSystem[i].position);
       colorsArray[i+numVertices] = point4.create(particleSystem[i].color);
       }

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
    

}

var render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT );
            update();
            for ( var i = 0; i < 6; i++ ) gl.drawArrays( gl.LINE_LOOP, i * 4, 4 );
            gl.drawArrays(gl.POINTS, numVertices, numParticles);
            requestAnimFrame(render);
        }
