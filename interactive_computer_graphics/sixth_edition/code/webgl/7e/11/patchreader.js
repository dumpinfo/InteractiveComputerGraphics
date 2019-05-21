

var NumTimesToSubdivide = 1;
var PatchesPerSubdivision = 4;
var NumQuadsPerPatch = 64;
// const int NumQuadsPerPatch = (int) pow( PatchesPerSubdivision, NumTimesToSubdivide );
var NumTriangles = 32*64*2;
// const int NumTriangles = ( NumTeapotPatches * NumQuadsPerPatch * 2 /* triangles / quad */ );
var NumVertices = 32*64*2*3;
//     ( NumTriangles * 3 /* vertices / triangle */ );

var Index = 0;

//point4  points[NumVertices];

var points = new Array(1);

onload = init;

//____________________________________________________________________________

printPatch = function(name, p) {

    console.log(name);
    for(var i= 0; i<16; i++) console.log(p[i][0], p[i][1], p[i][2], p[i][3]);
}

printVec = function(name, v) {
    console.log(name, " [",v[0], v[1], v[2], v[3], "]");
}
    

//----------------------------------------------------------------------------


divideCurve = function( c, r , l) {

if(!r) {
           var r = new Array(4);
           for(var i=0; i<4; i++) r[i] = vec4.create();
        }
if(!l)  {
            var l = new Array(4);
            for(i=0; i<4; i++) l[i] = vec4.create();
        }

var t;
if(!mid) var mid = vec4.create();
vec4.addh(c[1], c[2], mid);
vec4.scaleh(mid, 0.5);

//printVec("c[1]", c[1]);
//printVec("c[2]", c[2]);
//printVec("mid", mid);


vec4.set(c[0], l[0]);
vec4.addh(c[0], c[1], l[1]);
vec4.scaleh(l[1], 0.5);

//printVec("l[0]", l[0]);
//printVec("c[1]", c[1]);
//printVec("l[1]", l[1]);

vec4.addh(l[1], mid, l[2]);
vec4.scaleh(l[2], 0.5);

//printVec("l[1]", l[1]);
//printVec("mid", mid);
//printVec("l[2]", l[2]);

vec4.set(c[3], r[3]);
vec4.addh(c[2], c[3], r[2]);
vec4.scaleh(r[2], 0.5);

//printVec("c[2]", c[2]);
//printVec("c[3]", c[3]);
//printVec("r[2]", r[2]);


vec4.addh(r[2], mid, r[1]);
vec4.scaleh(r[1], 0.5);

//printVec("r[2]", r[2]);
//printVec("mid]", mid);
//printVec("r[1]", r[1]);

vec4.addh(l[2], r[1], r[0]);
vec4.scaleh(r[0], 0.5);

vec4.set(r[0], l[3]);

//printVec("l[2]", l[2]);
//printVec("r[1]", r[1]);
//printVec("r[0]", r[0]);
//printVec("l[3]", l[3]);

 
return;
}

//----------------------------------------------------------------------------


drawPatch = function(p) {
    // Draw the quad (as two triangles) bounded by the corners of the
    //   Bezier patch.
    //console.log(Index);
    points[Index++] = vec4.create(p[0]);
//        console.log(points[Index-1]);
    points[Index++] = vec4.create(p[3]);
//        console.log(points[Index-1]);
    points[Index++] = vec4.create(p[15]);
//        console.log(points[Index-1]);
    points[Index++] = vec4.create(p[0]);
//        console.log(points[Index-1]);
    points[Index++] = vec4.create(p[15]);
//        console.log(points[Index-1]);
    points[Index++] = vec4.create(p[12]);
//       console.log(points[Index-1]);

//    console.log(points[Index-1][0]+' '+points[Index-1][1]+' '+points[Index-1][2]+' '+points[Index-1][3]);
    return;
}

//----------------------------------------------------------------------------



transpose = function (p) {

    //console.log("in transpose");
    //printPatch("p", p);
    
    var q = vec4.create();
    vec4.set(p[1], q);
        
    vec4.set(p[4], p[1]);
    vec4.set(q, p[4]); 
    
    vec4.set(p[2], q);
    vec4.set(p[8], p[2]);
    vec4.set(q, p[8]); 
    
    vec4.set(p[3], q);
    vec4.set(p[12], p[3]);
    vec4.set(q, p[12]); 
    
    vec4.set(p[6], q);
    vec4.set(p[9], p[6]);
    vec4.set(q, p[9]); 
    
    vec4.set(p[7], q);
    vec4.set(p[13], p[7]);
    vec4.set(q, p[13]); 
    

    vec4.set(p[11], q);
    vec4.set(p[14], p[11]);
    vec4.set(q, p[14]); 
    
    //console.log("transpose");
    //printPatch("p", p);
    
    return p;
}


dividePatch = function (p, count ) {

    console.log("patch");
    printPatch("p", p);
    console.log("end patch");

console.log(count);
//printPatch("p", p);;

   if ( count > 0 ) {
   
    q = new Array(16);
    r = new Array(16);
    s = new Array(16);
    t = new Array(16);
    a = new Array(16);
    b = new Array(16);
    for(var i=0; i<16; i++) {
        q[i] = vec4.create();
        r[i] = vec4.create();
        s[i] = vec4.create();
        t[i] = vec4.create();
        a[i] = vec4.create();
        b[i] = vec4.create();
    }
//console.log(q);

	// subdivide curves in u direction, transpose results, divide
	// in u direction again (equivalent to subdivision in v)
        var pp = new Array(4);
        var aa = new Array(4);
        var bb = new Array(4);
        for ( var k = 0; k < 4; ++k ) {
                for(var j =0; j<4; j++) pp[j] = vec4.create(p[4*k+j]);
                for(var j =0; j<4; j++) aa[j] = vec4.create();
                for(var j =0; j<4; j++) bb[j] = vec4.create();
                
                //console.log("pp");
                //for(var j=0; j<4; j++) console.log(pp[j]);
                
                divideCurve( pp, aa, bb );
                                
                for(var j =0; j<4; j++) a[4*k+j] = vec4.create(aa[j]);
                for(var j =0; j<4; j++) b[4*k+j] = vec4.create(bb[j]);
              }
        
        //printPatch("before transpose a", a);
        //printPatch("before transpose b", b);
            
    

        transpose( a );
        transpose( b );

        //printPatch("a transpose", b);
        //printPatch("a transpose", b);
        
        //console.log("a^T ");
        //for(var j=0; j<16; j++) console.log(a[j]);
        //console.log("b^T ");
        //for(var j=0; j<16; j++) console.log(b[j]);
        
        for ( var k = 0; k < 4; ++k ) {

            //for(var j=0; j<4; j++) console.log(pp[j]);
            //printVec("pp", pp);
            
            divideCurve( pp, aa, bb );
            for(var j =0; j<4; j++) q[4*k+j] = vec4.create(aa[j]);
            for(var j =0; j<4; j++) r[4*k+j] = vec4.create(bb[j]);
        }
        
        for ( var k = 0; k < 4; ++k ) {
                for(var j =0; j<4; j++) pp[j] = vec4.create(b[4*k+j]);
                divideCurve( pp, aa, bb );
                for(var j =0; j<4; j++) s[4*k+j] = vec4.create(aa[j]);
                for(var j =0; j<4; j++) t[4*k+j] = vec4.create(bb[j]);
        }


	// recursive division of 4 resulting patches
        dividePatch( q, count - 1 );
        dividePatch( r, count - 1 );
        dividePatch( s, count - 1 );
        dividePatch( t, count - 1 );
    }
    else {
        drawPatch( p );
    }
    return;
}
//

//----------------------------------------------------------------------------

function init()  {
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

 //   for ( int n = 0; n < NumTeapotPatches; n++ ) {
//	point4  patch[4][4];


	// Subdivide the patch
 //       divide_patch( patch, NumTimesToSubdivide );
  //  }

    patch = new Array(numTeapotPatches);
    for(var i=0; i<numTeapotPatches; i++) patch[i] = new Array(16);
    for(var i=0; i<numTeapotPatches; i++) 
        for(j=0; j<16; j++) {
            patch[i][j] = vec4.create([vertices[indices[i][j]][0], vertices[indices[i][j]][1], 
                vertices[indices[i][j]][2], 1.0]);
//            console.log(patch[i][j]);
        }
    
    
    
    //for (var i =0; i<4; i++) patch[i] = new Array(4);
    //alert("arrays set up");
    //console.log("patch");
    //for(var j=0; j<16;j++) console.log(patch[0][j]);
//  console.log("end patch");
    for ( var n = 0; n < 1; n++ ) {
	//point4  patch[4][4];


	// Subdivide the patch
            //console.log(patch[n]);
                    dividePatch( patch[n], NumTimesToSubdivide );

    }
}