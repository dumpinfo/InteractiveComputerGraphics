"use strict";

/**
 * Model for cube sample. This is a sample of how to create a module in JavaScript 5.
 *
 * @type {{init, getColors, getPoints, getNumVertices, getIndices}}
 */
var CubeModel = (function () {

    let numVertices = 36;

    let points = [];
    let colors = [];
    let indices = [];

    /**
     * Initialize cube model.
     */
    function init() {
        colorTriangle();
    }

    /**
     * Return colors.
     *
     * @returns {Array}
     */
    function publicGetColors() {
        return colors;
    }

    /**
     * Return points.
     *
     * @returns {Array}
     */
    function publicGetPoints() {
        return points;
    }

    /**
     * Return indices.
     *
     * @returns {Array}
     */
    function publicGetIndices() {
        return indices;
    }

    /**
     * Return number of vertices.
     *
     * @returns {number}
     */
    function publicGetNumVertices() {
        return numVertices;
    }

    /**
     * Set colors on cube faces.
     */
    function colorCube() {
        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(6, 5, 1, 2);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
    }

    /**
     * Set colors on triangles.
     */
    function colorTriangle() {
        triangle();
    }

    /**
     * Create quads.
     *
     * @param a point 1
     * @param b point 2
     * @param c point 3
     * @param d point4
     */
    function quad(a, b, c, d) {
        let vertices = [
            vec4(-0.5, -0.5, 0.5, 1.0),
            vec4(-0.5, 0.5, 0.5, 1.0),
            vec4(0.5, 0.5, 0.5, 1.0),
            vec4(0.5, -0.5, 0.5, 1.0),
            vec4(-0.5, -0.5, -0.5, 1.0),
            vec4(-0.5, 0.5, -0.5, 1.0),
            vec4(0.5, 0.5, -0.5, 1.0),
            vec4(0.5, -0.5, -0.5, 1.0)
        ];

        let vertexColors = [
            [0.0, 0.0, 0.0, 1.0],  // black
            [1.0, 0.0, 0.0, 1.0],  // red
            [1.0, 1.0, 0.0, 1.0],  // yellow
            [0.0, 1.0, 0.0, 1.0],  // green
            [0.0, 0.0, 1.0, 1.0],  // blue
            [1.0, 0.0, 1.0, 1.0],  // magenta
            [0.0, 1.0, 1.0, 1.0],  // cyan
            [1.0, 1.0, 1.0, 1.0]   // white
        ];

        // We need to parition the quad into two triangles in order for
        // WebGL to be able to render it.  In this case, we create two
        // triangles from the quad indices

        //vertex color assigned by the index of the vertex

        indices = [a, b, c, a, c, d];

        for (let i = 0; i < indices.length; ++i) {
            //points.push(vertices[indices[i]]);
            points.push(vertices[indices[i]]);
            //colors.push( vertexColors[indices[i]] );

            // for solid colored faces use
            colors.push(vertexColors[a]);
        }
    }

    /**
     * Creater triangles.
     */
    function triangle() {
        let vertices = [
            vec3( -0.5, -0.5,  0.5 ),
            vec3( -0.5,  0.5,  0.5 ),
            vec3(  0.5,  0.5,  0.5 ),
            vec3(  0.5, -0.5,  0.5 ),
            vec3( -0.5, -0.5, -0.5 ),
            vec3( -0.5,  0.5, -0.5 ),
            vec3(  0.5,  0.5, -0.5 ),
            vec3(  0.5, -0.5, -0.5 )
        ];

        let vertexColors = [
            [0.0, 0.0, 0.0, 1.0],  // black
            [1.0, 0.0, 0.0, 1.0],  // red
            [1.0, 1.0, 0.0, 1.0],  // yellow
            [0.0, 1.0, 0.0, 1.0],  // green
            [0.0, 0.0, 1.0, 1.0],  // blue
            [1.0, 0.0, 1.0, 1.0],  // magenta
            [0.0, 1.0, 1.0, 1.0],  // cyan
            [1.0, 1.0, 1.0, 1.0]   // white
        ];

        // We need to parition the quad into two triangles in order for
        // WebGL to be able to render it.  In this case, we create two
        // triangles from the quad indices

        // indices of the 12 triangles that compise the cube

        indices = [
            1, 0, 3,
            3, 2, 1,
            2, 3, 7,
            7, 6, 2,
            3, 0, 4,
            4, 7, 3,
            6, 5, 1,
            1, 2, 6,
            4, 5, 6,
            6, 7, 4,
            5, 4, 0,
            0, 1, 5
        ];

        for (let i = 0; i < indices.length; ++i) {
            //points.push(vertices[indices[i]]);
            points.push(vertices[indices[i]]);
            colors.push( vertexColors[indices[i]] );

            // for solid colored faces use
            //colors.push(vertexColors[a]);
        }
    }

    return {
        init: init,
        getColors: publicGetColors,
        getPoints: publicGetPoints,
        getNumVertices: publicGetNumVertices,
        getIndices: publicGetIndices
    }

})();
