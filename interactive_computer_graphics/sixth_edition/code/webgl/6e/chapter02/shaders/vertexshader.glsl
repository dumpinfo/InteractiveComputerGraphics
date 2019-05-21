attribute vec2 aPosition;
uniform mat4 mvMatrix;
uniform mat4 pMatrix;
void main() {
    gl_Position = pMatrix * mvMatrix * vec4(aPosition, 0, 1);
}
