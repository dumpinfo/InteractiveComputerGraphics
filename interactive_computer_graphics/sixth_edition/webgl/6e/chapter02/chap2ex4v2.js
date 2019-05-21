

var canvas;
var gl;

var NumTimesToSubdivide = 3;
var NumTetrahedrons = 64;
var NumTriangles = 4*NumTetrahedrons;  
var NumVertices  = 3 * NumTriangles;
var Index = 0;

var pointsArray = new Array(NumVertices);
var colorsArray = new Array(NumVertices);

var base_colors = new Array(4);

base_colors[0] = [1.0, 0.0, 0.0];
base_colors[1] = [0.0, 1.0, 0.0];
base_colors[2] = [0.0, 0.0, 1.0];
base_colors[3] = [0.0, 0.0, 0.0];



window.onload = init;


function triangle(a, b, c, color) {

    
     pointsArray[Index] = vec3.create(a); colorsArray[Index] = vec3.create(base_colors[color]);
     pointsArray[Index+1] = vec3.create(b); colorsArray[Index+1] = vec3.create(base_colors[color]);
     pointsArray[Index+2] = vec3.create(c); colorsArray[Index+2] = vec3.create(base_colors[color]);    
     Index += 3;
}


function tetra( a, b, c, d )
{
    triangle( a, c, b, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
    triangle( b, c, d, 3 );
}

function divideTetra(a, b, c, d, count) {
            if ( count > 0 ) {
                var ab, ac, ad, bc, bd, cd;
                ab = vec3.create();
                ac = vec3.create();
                ad = vec3.create();
                bc = vec3.create();
                bd = vec3.create();
                cd = vec3.create();
                vec3.lerp(a, b, 0.5, ab);
                vec3.lerp(a, c, 0.5, ac);
                vec3.lerp(a, d, 0.5, ad);
                vec3.lerp(b, c, 0.5, bc);
                vec3.lerp(b, d, 0.5, bd);
                vec3.lerp(c, d, 0.5, cd);
                divideTetra( a, ab, ac, ad, count - 1 );
                divideTetra( ab, b, bc, bd, count - 1 );
                divideTetra( ac, bc, c, cd, count - 1 );
                divideTetra( ad, bd, cd, d, count - 1 );
            }
            else { // draw tetrahedron at end of recursion
                tetra( a, b, c, d );
            }
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
    var program = initShaders( gl, "shaders/vshader24.glsl", "shaders/fshader24.glsl" );
    gl.useProgram( program );
    
    var va = vec3.create([0.0, 0.0, -1.0]);
    var vb = vec3.create([0.0, 0.942809, 0.333333]);
    var vc = vec3.create([-0.816497, -0.471405, 0.333333]);
    var vd = vec3.create([0.816497, -0.471405, 0.333333]);
    

    
    divideTetra(va, vb, vc, vd, NumTimesToSubdivide);

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );


    render();

}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    window.requestAnimFrame( render, canvas );


}
