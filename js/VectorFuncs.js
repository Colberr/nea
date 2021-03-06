const funcReqs = {
	"relationshipLineAndPoint":[1,0,1],
	"distanceLineToPoint":[1,0,1],
	"relationshipTwoLines":[2,0,0],
	"distanceLineToLine":[2,0,0],
	"meetingPointTwoLines":[2,0,0],
	"relationshipLineAndPlane":[1,1,0],
	"distanceLineToPlane":[1,1,0],
	"meetingPointLineAndPlane":[1,1,0],
	"relationshipPlaneAndPoint":[0,1,1],
	"distancePlaneToPoint":[0,1,1]
} // The number of lines, planes and points (respectively) that are required to use each function

// Line 
class Line {
	constructor(posV,dirV) {
		this.posV = posV;
		this.dirV = dirV;

		this.drawShape();
	}

	resetValues() {
		this.posV = null;
		this.dirV = null;
		this.deleteShape();
	}

	drawShape() {
		var drawPoints = []; // The extreme points from which a line is drawn between
		for (var sign=-1; sign<=1; sign+=2) {
			var lambda = - (graph.dot(this.posV,this.dirV) / graph.dot(this.dirV,this.dirV));
			var Q = graph.add(this.posV, graph.scale(lambda + sign * axisLength * Math.sqrt(3) * 0.6,graph.unitV(this.dirV)));

			drawPoints.push(
				new THREE.Vector3(Q[0], Q[1], Q[2])
			);
		}
	
		const lineMaterial = new THREE.LineBasicMaterial( {color: Math.random() * 0xffffff} );
		this.shapeObj = new THREE.Line(new THREE.BufferGeometry().setFromPoints(drawPoints), lineMaterial);

		scene.add(this.shapeObj);
		return this.shapeObj;
	}

	deleteShape() {
		scene.remove(this.shapeObj);
	}
}

// Plane
class Plane {
	constructor(normal, constant, posV=null) {
		this.normal = normal;
		this.constant = constant;

		if (this.posV != null) {
			this.posV = posV;
		} else {
			var lambda = this.constant / graph.dot(this.normal,this.normal);
			this.posV = [
				lambda * this.normal[0],
				lambda * this.normal[1],
				lambda * this.normal[2]
			];
		}

		this.drawShape();
	}

	resetValues() {
		this.normal = null;
		this.constant = null;
		this.posV = null;
		this.deleteShape();
	}
	
	drawShape() {
		var planeGeometry = new THREE.PlaneGeometry(axisLength * 1.4, axisLength * 1.4);
		var planeMaterial = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff, side: THREE.DoubleSide} );
		planeMaterial.transparent = true;
		planeMaterial.opacity = 0.8;
		this.shapeObj = new THREE.Mesh( planeGeometry, planeMaterial );

		// Position
		this.shapeObj.position.x = this.posV[0];
		this.shapeObj.position.y = this.posV[1];
		this.shapeObj.position.z = this.posV[2];

		// Rotation
		this.shapeObj.lookAt(this.normal[0], this.normal[1], this.normal[2]);


		scene.add(this.shapeObj);
		return this.shapeObj;
	}

	deleteShape() {
		scene.remove(this.shapeObj);
	}
}

// Point 
class Point {
    constructor(vals) {
        this.vals = vals;

		this.drawShape();
    }

	resetValues() {
		this.vals = null;
		this.deleteShape();
	}

    drawShape() {
		var geometry = new THREE.SphereGeometry( 0.05 );
		var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
		this.shapeObj = new THREE.Mesh( geometry, material );

		this.shapeObj.position.x = this.vals[0];
		this.shapeObj.position.y = this.vals[1];
		this.shapeObj.position.z = this.vals[2];

		scene.add(this.shapeObj);
		return this.shapeObj;
    }
	
	deleteShape() {
		scene.remove(this.shapeObj);
	}
}

// Whole Graph
class Graph {
	constructor() {
		this.axisLen = 100;
		this.content = {};
	}
	
	// ------------------------
	// Common Functions
	toRad(x) { return x * (Math.PI / 180) };
	toDeg(x) { return x * (180 / Math.PI) };

	scale(t,a) {
		// Scale multiplication (ie; just multiplying by same number)
		return [
			t * a[0],
			t * a[1],
			t * a[2]
		];
	}

	dot(a,b) {
		// a.b
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}
	
	cross(a,b) {
		// a×b
		return [
			a[1] * b[2] - a[2] * b[1],
			- (a[0] * b[2] - a[2] * b[0]),
			a[0] * b[1] - a[1] * b[0]
		];
		
	}
	
	triple(a,b,c) {
		// a.(b×c)
		return dot(a,cross(b,c));
	}

	add(a,b) {
		// a + b
		return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
	}

	subtract(a,b) {
		// a - b --> a + (-b)
		return this.add(a,this.scale(-1,b));
	}
	
	mag(a) {
		// |a|
		return Math.sqrt(
			Math.pow(a[0],2) + Math.pow(a[1],2) + Math.pow(a[2],2)
		);
	}

	dotAngle(a,b) {
		// θ = cos-1( (a.b) / (|a||b|) )
		return this.toDeg(Math.acos(
			Math.abs( this.dot(a,b) / (this.mag(a) * this.mag(b)) )
		));
	}

	notValid(arr) {
		// Checks that each vector in arr is length 3
		for (var i=0;i<arr.length;i++) {
			if (arr[i].length != 3) { return true };
		}

		return false;
	}

	unitV(a) {
		// Returns unit vector of a
		let l = this.mag(a);

		return [
			a[0] / l,
			a[1] / l,
			a[2] / l
		];
	}

	equalVectors(a,b) {
		// Checks two vectors are exactly equal
		return a[0] == b[0] && a[1] == b[1] && a[2] == b[2]
	}

	equalDir(a,b) {
		// Checks if two vectors have the same direction
		if (this.equalVectors(a,b)) { return true };

		a = this.scale(-1,a);
		return this.equalVectors(a,b);
	}

	// ------------------------
	// Creating Lines, Planes & Points
	createLineFromAB(a,b,id) {
		// l: r = a + λb
		if (this.notValid([a,b])) { return false };
		
		this.content[id] = new Line(a,b);
		return this.content[id];
	}
	
	createPlaneFromND(n,d,id) {
		// Π: r.n = d
		if (this.notValid([n])) { return false };
		
		this.content[id] = new Plane(n,d);
		return this.content[id];
	}

	createPlaneFromAN(a,n,id) {
		// Π: r.n = a.n
		if (this.notValid([a,n])) { return false };
		
		this.content[id] = new Plane(n,this.dot(a,n),a);
		return this.content[id];
	}
	
	createPlaneFromABC(a,b,c,id) {
		// Π: r = a + λb + μc --> Π: r.n = a.n
		if (this.notValid([a,b,c])) { return false };
		
		let n = this.cross(b,c);
		return this.createPlaneFromAN(a,n,id);
	}

    createPoint(p,id) {
        // Position vector (column)
		if (this.notValid([p])) { return false };

        this.content[id] = new Point(p);
        return this.content[id];
    }  
	
	// ------------------------
	// Additional Line Functions

	lineThroughPosition(line,p) { 
		if (this.notValid([p])) { return false };

		let lambdas = [];

		for (var i=0;i<3;i++) {
			lambdas.push((p[i] - line.posV[i]) / line.dirV[i]);
		}

		if (lambdas[0] == lambdas[1] && lambdas[0] == lambdas[2]) {
			return true;
		} else {
			return false;
		}
	}

    relationshipLineAndPoint(line,point) {
        if (this.lineThroughPosition(line,point.vals)) {
			return "Intersect"
		} else {
			return "Do not meet"
		}
    }

	distanceLineToPosition(line,p) {
		if (this.notValid([p])) { return false };
		
		if (this.lineThroughPosition(line,p)) { return 0 };

		let l2 = this.subtract(p,line.posV);
		let angle = this.dotAngle(l2,line.dirV);

		return this.mag(l2) * Math.sin(this.toRad(angle));
	}

    distanceLineToPoint(line,point) {
        return this.distanceLineToPosition(line,point.vals);
    }

	relationshipTwoLines(l1,l2) {
		if (this.equalDir(l1.dirV,l2.dirV)) {
			if (this.lineThroughPosition(l1,l2.posV)) {
				return "Identical"
			} else {
				return "Parallel"
			}
		} 
		else if (this.lineThroughPosition(l1,l2.posV)) {
			return "Cross"
		} else {
			return "Skew"
		}
	}

	distanceLineToLine(l1,l2) {
		if (this.relationshipTwoLines(l1,l2) != "Skew") { return 0 };
		let normal = this.cross(l1.dirV,l2.dirV)

		return Math.abs(
			this.dot(this.subtract(l1.posV,l2.posV), normal) / this.mag(normal)
		);
	}
	
	meetingPointTwoLines(l1,l2) {
		if (this.relationshipTwoLines(l1,l2) != "Cross") { return false };

		var lambda = (l2.posV[1] - l1.posV[1] + ((l2.dirV[1] * (l1.posV[0] - l2.posV[0])) / l2.dirV[0])) /  (l1.dirV[1] - (l1.posV[0] * l2.dirV[1] / l2.dirV[0]));
		var mu = (l1.posV[0] - l2.posV[0] (l1.dirV[0] * lambda)) / l2.dirV[0];
		
		if (l1.posV[2] + (l1.dirV[2] * lambda) == l2.posV + (l2.dirV[2] * mu)) {
			return true;
		}
		
		return false;
	}
	
	relationshipLineAndPlane(line,plane) {
		if (this.dotAngle(line.dirV,plane.normal) == 90) {
			if (this.dot(line.posV,plane.normal) == plane.constant) {
				return "Inside";
			} else {
				return "Parallel";
			}
		} else {
			return "Meet";
		}
	}

	distanceLineToPlane(line,plane) {
		if (this.relationshipLineAndPlane(line,plane) != "Parallel") {
			return 0;
		}

		return this.distancePlaneToPosition(plane,line.posV);
	}

	meetingPointLineAndPlane(line,plane) {
		if (this.relationshipLineAndPlane(line,plane) != "Meet") {
			return false;
		}

		if (this.dot(line.posV,plane.normal) == plane.constant) {
			return line.posV;
		} else {
			var lambda = (plane.normal - this.dot(line.posV,plane.normal)) / this.dot(line.dirV,plane.normal) // XXX*** Not finished?
		}
	}

	// ------------------------
	// Additional Plane Functions

	planeThroughPosition(plane,p) {
		if (this.notValid([p])) { return false };
		
		for (var i=0;i<3;i++) {
			if (this.dot(p,plane.normal) != plane.constant) {
				return false;
			}
		}

		return true;
	}

    relationshipPlaneAndPoint(plane,point) {
        return this.planeThroughPosition(plane,point.vals);
    }

	distancePlaneToPosition(plane,p) {
		if (this.notValid([p])) { return false };
		
		if (this.planeThroughPosition(plane,p)) { return 0 };

		return Math.abs(this.dot(plane.normal,p) - plane.constant) / this.mag(plane.normal);
	}

    distancePlaneToPoint(plane,point) {
        return this.distancePlaneToPosition(plane,point.vals)
    }
}
