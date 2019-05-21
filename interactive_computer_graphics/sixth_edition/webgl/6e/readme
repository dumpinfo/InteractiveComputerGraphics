This directory contains WebGL versions of many of the C++ examples in the 6th Edition of Interactive Computer Graphics. They have been tested on Chrome and Firefox and with one exception (the bump map example does not seem to work correctly on Firefox)  they seem to work on both. Each comes in two flavors. In the first, the shaders are in the html and in the second (examples have a v2 on the file name), the shaders are read in from text files in a shader directory.

The Common directory contains:

webgk-utils.js: Google's webgl tools. I used only the frame animate which is the same with Mozilla's WebGL tools.

glMatrixEA.js: An augmented glMatrix.js which is available on the Web. I added functionality so it has all the functions from mat.h and vec.h. 

initShaders.js and initShaders2.js: The first is used if the shaders are inside the html file and the second if they are in separate files.

I tried to make the examples as close to the C++ examples as possible. Note the use of the flatten function from glMatrixEA.js to convert from vector objects to a floating point array for WebGL functions that send data to the GPU.
