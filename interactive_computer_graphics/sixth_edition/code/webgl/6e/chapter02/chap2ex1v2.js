

var canvas;
var gl;
var NumPoints = 5000;

window.onload = init;

function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    var vertices2 = new Array(3);
    vertices2[0] = point2.create([-1, -1]);
    vertices2[1] = point2.create([0, 1]);
    vertices2[2] = point2.create([1, -1]);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "shaders/vshader22.glsl", "shaders/fshader22.glsl" );
    gl.useProgram( program );

    
    var pointsArray = new Array(NumPoints);
    pointsArray[0] = vec2.create([0.25,0.50]);
    

    for (i = 1; i < NumPoints; i++) {
        j = Math.floor(Math.random() * 3);
        
        pointsArray[i] = point2.create();
        point2.add(pointsArray[i-1], vertices2[j], pointsArray[i]);
        point2.scale(pointsArray[i], 0.5);
    }
    
    
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
    gl.drawArrays( gl.POINTS, 0, NumPoints );

    window.requestAnimFrame( render, canvas );


}
