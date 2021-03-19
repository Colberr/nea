// Setting up
var cont = document.getElementById("graphCont");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, cont.offsetWidth / cont.offsetHeight, 0.1, 500);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(cont.offsetWidth, cont.offsetHeight);
cont.appendChild(renderer.domElement);


var controls = new THREE.OrbitControls(camera, renderer.domElement);

// Creating axes
const axisLength = 80;

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

// z=0 plane
var basePlaneGeometry = new THREE.PlaneGeometry(50, 50);
var basePlaneMaterial = new THREE.MeshBasicMaterial({
	color: 0x999999
});
basePlaneMaterial.transparent = true;
basePlaneMaterial.opacity = 0.75;
var basePlane = new THREE.Mesh(basePlaneGeometry, basePlaneMaterial);
basePlane.rotateX(- Math.PI / 2);
scene.add(basePlane);


// Updates graphics
// var dx = dy = dz = 0;				// Position
// var dalpha = dbeta = dgamma = 0;	// Rotation
function update() {
	// camera.position.x += dx;
	// camera.position.y += dy;
	// camera.position.z += dz;
	// camera.rotation.x += dalpha;
	// camera.rotation.y += dbeta;
	// camera.rotation.z += dgamma;
	// controls.update();
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


// // ------------------------------------------------------------------
// // Camera movement
// const movementSpeed = 0.01;
// const rotationSpeed = 0.01;

// document.addEventListener('keydown', function(event) {
// 	switch (event.key) {
// 		case "a":
// 			dx = -movementSpeed;
// 			return dx;
// 		case "d":
// 			dx = movementSpeed;
// 			return dx;
// 		case "r":
// 			dy = movementSpeed;
// 			return dy;
// 		case "f":
// 			dy = -movementSpeed;
// 			return dy;
// 		case "w":
// 			dz = -movementSpeed;
// 			return dz;
// 		case "s":
// 			dz = movementSpeed;
// 			return dz;
// 		case "ArrowUp":
// 			dalpha = rotationSpeed;
// 			return dalpha;
// 		case "ArrowDown":
// 			dalpha = -rotationSpeed;
// 			return dalpha;
// 		case "ArrowLeft":
// 			dbeta = rotationSpeed;
// 			return dbeta;
// 		case "ArrowRight":
// 			dbeta = -rotationSpeed;
// 			return dbeta;
// 		case "q":
// 			dgamma = rotationSpeed;
// 			return dgamma;
// 		case "e":
// 			dgamma = -rotationSpeed;
// 			return dgamma;
// 	}
// });

// document.addEventListener('keyup', function(event) {
// 	switch (event.key) {
// 		case "a":
// 			dx = 0;
// 			return dx;
// 		case "d":
// 			dx = 0;
// 			return dx;
// 		case "r":
// 			dy = 0;
// 			return dy;
// 		case "f":
// 			dy = 0;
// 			return dy;
// 		case "w":
// 			dz = 0;
// 			return dz;
// 		case "s":
// 			dz = 0;
// 			return dz;
// 		case "ArrowUp":
// 			dalpha = 0;
// 			return dalpha;
// 		case "ArrowDown":
// 			dalpha = 0;
// 			return dalpha;
// 		case "ArrowLeft":
// 			dbeta = 0;
// 			return dbeta;
// 		case "ArrowRight":
// 			dbeta = 0;
// 			return dbeta;
// 		case "q":
// 			dgamma = 0;
// 			return dgamma;
// 		case "e":
// 			dgamma = 0;
// 			return dgamma;
// 	}
// });


// Initial camera position
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 4;
camera.lookAt( 0,0,0 );