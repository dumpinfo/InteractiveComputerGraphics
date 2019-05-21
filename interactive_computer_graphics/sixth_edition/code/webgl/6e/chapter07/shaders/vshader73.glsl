
/* bump map vertex shader */

varying vec3 L; /* light vector in texture-space coordinates */
varying vec3 V; /* view vector in texture-space coordinates */

attribute vec2 texcoord;
attribute vec4 vPosition;

uniform vec4 Normal;
uniform vec4 LightPosition;
uniform mat4 ModelView;
uniform mat4 Projection;
uniform mat3 NormalMatrix;
uniform vec3 objTangent; /* tangent vector in object coordinates */

varying vec2 st;

void main()
{
    gl_Position = Projection*ModelView*vPosition;

    
    
    st = texcoord;

    vec3 eyePosition = (ModelView*vPosition).xyz;
    vec3 eyeLightPos = (ModelView*LightPosition).xyz;

   /* normal, tangent and binormal in eye coordinates */

    vec3 N = normalize(NormalMatrix*Normal.xyz);
    vec3 T  = normalize(NormalMatrix*objTangent);
    vec3 B = cross(N, T);

    /* light vector in texture space */

    L.x = dot(T, eyeLightPos-eyePosition);
    L.y = dot(B, eyeLightPos-eyePosition);
    L.z = dot(N, eyeLightPos-eyePosition);

    L = normalize(L);

    /* view vector in texture space */

    V.x = dot(T, -eyePosition);
    V.y = dot(B, -eyePosition);
    V.z = dot(N, -eyePosition);

    V = normalize(V);
    
}
