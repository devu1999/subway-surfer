/// <reference path="webgl.d.ts" />

let railtop = class {
    constructor(gl, pos) {
    this.textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);


        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var scale = 1;
        var scaleZ = 5;
        this.positions = [
             -1.0*scale, 1.0*scale,  1.0*scaleZ,
             -1.0*scale, 1.0*scale,  -1.0*scaleZ,
             1.0*scale,  1.0*scale,  1.0*scaleZ,
            1.0*scale,  1.0*scale,  -1.0*scaleZ,
             
        ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        this.faceColors = [
            // [ Math.random(),  Math.random(),  Math.random(),  Math.random()],    // Left face: purple
            // [ Math.random(), Math.random(), Math.random(), Math.random()], // Left face: purple
            // [ Math.random(), Math.random(), Math.random(), Math.random()], // Left face: purple
            // [ Math.random(), Math.random(), Math.random(), Math.random()], // Left face: purple
            // [ Math.random(), Math.random(), Math.random(), Math.random()], // Left face: purple
            // [ Math.random(), Math.random(), Math.random(), Math.random()], // Left face: purple
            [1,1,1,1],
            [1,1,1,1],

        ];

        var colors = [];



        for (var j = 0; j < this.faceColors.length; ++j) {
            const c = this.faceColors[j];

            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2,    1, 2, 3, // front
            // 8, 9, 10,   8, 10, 11,
            // 12, 13, 14, 12, 14, 15,
            // 16, 17, 18, 16, 18, 19,
            // 20, 21, 22, 20, 22, 23, 
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            textureCoord: this.textureCoordBuffer,
            indices: indexBuffer,
        }

    }

    drawRailTop(gl, projectionMatrix, programInfo, deltaTime,texture) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        //this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        // mat4.rotate(modelViewMatrix,
        //     modelViewMatrix,
        //     this.rotation,
        //     [1, 1, 0]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the textures from the color buffer
        // into the vertexColor attribute.
        {
             const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
                }

                // Tell WebGL which indices to use to index the vertices
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

                // Tell WebGL to use our program when drawing

                gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        // Tell WebGL we want to affect texture unit 0
          gl.activeTexture(gl.TEXTURE0);

          // Bind the texture to texture unit 0
          gl.bindTexture(gl.TEXTURE_2D, texture);

          // Tell the shader we bound the texture to texture unit 0
          gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


        {
            const vertexCount = 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};