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
}

// Line 
class Line {
	constructor(posV,dirV) {
		this.posV = posV;
		this.dirV = dirV;
	}

	getDrawValues() {
		return "test--line";
	}
}

// Plane
class Plane {
	constructor(normal, constant, posV=false) {
		this.normal = normal;
		this.constant = constant;
		this.posV = posV;
	}
	
	getDrawValues() {
		return "test--plane";
	}
}

// Point 
class Point {
    constructor(vals) {
        this.vals = vals;
    }

    getDrawValue() {
        return "test--point";
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
	toRad(x) { return x * (Math.PI / 180); }
	toDeg(x) { return x * (180 / Math.PI); }

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
		// b - a --> (-a) + b
		return this.add(this.scale(-1,a),b);
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
	// Creating Lines & Planes
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

		if (lambdas[0] == lambdas[1] == lambdas[2]) {
			return true;
		} else {
			return false;
		}
	}

    relationshipLineAndPoint(line,point) {
        return this.lineThroughPosition(line,point.vals);
    }

	distanceLineToPosition(line,p) {
		if (this.notValid([p])) { return false };
		
		if (this.lineThroughPosition(line,p)) { return 0 };

		let l2 = this.subtract(line.posV,p);
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
			this.dot(this.subtract(l2.posV,l1.posV), normal) / this.mag(normal)
		);
	}
	
	meetingPointTwoLines(l1,l2) {
		if (this.relationshipTwoLines(l1,l2) != "Cross") { return false };

		var lambda = (l2.posV[1] - l1.posV[1] + ((l2.dirV[1] * (l1.posV[0] - l2.posV[0])) / l2.dirV[0])) /  (l1.dirV[1] - (l1.posV[0] * l2.dirV[1] / l2.diV[0]));
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
