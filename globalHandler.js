/**
 * Created by ambie on 09/03/2017.
 */

var mouseX=3350;
var mouseY=0;
var lastMouseX=0;
var lastMouseY=0;
var deltaMouseX=0;
var deltaMouseY=0;
var rotY = 0;
var rotX = 0;
var mainScene;
var zPressed = false;
var qPressed = false;
var sPressed = false;
var dPressed = false;
var onFloor = true;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
mat4.identity(objMatrix);

function initialiseComponent(){
    mainScene = new Scene();
    mainScene.lights[0] = new Light([-5.0,50.0,15.0],[2.0,10.0,2.0]);
    mainScene.lights[1] = new Light([25.0,0.0,20.0],[10.0,2.0,2.0]);
    mainScene.lights[2] = new Light([20.0,50.0,0.0],[2.0,2.0,10.0]);
    mainScene.spheres[0] = new Sphere([10.0,7.0,150.0],12.0, new Material([0.3,0.2,0.10],1.0,0.1,2.0));
    mainScene.spheres[1] = new Sphere([-5.0,0.0,75.0],0.5, new Material([0.1,0.02,0.04],1.0,0.8,1.5));
    mainScene.spheres[2] = new Sphere([-15.0,0.0,0.0],11.0, new Material([0.1,0.2,0.1],1.0,0.4,1.5));
    mainScene.spheres[3] = new Sphere([25.0,-5.0,30.0],4.0, new Material([0.05,0.02,0.4],1.0,0.3,1.0));
    mainScene.spheres[4] = new Sphere([-5.0,0.0,75.0],17.0, new Material([0.0,0.2,0.04],1.0,0.8,1.5));
    mainScene.plans[0] = new Plan([0.0, 1.0 , 0.0], 20, new Material([0.4,0.2,0.1],1.0,1.5,1.5));
    mainScene.plans[1] = new Plan([1.0, 0.0 , 0.0], 150, new Material([0.1,0.2,0.6],0.9,1.4,1.4));
    mainScene.plans[2] = new Plan([-1.0, 0.0 , 0.0], 150, new Material([0.3,0.2,0.4],0.9,1.4,1.4));
    mainScene.plans[3] = new Plan([0.0, 0.0 , -1.0], 300, new Material([0.2,0.2,0.6],0.9,1.4,1.4));
    mainScene.plans[4] = new Plan([0.0, -1.0 , 0.0], 51 , new Material([0.1,0.0,0.6],0.9,1.4,1.4));

    mainScene.gravity = [0.0,-0.01,0.0];

    mainScene.spheres[1].speed = [0.0,0.0,0.0];
    mainScene.spheres[1].updateVelocity = function(){
        this.speed[0] += mainScene.gravity[0];
        this.speed[1] += mainScene.gravity[1];
        this.speed[2] += mainScene.gravity[2];
        this.center[0] += this.speed[0];
        this.center[1] += this.speed[1];
        this.center[2] += this.speed[2];
        if(this.center.y < -30){
            this.speed = [0.0,50.0,0.0];
        }
        this.updateUniform();
    }
}


function update() {
    viewControl();

    move();
    //
    mainScene.lights[0].center[0] = 20*Math.cos(performance.now()/300.0);
    mainScene.lights[0].center[2] = 20*Math.sin(performance.now()/100.0);
    mainScene.lights[1].center[2] = 20*Math.sin(performance.now()/300.0);
    mainScene.lights[2].center = mainScene.mainCam.origin;

    mainScene.spheres[0].center[1] = 10+35*Math.cos(performance.now()/1000.0);
    mainScene.spheres[0].center[0] = 5*Math.sin(performance.now()/500.0);

    mainScene.spheres[1].center[2] = 5*Math.sin(performance.now()/500.0);
    //
    mainScene.spheres[2].center[2] = 10+50*Math.cos(performance.now()/1000.0);
    mainScene.spheres[2].center[2] = 5*Math.sin(performance.now()/500.0);

    mainScene.lights[0].updateUniform();
    mainScene.lights[1].updateUniform();
    mainScene.lights[2].updateUniform();

    mainScene.spheres[0].updateUniform();
    mainScene.spheres[1].updateUniform();
    mainScene.spheres[2].updateUniform();

    mainScene.mainCam.updateUniform();
    drawScene();



}

function move(){
    if(zPressed){
        mainScene.mainCam.origin[0] += mainScene.mainCam.direction[0];
        mainScene.mainCam.origin[2] -= mainScene.mainCam.direction[2];
    }
    if(qPressed){
        var a = [0.0,1.0,0.0];
        var b = mainScene.mainCam.direction;
        var c = [a[1]*b[2]-a[2]*b[1] ,a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
        mainScene.mainCam.origin[0] += c[0];
        mainScene.mainCam.origin[2] -= c[2];
    }
    if(sPressed){
        mainScene.mainCam.origin[0] -= mainScene.mainCam.direction[0];
        mainScene.mainCam.origin[2] += mainScene.mainCam.direction[2];
    }
    if(dPressed){
        var a = [0.0,1.0,0.0];
        var b = mainScene.mainCam.direction;
        var c = [a[1]*b[2]-a[2]*b[1] ,a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
        mainScene.mainCam.origin[0] -= c[0];
        mainScene.mainCam.origin[2] += c[2];
    }
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
function viewControl() {
    // var newX = mouseX;
    // var newY = mouseY;
    //
    // var deltaX = newX - lastMouseX;
    // var deltaY = newY - lastMouseY;
    //
    // rotY += degToRad(deltaX / 2);
    // rotX += degToRad(deltaY / 2);
    //
    // mat4.identity(objMatrix);
    // mat4.rotate(objMatrix, rotX, [1, 0, 0]);
    // mat4.rotate(objMatrix, rotY, [0, 1, 0]);
    //
    // lastMouseX = newX;
    // lastMouseY = newY;



    deltaMouseX = mouseX - lastMouseX;
    deltaMouseY = mouseY - lastMouseY;

    var sensitivity = 0.001;

    mainScene.mainCam.direction[0] = Math.cos(mouseY*sensitivity)*Math.sin(-mouseX*sensitivity);
    mainScene.mainCam.direction[1] = Math.sin(mouseY*sensitivity);
    mainScene.mainCam.direction[2] = Math.cos(mouseY*sensitivity)*Math.cos(-mouseX*sensitivity);

    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function keypressed(e){
    switch (e.key){
        case "z": // Z key is pressed
            zPressed = true;
            break;
        case "q": // Q key is pressed
            qPressed = true;
            break;
        case "s": // S key is pressed
            sPressed = true;
            break;
        case "d": // D key is pressed
            dPressed = true;
            break;
        case " ": // SpaceBar is pressed
            break;
    }
}

function keyreleased(e){
    switch (e.key){
        case "z": // Z key is pressed
            zPressed = false;
            break;
        case "q": // Q key is pressed
            qPressed = false;
            break;
        case "s": // S key is pressed
            sPressed = false;
            break;
        case "d": // D key is pressed
            dPressed = false;
            break;
        case " ": // SpaceBar is pressed
            break;
    }
}
document.addEventListener("keydown",keypressed);
document.addEventListener("keyup",keyreleased);


function animate() {
    gl.useProgram(shaderProgram);
    update();
    requestAnimFrame(animate);
}

setTimeout((function() {window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;
    animate();
}),1000);


canvas = document.getElementById("WebGL-test");
canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;

canvas.onclick = function() {
    canvas.requestPointerLock();
};

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        console.log('The pointer lock status is now unlocked');
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

function updatePosition(e) {
    mouseX += e.movementX;
    mouseY += e.movementY;
}


function fullscreen(){
    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    }
    else {
        canvas.mozRequestFullScreen();
    }
}
document.addEventListener("click",fullscreen);

