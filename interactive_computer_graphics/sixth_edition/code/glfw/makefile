GCC_OPTIONS=-Wall -pedantic 
GL_OPTIONS= -lglfw -framework OpenGL -framework Cocoa 
OPTIONS=$(GCC_OPTIONS) $(GL_OPTIONS)


.cpp: 
	g++ $@.cpp ../Common/InitShader.o $(OPTIONS) -o $@  

