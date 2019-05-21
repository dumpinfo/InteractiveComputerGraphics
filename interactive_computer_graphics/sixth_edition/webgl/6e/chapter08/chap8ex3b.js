

var canvas;
var gl;
var program;

var projection; 
var modelView;

var instance;

var modelViewId;

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

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;


var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var numNodes = 10;
var numAngles = 11;
var angle = 0;
var theta = new Float32Array(numAngles);
theta = [0, 0, 0, 0, 0, 0, Math.PI, 0, Math.PI, 0, 0];

var numVertices = 24;

var stack = [];

var figure = new Array(numNodes);
for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBufferId, cBuffer;

var Index = 0;

var pointsArray = new Array(numVertices);

function PrintMatrix(m) {

    console.log(m[0] +' '+ m[1] +' ' + m[2] +' ' +m[3] + '\n '+
    m[4] +' ' +m[5] +' ' +m[6] +' ' +m[7] + ' \n'+
    m[8] +' ' +m[9] +' '+ m[10] +' '+ m[11] + '\n '+
    m[12] +' '+ m[13] +' '+ m[14] +' '+ m[15]);

}

function pushMatrix(s, m) {

    for(var i = 0; i<16; i++) s.push(m[i]);
}

function popMatrix(s, m) {

    for(var i=0; i<16; i++) m[15 -i] = s.pop();
}



function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4.create();
    
    switch(Id) {
    
    case torsoId:
    
    mat4.identity(m);
    mat4.rotateY( m, theta[torsoId] );
    figure[torsoId] = createNode( null, torso, null, headId );
    figure[torsoId].transform = mat4.create();
    mat4.set(m, figure[torsoId].transform);
    break;

    case headId: 
    case head1Id: 
    case head2Id:
    
    mat4.identity(m); 
    mat4.translate(m, [0.0, torsoHeight+0.5*headHeight, 0.0]);
	mat4.rotateX(m, theta[head1Id])
	mat4.rotateY(m, theta[head2Id]);
    mat4.translate(m, [0.0, -0.5*headHeight, 0.0]);
    figure[headId] = createNode( null, head, leftUpperArmId, null);
    figure[headId].transform = mat4.create();
    mat4.set(m, figure[headId].transform);
    break;
    
    
    case leftUpperArmId:
    
    mat4.identity(m);
    mat4.translate(m, [-(torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0]);
	mat4.rotateX(m, theta[leftUpperArmId]);
    figure[leftUpperArmId] = createNode( null, leftUpperArm, rightUpperArmId, leftLowerArmId );
    figure[leftUpperArmId].transform = mat4.create();
    mat4.set(m, figure[leftUpperArmId].transform);
    break;

    case rightUpperArmId:
    
    mat4.identity(m);
    mat4.translate(m,[torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0]);
	mat4.rotateX(m, theta[rightUpperArmId]);
    figure[rightUpperArmId] = createNode( null, rightUpperArm, leftUpperLegId, rightLowerArmId );
    figure[rightUpperArmId].transform = mat4.create();
    mat4.set(m, figure[rightUpperArmId].transform);
    break;

    
    case leftUpperLegId:
    
    mat4.identity(m);
    mat4.translate(m, [-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0]);
	mat4.rotateX(m, theta[leftUpperLegId]);
    figure[leftUpperLegId] = createNode( null, leftUpperLeg,rightUpperLegId, leftLowerLegId );
    figure[leftUpperLegId].transform = mat4.create();
    mat4.set(m, figure[leftUpperLegId].transform);
    break;

    case rightUpperLegId:
    
    mat4.identity(m);
    mat4.translate(m, [torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0]);
	mat4.rotateX(m, theta[rightUpperLegId]);
    figure[rightUpperLegId] = createNode( null, rightUpperLeg, null, rightLowerLegId );
    figure[rightUpperLegId].transform = mat4.create();
    mat4.set(m, figure[rightUpperLegId].transform);
    break;
    
    case leftLowerArmId:

    mat4.identity(m);
    mat4.translate(m, [0.0, upperArmHeight, 0.0]);
    mat4.rotateX(m, theta[leftLowerArmId]);
    figure[leftLowerArmId] = createNode( null, leftLowerArm, null, null );
    figure[leftLowerArmId].transform = mat4.create();
    mat4.set(m, figure[leftLowerArmId].transform);
    break;
    
    case rightLowerArmId:

    mat4.identity(m);
    mat4.translate(m, [0.0, upperArmHeight, 0.0]);
    mat4.rotateX(m, theta[rightLowerArmId]);
    figure[rightLowerArmId] = createNode( null, rightLowerArm, null, null );
    figure[rightLowerArmId].transform = mat4.create();
    mat4.set(m, figure[rightLowerArmId].transform);
    break;
    
    case leftLowerLegId:

    mat4.identity(m);
    mat4.translate(m, [0.0, upperLegHeight, 0.0]);
    mat4.rotateX(m, theta[leftLowerLegId]);
    figure[leftLowerLegId] = createNode( null, leftLowerLeg, null, null );
    figure[leftLowerLegId].transform = mat4.create();
    mat4.set(m, figure[leftLowerLegId].transform);
    break;
    
    case rightLowerLegId:

    mat4.identity(m);
    mat4.translate(m, [0.0, upperLegHeight, 0.0]);
    mat4.rotateX(m, theta[rightLowerLegId]);
    figure[rightLowerLegId] = createNode( null, rightLowerLeg, null, null );
    figure[rightLowerLegId].transform = mat4.create();
    mat4.set(m, figure[rightLowerLegId].transform);
    break;
    
    }

}

function traverse(Id) {
   
   if(Id == null) return;
   pushMatrix(stack, modelView); 
   mat4.multiply(modelView, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    popMatrix(stack, modelView);
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}



function torso() {

    mat4.set(modelView, instance);
    mat4.translate(instance,[0.0, 0.5*torsoHeight, 0.0] );
    mat4.scale( instance, [torsoWidth, torsoHeight, torsoWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function head() {

    mat4.set(modelView, instance)   
    mat4.translate(instance,  [0.0, 0.5 * headHeight, 0.0] );
	mat4.scale( instance, [headWidth, headHeight, headWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}


function leftUpperArm() {

    mat4.set(modelView, instance);
    mat4.translate(instance,  [0.0, 0.5 * upperArmHeight, 0.0] );
	mat4.scale( instance, [upperArmWidth, upperArmHeight, upperArmWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function leftLowerArm() {

    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * lowerArmHeight, 0.0] );
	mat4.scale( instance, [lowerArmWidth, lowerArmHeight, lowerArmWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function rightUpperArm() {

    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * upperArmHeight, 0.0] );
	mat4.scale( instance, [upperArmWidth, upperArmHeight, upperArmWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function rightLowerArm() {


    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * lowerArmHeight, 0.0] );
	mat4.scale( instance, [lowerArmWidth, lowerArmHeight, lowerArmWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function  leftUpperLeg() {

    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * upperLegHeight, 0.0] );
	mat4.scale( instance, [upperLegWidth, upperLegHeight, upperLegWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function leftLowerLeg() {
    
    mat4.set(modelView, instance)
    mat4.translate(instance, [ 0.0, 0.5 * lowerLegHeight, 0.0] );
	mat4.scale( instance, [lowerLegWidth, lowerLegHeight, lowerLegWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function rightUpperLeg() {
    
    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * upperLegHeight, 0.0] );
	mat4.scale( instance, [upperLegWidth, upperLegHeight, upperLegWidth] );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function rightLowerLeg() {

    mat4.set(modelView, instance)
    mat4.translate(instance,  [0.0, 0.5 * lowerLegHeight, 0.0] );
	mat4.scale( instance, [lowerLegWidth, lowerLegHeight, lowerLegWidth] )
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "ModelView"), false, instance);
    for(var i =0; i<6; i++) gl.drawArrays(gl.LINE_LOOP, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray[Index] = point4.create(vertices[a]); Index++;
     pointsArray[Index] = point4.create(vertices[b]); Index++;
     pointsArray[Index] = point4.create(vertices[c]); Index++;    
     pointsArray[Index] = point4.create(vertices[d]); Index++;    
}


function cube()
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
    //gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    gl.useProgram( program );

    instance = mat4.create();
    mat4.identity(instance);
    
    projection = mat4.create();
    mat4.ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0, projection);
    modelView = mat4.create();
    mat4.identity(modelView);

        
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "ModelView" ), false, modelView );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "Projection" ), false, projection );
    
    cube();
        
    vBufferId = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );
    
    var b1 = document.getElementById("Button1")
    b1.addEventListener("click", 
        function(){
            theta[angle] -= 0.1 
            initNodes(angle);
        }, 
        false);
    
    var b2 = document.getElementById("Button2")
    b2.addEventListener("click", 
        function(){
            theta[angle] += 0.1 
            initNodes(angle);
        }, 
        false);
    
    var m = document.getElementById("mymenu");
          
    m.addEventListener("click", function() {
       switch(m.selectedIndex) {
         case 0:
          angle = torsoId;
          break;
         case 1:
          angle = head1Id;
          break;
        case 2:
          angle = head2Id;
          break;
        case 3:
          angle = rightUpperArmId;
          break;
        case 4:
          angle = leftUpperArmId;
          break;
        case 5:
          angle = rightUpperLegId;
          break;
        case 6:
          angle = leftUpperLegId;
          break;
        case 7:
          angle = rightLowerArmId;
          break;
        case 8:
          angle = leftLowerArmId;
          break;
        case 9:
          angle = rightLowerLegId;
          break;
        case 10:
          angle = leftLowerLegId;
          break;
          }
        }, false);
    
    for(i=0; i<numNodes; i++) initNodes(i);
    
    render();
}



var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
        mat4.identity(modelView);
        traverse(torsoId);
        requestAnimFrame(render);
}
