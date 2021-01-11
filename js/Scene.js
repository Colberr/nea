// Setting up
var cont = document.getElementById("graphCont");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, cont.offsetWidth / cont.offsetHeight, 0.1, 500);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(cont.offsetWidth, cont.offsetHeight);
cont.appendChild(renderer.domElement);


// Creating axes
/*
class Axes {
	constructor() {
		this.axisLength = 200;
		this.axisLines = [];

		this.drawAxes();
	}

	drawAxes() {
		var limits = [
			[new THREE.Vector3(-1*this.axisLength,0,0), new THREE.Vector3(this.axisLength,0,0)],
			[new THREE.Vector3(0,-1*this.axisLength,0), new THREE.Vector3(0,this.axisLength,0)],
			[new THREE.Vector3(0,0,-1*this.axisLength), new THREE.Vector3(0,0,this.axisLength)]
		];
		var axisMaterial = new THREE.LineBasicMaterial( {color: 0xffffff} );
	
		for (var i=0;i<3;i++) {
			var axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints(limits[i]), axisMaterial)
			axis.geometry.verticesNeedUpdating = true;
			this.axisLines.push(axis);
			scene.add(this.axisLines[this.axisLines.length-1]);
		}
	}
}
var axes = new Axes();
*/
const axisLength = 200;
function drawAxes() {
	var limits = [
		[new THREE.Vector3(-axisLength,0,0), new THREE.Vector3(axisLength,0,0)],
		[new THREE.Vector3(0,-axisLength,0), new THREE.Vector3(0,axisLength,0)],
		[new THREE.Vector3(0,0,-axisLength), new THREE.Vector3(0,0,axisLength)]
	];
	var axisMaterial = new THREE.LineBasicMaterial( {color: 0xffffff} );

	for (var i=0;i<3;i++) {
		var axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints(limits[i]), axisMaterial);
		scene.add(axis);
	}
}
drawAxes();


// Updates graphics
var dx = dy = dz = 0;
var dalpha = dbeta = dgamma = 0;
function update() {
	camera.position.x += dx;
	camera.position.y += dy;
	camera.position.z += dz;
	camera.rotation.x += dalpha;
	camera.rotation.y += dbeta;
	camera.rotation.z += dgamma;
}

// Draws graphics
function render() {
	renderer.render(scene, camera);
}

// Loop to update and re-render graphics (has to be called once to start the loop)
function drawLoop() {
	requestAnimationFrame(drawLoop);

	update();
	render();
}
drawLoop();


// ------------------------------------------------------------------
// Camera movement
const movementSpeed = 0.01;
const rotationSpeed = 0.01;

document.addEventListener('keydown', function(event) {
	switch (event.key) {
		case "a":
			dx = -movementSpeed;
			return dx;
		case "d":
			dx = movementSpeed;
			return dx;
		case "r":
			dy = movementSpeed;
			return dy;
		case "f":
			dy = -movementSpeed;
			return dy;
		case "w":
			dz = -movementSpeed;
			return dz;
		case "s":
			dz = movementSpeed;
			return dz;
		case "ArrowUp":
			dalpha = rotationSpeed;
			return dalpha;
		case "ArrowDown":
			dalpha = -rotationSpeed;
			return dalpha;
		case "ArrowLeft":
			dbeta = rotationSpeed;
			return dbeta;
		case "ArrowRight":
			dbeta = -rotationSpeed;
			return dbeta;
		case "q":
			dgamma = rotationSpeed;
			return dgamma;
		case "e":
			dgamma = -rotationSpeed;
			return dgamma;
	}
});

document.addEventListener('keyup', function(event) {
	switch (event.key) {
		case "a":
			dx = 0;
			return dx;
		case "d":
			dx = 0;
			return dx;
		case "r":
			dy = 0;
			return dy;
		case "f":
			dy = 0;
			return dy;
		case "w":
			dz = 0;
			return dz;
		case "s":
			dz = 0;
			return dz;
		case "ArrowUp":
			dalpha = 0;
			return dalpha;
		case "ArrowDown":
			dalpha = 0;
			return dalpha;
		case "ArrowLeft":
			dbeta = 0;
			return dbeta;
		case "ArrowRight":
			dbeta = 0;
			return dbeta;
		case "q":
			dgamma = 0;
			return dgamma;
		case "e":
			dgamma = 0;
			return dgamma;
	}
});



// Testing testing
camera.position.x = 3;
camera.position.y = 2;
camera.position.z = 5;



var cubeGeometry = new THREE.BoxGeometry(15, 0.01, 15);
var cubeMaterial = new THREE.MeshBasicMaterial({
	color: 0x999999
});
cubeMaterial.transparent = true;
cubeMaterial.opacity = 0.8;
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Code copied from my own p5js thing (from Feb 2020)
// r = a + λb 
function eqToPoints(a,b) {
  
	t1 = [50/b[0], 50/b[1], 50/b[2]];
	t1Min = Math.min(...t1);
	
	endPosi = [
	  t1Min * b[0] + a[0], 
	  t1Min * b[1] + a[1], 
	  t1Min * b[2] + a[2]
	];
	
	endNega = [
	  -1 * t1Min * b[0] + a[0], 
	  -1 * t1Min * b[1] + a[1], 
	  -1 * t1Min * b[2] + a[2]
	];
	
	
	return([endPosi,endNega]);
}

var lines = [];
function makeLine(a,b) {
	var r = eqToPoints(a,b);
	const points = [
		new THREE.Vector3(r[0][0],r[0][1],r[0][2]), 
		new THREE.Vector3(r[1][0],r[1][1],r[1][2])
	];
	const lineMaterial = new THREE.LineBasicMaterial( {color: Math.random() * 0xff0000} );

	lines.push(
		new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial)
	);
	scene.add(lines[lines.length-1]);
}

makeLine(
	[0,0,0],
	[-1,1.5,2]
);
makeLine(
	[1,-3,-2],
	[2,5,1]
);