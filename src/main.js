var cubeRotation = 0.0;

var score = 0;
var endTime = 120;

var speedZ = 1;
var landing = false;


var Time;
var grayOn = -5;
var blink = -10;
var hitTime = 0;

var bootTime = -11;
var bootFlag = false;


var jetTime = -11;
var jetFlag = false;
var ending = false;

var flyTime;

// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.



function gameEnd()
{
  ending = true;
  return;
  // exit();
}
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

var noObs = 3;
var noP = 1;
function reSpawn(gl) {
    //coin respawning
    if (coins.length < 10) {
        var x;
        if (Math.random() > 0.5)
            x = 2.5;
        else
            x = -2.5;
        cn = new coin(gl, [x, 0, -70 - Math.random() * 30]);
        coins.push(cn);
    }

    if (upBar.length < noObs) {
        var x;
        if (Math.random() > 0.5)
            x = 2;
        else
            x = -2;
        bar = new upbarrier(gl, [x, -0.5, -Math.random() * 200]);
        upBar.push(bar);
    }

    if (dnBar.length < noObs) {
        var x;
        if (Math.random() > 0.5)
            x = 2;
        else
            x = -2;
        bar = new dnbarrier(gl, [x, -1, -Math.random() * 200]);
        dnBar.push(bar);
    }

    if (boot.length < noP) {
        var x;
        if (Math.random() > 0.5)
            x = 2;
        else
            x = -2;
        bar = new addon(gl, [x, 0, -Math.random() * 100 - 100]);
        boot.push(bar);
    }
    if (jets.length < noP) {
        var x;
        if (Math.random() > 0.5)
            x = 2;
        else
            x = -2;
        bar = new addon(gl, [x, 0, -Math.random() * 100 - 300]);
        jets.push(bar);
    }

}

function checkColWithPlayer(cn, player) {
    var x = player.pos[0];
    var y = player.pos[1];
    var z = player.pos[2];
    var x1 = cn.pos[0];
    var y1 = cn.pos[1];
    var z1 = cn.pos[2];
    var dist = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1) + (z - z1) * (z - z1));
    if (dist < 0.75) {
        score++;
        return true;
    } else
        return false;
}

function checkupBarColWithPLayer(bar, player) {
    var x = player.pos[0];
    var y = player.pos[1];
    var z = player.pos[2];
    var x1 = bar.pos[0];
    var y1 = bar.pos[1] + 1.75;
    var z1 = bar.pos[2];
    var dist = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1) + (z - z1) * (z - z1));
    if (dist < 1.5) {
        //hit ++;
        return true;
    } else
        return false;

}

function checkdnBarColWithPLayer(bar, player) {
    var x = player.pos[0];
    var y = player.pos[1];
    var z = player.pos[2];
    var x1 = bar.pos[0];
    var y1 = bar.pos[1];
    var z1 = bar.pos[2];
    var dist = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1) + (z - z1) * (z - z1));
    if (dist < 1.5) {
        //hit ++;
        return true;
    } else
        return false;

}


function checkColWithTrain() {
    var X = railFront.pos[0];
    var Y = railFront.pos[1];
    var Z = railFront.pos[2];
    var x = c.pos[0];
    var y = c.pos[1];
    var z = c.pos[2];
    if (Math.abs(x - X) <= 1.5) {
        if (Math.abs(y - Y) <= 1.5) {
            if (Math.abs(Z - z) <= 26) {
                return true;
            }
        }
    } else {
        if (y <= 1.5) {
            if (Math.abs(z - Z) <= 25) {
                if (Math.abs(x - X) <= 1.5)
                    return true;
            }
        }
    }
    return false;
}


main();

//
// Start here
//

var c;
var c1;
var Wall;
var pArr = [-2.0, 0.0, 2.0];
var idx = 1;


// all the textures declared here

var pTexture;
var cTexture;
var upBarTexture;
var wTexture;
var skTexture;
var bootTexture;
var jetTexture;
var endTexture;
var dogTexture;
var policeTexture;


// all arrays containing objects here
var coins = [];
var upBar = [];
var dnBar = [];
var boot = [];
var jets = [];
var End;
var Dog;
var Police;

// all rail variable functions here
var railFront;
var railTop;
var fTexture, tTexture;

function makeRail(gl) {
    fTexture = loadTexture(gl, "./images/window.png");
    var x;
    if (Math.random() > 0.5)
        x = 2;
    else
        x = -2;
    railFront = new railfront(gl, [x, 0, -Math.random() * 100 - 200]);
    railTop = new railtop(gl, [railFront.pos[0], 0.01, railFront.pos[2]]);
}


function manageFlags() {
    if (Time - bootTime > 3) {
        bootFlag = false;
    }
    
    if(bootFlag == true)
    {

    }
    else if( bootFlag == false)
        speedZ = 1;
    else if(hitTime - Time < 5)
      speedZ = 0.5;
}

var jLanding = false;

function manageLanding() {
    var X = railFront.pos[0];
    var Y = railFront.pos[1];
    var Z = railFront.pos[2];
    var x = c.pos[0];
    var y = c.pos[1];
    var z = c.pos[2];
    if (landing == true) {
        if (Math.abs(z - Z) <= 26) {
            if (y - Y >= 1.9)
                c.pos[1] = 3.0;
        } else {
            if (c.pos[1] == 3.0) {
                c.pos[1] = 0;
                c.speed = 0;
            }
            landing = false;
        }
    }
}


//lighting elements
var programInfoLight;

function creatingLightingParameter(gl) {
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

    const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    programInfoLight = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };



}

var programInfoGray;

function creatingGrayParam(gl) {
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

    const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb,vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), 1.0);
    }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    programInfoGray = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };
}


var programInfoBlink;

function creatingBlinkParam(gl) {
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

    const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4( texelColor.rgb * vLighting, texelColor.a);

      gl_FragColor.a += 0.4;
      gl_FragColor.g += 0.4;
      gl_FragColor.b += 0.4;
    }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    programInfoBlink = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };
}


var programInfoColor;


// sound elements
var hitSound;

function main() {


    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    playSound("./sound/rocket.mp3", 9999, 0.2, 0);

    // Vertex shader program

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

    // Fragment shader program

    const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVevrtexColor and also
    // look up uniform locations.
    programInfoColor = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    creatingLightingParameter(gl);
    creatingGrayParam(gl);
    creatingBlinkParam(gl);


    const texture = loadTexture(gl, './images/track1.jpg');
    c = new cube(gl, [0, 0.0, -5.0]);
    Police = new police(gl,[0,0, -3]);
    Dog = new dog(gl,[0,0.4,-3]);
    py = new pyramid(gl, [0, -0.5, -5.0]);
    pTexture = loadTexture(gl, './images/bro.jpeg');
    t1 = new track(gl, [0, 0, 0]);

    Wall = new Array();
    for(var i = 0 ; i < 10; i++) 
    {
      var temp = new wall(gl, [0, i, - i*10]);
      Wall.push(temp);
    }
    End = new end(gl,[0,9,-100]);

    // If we don't have a GL context, give up now
    cTexture = loadTexture(gl, './images/coins.jpeg');
    upBarTexture = loadTexture(gl, './images/upbar.jpeg');
    // wTexture = loadTexture(gl, "./images/wall2.jpeg");
    wTexture = loadTexture(gl, "./images/wall3.jpg");

    tTexture = loadTexture(gl, "./images/railtop.jpeg");
    skTexture = loadTexture(gl, "./images/skates.jpeg");
    bootTexture = loadTexture(gl, "./images/boots.jpeg");
    jetTexture = loadTexture(gl, "./images/jetpack.jpeg");
    endTexture = loadTexture(gl, "./images/end.png");
    dogTexture = loadTexture(gl,"./images/dog.jpeg");
    policeTexture = loadTexture(gl,"./images/police.jpeg");
    makeRail(gl);


    // initialising sound element
    hitSound = new Audio("./sound/hit.mp3");



    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }



    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    //const buffers

    var then = 0;
    

    // Draw the scene repeatedly
    function render(now) {
        if(ending == true){
          document.getElementById("canvas").innerHTML = "<h1>GAME OVER</h1>"
          return;
        }

        now *= 0.001; // convert to seconds
        Time = now;
        const deltaTime = speedZ * (now - then);
        then = now;

        reSpawn(gl);
        manageFlags();
        if (Time - grayOn > 50)
            grayOn = Time;

        if (Time - blink > 20)
            blink = Time;

        if (Time - grayOn > 5) {
            programInfo = programInfoColor;
        } else {
            programInfo = programInfoGray;
        }

        drawScene(gl, programInfo, deltaTime, texture);
        setupEventHandler();
        requestAnimationFrame(render);
        // deSpawn();
    }
    requestAnimationFrame(render);
    
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime, texture) {


    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things


    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 90 * Math.PI / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [2, 5, 0]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, c.pos, up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);




    if(jetFlag == true)
    {
        speedZ = 5;
      c.pos[1] = 4;
      if(Time -flyTime > 3)
      {
        speedZ = 1;
        c.pos[1] = 0;
        c.speed = 1;
        jetFlag = false;
      }
    }

    py.pos[0] = c.pos[0];
    py.pos[1] = c.pos[1] - 0.5;
    if (py.pos[1] < -0.5)
        py.pos[1] = -0.5;
    py.pos[2] = c.pos[2];
      

    if (checkColWithTrain() == true) {
        gameEnd();
    }
    if(Time - hitTime < 5 || speedZ == 0.5 )
    {
      Police.pos[0] = c.pos[0];
      if(c.pos[1] <= 1.5)
        Police.pos[1] = c.pos[1] - 0.5;
      else
        Police.pos[1] = -0.5;
      Police.pos[2] = c.pos[2] + 1;
      Police.drawPolice(gl, projectionMatrix, programInfoLight, deltaTime, policeTexture, speedZ);
      Dog.pos[0] = Police.pos[0] - 1;
      Dog.pos[1] = Police.pos[1] - 0.2;
      Dog.pos[2] = Police.pos[2];
    
      Dog.drawDog(gl, projectionMatrix, programInfoLight, deltaTime, dogTexture, speedZ);
    }
    c.drawCube(gl, projectionMatrix, programInfoLight, deltaTime, pTexture, speedZ);
    
    py.drawPyramid(gl, projectionMatrix, programInfo, deltaTime, skTexture);

    t1.drawTrack(gl, projectionMatrix, programInfo, deltaTime, texture);
    //c1.drawCube(gl, projectionMatrix, programInfo, deltaTime);

    //drawing up Barriers
    for (var i = 0; i < upBar.length; i++) {
      var res = checkupBarColWithPLayer(upBar[i], c);
      if(res == true)
      {
        // hitSound.play();
        if(Time - hitTime < 5)
            gameEnd();
        hitTime  = Time;
        playSound("data/sound/crash.mp3", 0, 1, 0);
      }
        if (upBar[i].pos[2] > 0 || res == true)
            upBar[i].pos[2] = -Math.random() * 200;
        upBar[i].drawbarrier(gl, projectionMatrix, programInfo, deltaTime, upBarTexture);
    }



    // drawing down barrier
    for (var i = 0; i < dnBar.length; i++) {
        var res = checkdnBarColWithPLayer(dnBar[i], c);
        if(res == true)
        {
          // hitSound.play();
          if(Time - hitTime < 5)
            gameEnd();
           hitTime = Time;
           playSound("data/sound/crash.mp3", 0, 1, 0);
        }

        if (dnBar[i].pos[2] > 0 || res == true )
        {
            dnBar[i].pos[2] = -Math.random() * 200;
        }
        dnBar[i].drawbarrier(gl, projectionMatrix, programInfo, deltaTime, upBarTexture);
    }

    // drawing coins
    for (var i = 0; i < coins.length; i++) {
        if (coins[i].pos[2] > 0 || checkColWithPlayer(coins[i], c) == true)
            coins[i].pos[2] = -70 - Math.random() * 30;
        coins[i].drawCoin(gl, projectionMatrix, programInfo, deltaTime, cTexture);
    }

    //drawing boots
    for (var i = 0; i < boot.length; i++) {
        var res = checkColWithPlayer(boot[i], c);
        boot[i].pos[2] += 10 * speedZ * deltaTime;
        // boot[i].rotation = 90;
        if (res == true) {
            // speedZ = 3;
            bootTime = Time;
            bootFlag = true;
        }
        if (boot[i].pos[2] > 0 || res == true)
            boot[i].pos[2] = -Math.random() * 100 - 100;
        boot[i].drawAddOn(gl, projectionMatrix, programInfo, deltaTime, bootTexture);
    }


    // drawing jets
    for (var i = 0; i < jets.length; i++) {
        var res = checkColWithPlayer(jets[i], c);
        jets[i].pos[2] += 40 * speedZ * deltaTime;
        // boot[i].rotation = 90;
        if (res == true) {
            // speedZ = 3;
            // jetTime = Time;
            flyTime = Time;
            jetFlag = true;
        }
        if (jets[i].pos[2] > 0 || res == true)
            jets[i].pos[2] = -Math.random() * 100 - 300;
        jets[i].drawAddOn(gl, projectionMatrix, programInfo, deltaTime, jetTexture);
    }

    if (railFront.pos[2] > 5) {
        var x;
        if (Math.random() > 0.5)
            x = 2;
        else
            x = -2;
        railFront.pos[0] = railTop.pos[0] = x;
        railFront.pos[2] = railTop.pos[2] = -Math.random() * 100 - 200;
    }
    railFront.drawRailFront(gl, projectionMatrix, programInfoLight, deltaTime, fTexture);
    railTop.drawRailTop(gl, projectionMatrix, programInfo, deltaTime, tTexture);

    if(Time > endTime)
      End.drawEnd(gl,projectionMatrix, programInfo, deltaTime, endTexture);

    if(c.pos[2] < End.pos[2])
      ending = true;

    if (Time - blink < 5) {
        var val = Math.floor(Time - blink) / 0.5;
        // console.log(val);
        if (val % 4 == 0) {
            programInfo = programInfoBlink;
        } else {
            programInfo = programInfoColor;
        }
    }
    for(var i = 0; i < Wall.length; i++)
      Wall[i].drawWall(gl, projectionMatrix, programInfo, deltaTime, wTexture);



}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}



function setupEventHandler() {
    document.addEventListener('keydown', function(event) {
        //rotationSpeed_inc = 1.6;
        if (event.keyCode == 37) {
            // console.log(rotationSpeed_inc);
            c.pos[0] = -2.5;
            event.preventDefault();
        } else if (event.keyCode == 39) {
            c.pos[0] = 2.5;
            event.preventDefault();
        } else if (event.keyCode == 40) {
            c.pos[1] = -0.5;
            event.preventDefault();
        } else if (event.keyCode == 32) {
            if (bootFlag == true) {
                landing = true;
                c.speed = 4;
                speedZ = 3;
            }
            c.pos[1] = 1.2;
            event.preventDefault();
        }
    });
}