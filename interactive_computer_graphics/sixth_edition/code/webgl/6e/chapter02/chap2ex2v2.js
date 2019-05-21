

var canvas;
var gl;
var NumPoints = 5000;

var NumTimesToSubdivide = 5;
var NumTriangles = 243;  // 3^5 triangles generated
var NumVertices  = 3 * NumTriangles;
var Index = 0;

var pointsArray = new Array(NumVertices);

window.onload = init;

function triangle(a, b, c) {
     pointsArray[Index] = vec2.create(a);
     pointsArray[Index+1] = vec2.create(b);
     pointsArray[Index+2] = vec2.create(c);
     Index += 3;
}

function divideTriangle(a, b, c, count) {
            if ( count > 0 ) {
                var ab = vec2.create();
                var ac = vec2.create();
                var bc = vec2.create();
                vec2.lerp(a, b, 0.5, ab);
                vec2.lerp(a, c, 0.5, ac);
                vec2.lerp(b, c, 0.5, bc);
                divideTriangle( a, ab, ac, count - 1 );
                divideTriangle( c, ac, bc, count - 1 );
                divideTriangle( b, bc, ab, count - 1 );
            }
            else { // draw triangle at end of recursion
                triangle( a, b, c );
            }
        }

function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var vertices2 = new Array(3);
    vertices2[0] = vec2.create([-1, -1]);
    vertices2[1] = vec2.create([0, 1]);
    vertices2[2] = vec2.create([1, -1]);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "shaders/vshader22.glsl","shaders/fshader22.glsl");
    gl.useProgram( program );

    divideTriangle(vertices2[0], vertices2[1], vertices2[2], NumTimesToSubdivide);
    
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    render();

}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    window.requestAnimFrame( render, canvas );


}
