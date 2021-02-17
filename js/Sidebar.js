// Object that stores info displayed in sidebar
class Sidebar {
	constructor() {
		this.modules = {};
	}

	// Hashing algorithm to make a unique key for each module
	createHash() {
		var d = new Date;
		var x = d.getTime();
		x = x.toString(10).split('').map(Number); // Splits the time (in milliseconds) into an array of integers
		var s = 0;

		/*
		This hashing algorithm takes the unicode time in milliseconds and splits it in half.
		Then, each half is iterated through, with the value from the first half being put to the 
		power of the value in the second half. Each of these are summed (variable: s), then the 
		resulting number is divded by 9973 (a prime number) and converted into base-36 (alphanumeric,
		lowercase and numbers) - ending with a 2-3 character hash. 
		*/ 
		for (var i=0;i<Math.floor(x.length / 2);i++) {
			var a = x[i+1];
			var b = x[i+1+Math.floor(x.length / 2)];

			if (a == 0 || b == 0) {}
			else {
				s += Math.pow(a,b);
			}
		}

		s = s % 9973;
		return s.toString(36);
	}

	addNewModule(type, extra) {
		if (extra == "") {
			var id = this.createHash();
		} else {
			var id = extra["id"];
		}
		
		while (id in this.modules) {		// Increments ID if already being used
			var idDec = parseInt(id, 36);
			idDec++;
			id = idDec.toString(36);
		}

		if (type == "line") {
			var module = new LineModule(id, extra);
		} 
		else if (type == "plane") {
			var module = new PlaneModule(id, extra);
		} 
		else if (type == "point") {
			var module = new PointModule(id, extra);
		}
		else if (type == "calc") {
			var module = new CalcModule(id, extra);
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

	// Creates an array of "valid" modules (ie; ones that are ready to be used in calculations)
	getValidModuleIds() {
		var lines = [];
		var planes = [];
        var points = [];

		for (let id in this.modules) {
			if (id.charAt(0) == "l" && this.modules[id].state == "displayEquation") {
				lines.push(this.modules[id].id);
			} 
			else if (id.charAt(0) == "p" && this.modules[id].state == "displayEquation") {
				planes.push(this.modules[id].id);
			} 
			else if (id.charAt(0) == "x" && this.modules[id].state == "displayEquation") {
				points.push(this.modules[id].id);
			} else {}
		}

		return [lines, planes, points];
	}

	countLinesPlanesPoints() {
		return this.getValidModuleIds().map(x => x.length);

		/* Saving time by using higher-order function
		
		var validIds = this.getValidModuleIds();
		var counts = [];
		counts.push(validIds[0].length);
		counts.push(validIds[1].length);
		counts.push(validIds[2].length);

		return counts;
		*/
	}

	// Returns an array of possible functions that can be executed given the number of lines, planes and points there are 
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
		// var cont = document.createElement("div");
		var cont = document.getElementById("calc-btns-cont");
		cont.innerHTML = "";
		// cont.classList.add("calculation-buttons");

        for (var i=0; i<funcs.length;i++) {
			var btn = mp.createButton(funcs[i],"createNewModule('calc','" + funcs[i] + "')","");
			cont.appendChild(btn);	
		}
		
		document.getElementById("side-bottom").appendChild(cont);
		return cont;
    }
}
