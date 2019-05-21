"use strict";

const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

/**
 * View cube.
 *
 * @type {{init, setAxis}}
 */
var CubeView = (function() {
    let canvas;
    let gl;

    let axis = X_AXIS;
    let theta = [0, 0, 0];

    let thetaLoc;

    /**
     * Initialize the view.
     */
    function init() {
        canvas = document.getElementById("gl-canvas");

        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }

        CubeModel.init();

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        gl.enable(gl.DEPTH_TEST);

        //
        //  Load shaders and initialize attribute buffers
        //
        let program = initShaders(gl, "../shaders/vshadercube.glsl",
            "../shaders/fshadercube.glsl");
        gl.useProgram(program);

        // color array atrribute buffer

        // array element buffer
        let iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(CubeModel.getIndices()), gl.STATIC_DRAW);

        let cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(CubeModel.getColors()), gl.STATIC_DRAW);

        let vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        // vertex array attribute buffer

        let vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(CubeModel.getPoints()), gl.STATIC_DRAW);

        let vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        thetaLoc = gl.getUniformLocation(program, "theta");

        render();
    }

    /**
     * Set rotation axis.
     *
     * @param newaxis
     */
    function publicSetAxis(newaxis) {
        axis = newaxis;
    }

    /**
     * Render the model.
     */
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        theta[axis] += 2.0;
        gl.uniform3fv(thetaLoc, theta);

        gl.drawArrays(gl.TRIANGLES, 0, CubeModel.getNumVertices(), gl.UNSIGNED_BYTE, 0);

        requestAnimFrame(render);
    }

    return {
        init : init,
        setAxis : publicSetAxis
    }

})();
