#ifdef GL_ES
precision highp float;
#endif


varying vec4 color;

void
main()
{
    gl_FragColor = color;
    // = vec4(1.0, 0.0, 0.0, 1.0);
}
