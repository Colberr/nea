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
function drawZ0() {
	var basePlaneGeometry = new THREE.PlaneGeometry(axisLength * 1.5, axisLength * 1.5);
	var basePlaneMaterial = new THREE.MeshBasicMaterial({
		color: 0x999999
	});
	basePlaneMaterial.transparent = true;
	basePlaneMaterial.opacity = 0.75;
	var basePlane = new THREE.Mesh(basePlaneGeometry, basePlaneMaterial);
	basePlane.rotateX(- Math.PI / 2);
	scene.add(basePlane);
}
drawZ0();

function update() {

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

// Initial camera position
function setCameraPosition(x,y,z,origin) {
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
	if (origin) { camera.lookAt( 0,0,0 ) };
	
	return [x,y,z];
}
recentreCamera(); // Initial camera position