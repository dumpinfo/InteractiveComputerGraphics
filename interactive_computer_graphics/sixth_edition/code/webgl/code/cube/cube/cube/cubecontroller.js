"use strict";

/**
 * Controller for the cube project.
 */
class CubeController {

    /**
     * Creates a new CubeController object.
     */
    constructor() {
        this.model = new CubeData();
        this.view = new CubeGL(this.model);
    }

    /**
     * Changes the rotation axis.
     */
    xButtonClicked() {
        this.view.axis = X_AXIS;
    }

    /**
     * Changes the rotation axis.
     */
    yButtonClicked() {
        this.view.axis = Y_AXIS;
    }

    /**
     * Changes the rotation axis.
     */
    zButtonClicked() {
        this.view.axis = Z_AXIS;
    }

}

/**
 * The controller to be used from html.
 */
var controller = new CubeController();

