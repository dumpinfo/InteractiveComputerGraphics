"use strict";

const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

var view;

/**
 * Initialize webGL for the cube.
 */
class CubeGL {

    /**
     * Initialization code.
     *
     * @param model
     */
    constructor(model) {
        this._model = model;
        let canvas = document.getElementById("gl-canvas");

        this._axis = X_AXIS;
        this.theta = [0, 0, 0];
        this.numVertices = 36;

        this.gl = WebGLUtils.setupWebGL(canvas, {});
        if (!this.gl) {
            alert("WebGL isn't available");
        }

        let indices = [
            [1, 0, 3, 1, 3, 2],
            [2, 3, 7, 2, 7, 6],
            [3, 0, 4, 3, 4, 7],
            [6, 5, 1, 6, 1, 2],
            [4, 5, 6, 4, 6, 7],
            [5, 4, 0, 5, 0, 1]];

        let points = [];

        // triangulerer med farger
        let sideColors = [];
        for (let j = 0; j < 6; ++j) {
            for (let i = 0; i < 6; ++i) {
                points.push(this._model.vertices[indices[j][i]]);

                // for solid colored faces use i = 0
                sideColors.push(this._model.colors[indices[j][i]]);

            }
        }

        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this.gl.enable(this.gl.DEPTH_TEST);

        //
        //  Load shaders and initialize attribute buffers
        //
        let program = initShaders(this.gl, "shaders/vshadercube.glsl", "shaders/fshadercube.glsl");
        this.gl.useProgram(program);

        let cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(sideColors), this.gl.STATIC_DRAW);

        let vColor = this.gl.getAttribLocation(program, "vColor");
        this.gl.vertexAttribPointer(vColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vColor);

        let vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(points), this.gl.STATIC_DRAW);


        let vPosition = this.gl.getAttribLocation(program, "vPosition");
        this.gl.vertexAttribPointer(vPosition, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vPosition);

        this.thetaLoc = this.gl.getUniformLocation(program, "theta");

        view = this;
        render();
    }

    /**
     * Update the cube.
     */
    update() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.theta[this._axis] += 2.0;
        this.gl.uniform3fv(this.thetaLoc, this.theta);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);
    }

    /**
     * Set new axis.
     *
     * @param axis
     */
    set axis(axis) {
        this._axis = axis;
    }

    /**
     * Get axis.
     *
     * @returns {*|number}
     */
    get axis() {
        return this._axis;
    }

};

/**
 * Rendering function.
 */
function render() {
    view.update();
    requestAnimFrame(render);
}