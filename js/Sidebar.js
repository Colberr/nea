// Object that stores info displayed in sidebar
class Sidebar {
	constructor() {
		this.modules = {};
	}

	// Hashing algorithm to make a unique key for modules
	createHash() {
		var d = new Date;
		var x = d.getTime();
		x = x.toString(10).split('').map(Number); // Splits the time (in milliseconds) into an array of integers
		var s = 0;

		// See OneNote (NEA > Hashing Algorithm) for details
		for (var i=0;i<Math.floor(x.length / 2);i++) {
			var a = x[i+1];
			var b = x[i+1+Math.floor(x.length / 2)];

			if (a == 0 || b == 0) {}
			else {
				s += Math.pow(a,b);
			}
		}

		s = s % 9973; // Just a big prime number to reduce the length
		return s.toString(36);
	}

	addNewModule(type) {
		var hash = this.createHash();

		if (type == "line") {
			var module = new LineModule(hash);
		} 
		else if (type == "plane") {
			var module = new PlaneModule(hash);
		} 
		else if (type == "point") {
			var module = new PointModule(hash);
		} else {
			return false;
		}

		this.modules[module.id] = module;
		document.getElementById("side-middle").appendChild(module.module);
	}

	deleteModule(id) {
		document.getElementById(id).remove();
		delete this.modules[id];
        delete graph.content[id];
	}

	countLinesPlanesPoints() {
		var lines = 0;
		var planes = 0;
        var points = 0;

		for (let id in this.modules) {
			if (id.charAt(0) == "l" && this.modules[id].state == "displayEquation") {
				lines++;
			} 
			else if (id.charAt(0) == "p" && this.modules[id].state == "displayEquation") {
				planes++;
			} 
			else if (id.charAt(0) == "x" && this.modules[id].state == "displayEquation") {
				points++;
			} else {}
		}

		return [lines, planes, points];
	}

	possibleFunctions() {
		var x = this.countLinesPlanesPoints();
		var lines = x[0];
		var planes = x[1];
		var points = x[2];
		var output = [];

		for (let func in funcReqs) {
			if (lines >= funcReqs[func][0] && planes >= funcReqs[func][1] && points >= funcReqs[func][2]) {
				output.push(func);
			}
		}

		return output;
	}

    showPossibleFunctions() {
        var funcs = this.possibleFunctions();
        var cont = document.getElementById("side-bottom");

        for (var i=0; i<funcs.length;i++) {
            var btn = mp.createButton(funcs[i],"testCreateFuncMod(" + funcs[i] + ")","");
            cont.appendChild(btn.cloneNode(true));
        }
    }
}
