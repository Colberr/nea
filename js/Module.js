// Code for executing MathJax in JavaScript
let promise = Promise.resolve();
function typeset(code) {
	promise = promise.then(() => {return MathJax.typesetPromise(code());})
		.catch((err) => console.log('Typeset failed: ' + err.message));
	return promise;
}

// Classes for defining line or plane module objects
class Module {
	constructor() {
		this.state = "#";
		this.format = "#";
		this.equation = "#";

		this.module = document.createElement("div");
		this.module.setAttribute("class","module");
	}

	showFormatSelector(headertext="Select Format:") {
		this.state = "formatSelect";
		this.format = "#";
		this.module.setAttribute("id",this.id);
		this.module.innerHTML = "";

		// Header
		this.module.appendChild(
			mp.createHeader(headertext)
		);

		// Loops through each relevant radio option (as defined at start of function)
		for (var i=0;i<this.formatOptions.length;i++) {
			// Creates and sets up the radio button
			var radio = document.createElement("input");
			radio.setAttribute("type","radio");
			radio.setAttribute("name",this.id + "-" + "format");
			radio.setAttribute("value",this.formatOptions[i][0]);
			radio.setAttribute("class",this.id + "-" + this.formatOptions[i][0]);
			this.module.appendChild(radio);

			// Displays the actual equation formala (using MathJax via this.prepareEquation)
			var equationSpan = this.prepareEquation(this.formatOptions[i][1]);
			equationSpan.setAttribute("id",this.id + "-" + this.formatOptions[i][0]);
			equationSpan.setAttribute("onclick","clickFormat(this.id)");
			this.module.appendChild(equationSpan);
		}

		// Buttons
		this.module.appendChild(
			mp.createButton("Submit","chooseFormat(this.id)",this.id)
		);
		this.module.appendChild(mp.createDeleteButton(this.id));

		return this.id;
	}

	showValueInput(format) {
		this.state = "valueInput";
		this.format = format;
		this.module.innerHTML = "";
			
		// Header
		this.module.appendChild(
			mp.createHeader("Input values:")
		);

		var table = document.createElement("table");
		table.setAttribute("class","byCol"); // byCol class means that tables are created by column instead of row

		// Will display the correct input boxes for the chosen format 
		switch (this.format) {
			case "lineAB":
				table = mp.singleString(table,"<i>l</i>:r=(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")+&lambda;(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")");
				break;
			case "planeABC":
				table = mp.singleString(table,"<i>&Pi;</i>:r=(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")+&lambda;(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")+&mu;(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")");
				break;
			case "planeAN":
				table = mp.singleString(table,"<i>&Pi;</i>:r.(");
				// See script.js, typingNormal() for details on this
				table = mp.manualColumnVectorInput(table,
					'<input class="sml-input typingNormal" type="number" oninput="typingNormal(this)">'
				);
				table = mp.singleString(table,")=(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,").(");
				table = mp.manualColumnVectorInput(table,
					'<input class="sml-input settingNormal" type="number" readonly>'
				);
				table = mp.singleString(table,")");
				break;
			case "planeND":
				table = mp.singleString(table,"<i>&Pi;</i>:r.(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")=");
				table = mp.singleInput(table);
				break;
            case "pointCol":
				table = mp.singleString(table,"P=(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")");
                break;
			default:
				this.module.innerHTML = "";
				return false;
		}

		this.module.appendChild(table);
		this.module.innerHTML += "<br>";

		// Buttons
		this.module.appendChild(
			mp.createButton("Set","setValues(this.id)",this.id)
		);
		this.module.appendChild(
			mp.createButton("Change Format","changeFormat(this.id)",this.id)
		);
		this.module.appendChild(mp.createDeleteButton(this.id));

		return this.id;
	}

	// Takes an a Latex string and parses it through MathJax, resulting in the MathJax elements
	prepareEquation(myEq) {
		var equation = document.createElement("span");
		equation.setAttribute("class","equation");

		typeset(() => {
			equation.innerHTML = myEq;
		});
		
		return equation;
	}

	// This is the actual display state, use this.prepareEquation() to display equations as part of format selection
	displayEquation() {
		this.module.innerHTML = "";
		this.state = "displayEquation";
		
		// Header
		if (this.id.charAt(0) == "l") {
			this.module.appendChild(mp.createHeader("Line Equation:"));
		} else if (this.id.charAt(0) == "p") {
			this.module.appendChild(mp.createHeader("Plane Equation:"));
		} else {
			this.module.appendChild(mp.createHeader("Point:"));
		}

		// Actual MathJax Equation
		var div = this.prepareEquation(this.equation);
		this.module.appendChild(div);
		
		// Buttons
		this.module.appendChild(
			mp.createButton("Edit Values","editValues(this.id)",this.id)
		);
		this.module.appendChild(mp.createDeleteButton(this.id));

		return this.id;
	}

	importEquation(data) {
		this.module.setAttribute("id",this.id);
		this.format = data["format"];
		this.parseValues(data["values"]);
	}
}

class LineModule extends Module {
	constructor(id,imported="") {
		super();
		this.formatOptions = [["lineAB",'$$l:r=a+\\lambda b$$']];
		
		if (imported == "") {
			this.id = "l" + id;
			this.showFormatSelector();
		} else {
			this.id = id;
			this.importEquation(imported);
		}
	}

	parseValues(values) {
		this.values = values;
		
		switch (this.format) {
			case "lineAB":
				var posV = values.slice(0,3);
				var dirV = values.slice(3,6);

				this.equation = '$$r=\\colv{' + posV[0] + '\\\\' + posV[1] + '\\\\' + posV[2] + '}+\\lambda\\colv{' + dirV[0] + '\\\\' + dirV[1] + '\\\\' + dirV[2] + '}$$';
				this.displayEquation();

				return graph.createLineFromAB(posV,dirV,this.id);
			default:
				return false;
		}
	}
}

class PlaneModule extends Module {
	constructor(id,imported="") {
		super();
		this.formatOptions = [
			["planeABC",'$$\\Pi :r=a+\\lambda b+\\mu c$$'],
			["planeAN",'$$\\Pi :r.n=a.n$$'],
			["planeND",'$$\\Pi :r.n=d$$']
		];
		
		if (imported == "") {
			this.id = "p" + id;
			this.showFormatSelector();
		} else {
			this.id = id;
			this.importEquation(imported);
		}
	}

	parseValues(values) {
		this.values = values;

		switch (this.format) {
			case "planeABC":
				var a = values.slice(0,3);
				var b = values.slice(3,6);
				var c = values.slice(6,9);

				this.equation = '$$r=\\colv{' + a[0] + '\\\\' + a[1] + '\\\\' + a[2] + '}+\\lambda\\colv{' + b[0] + '\\\\' + b[1] + '\\\\' + b[2] + '}+\\mu\\colv{' + c[0] + '\\\\' + c[1] + '\\\\' + c[2] + '}$$';
				this.displayEquation();

				return graph.createPlaneFromABC(a,b,c,this.id);
			case "planeAN":
				this.values = values.slice(0,6);
				var n = values.slice(0,3);
				var a = values.slice(3,6);

				this.equation = '$$r.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}=\\colv{' + a[0] + '\\\\' + a[1] + '\\\\' + a[2] + '}.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}$$';
				this.displayEquation();

				return graph.createPlaneFromAN(a,n,this.id);
			case "planeND":
				var n = values.slice(0,3);
				var d = values[3];

				this.equation = '$$r.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}=' + d + '$$';
				this.displayEquation();

				return graph.createPlaneFromND(n,d,this.id);
			default:
				return false;
		}
	}
}

class PointModule extends Module {
	constructor(id,imported="") {
		super();
		this.formatOptions = [["pointCol",'$$P=\\colv{x\\\\y\\\\z}$$']];
		
		if (imported == "") {
			this.id = "x" + id;
			this.showFormatSelector();
		} else {
			this.id = id;
			this.importEquation(imported);
		}
	}

	parseValues(values) {
		this.values = values;

		switch (this.format) {
			case "pointCol":
				this.equation = '$$P=\\colv{' + values[0] + '\\\\' + values[1] + '\\\\' + values[2] + '}$$';
				this.displayEquation();

				return graph.createPoint(values,this.id);
			default:
				return false;
		}
	}
}

class CalcModule extends Module {
	constructor(id,calculation) {
		super();
		this.calculation = calculation;
		this.operandModules = [];
		this.id = "c" + id;

		this.refresh();
	}

	refresh() {
		this.prepareAllOptions();
		this.selectionIndex = 0;
		this.iterateFormatSelection();
	}

	prepareAllOptions() {
		const modules = sidebar.getValidModuleIds();
		var reqs = funcReqs[this.calculation]; // Will give an array of number of lines, planes and points needed respectively
		var options = [];

		// i: iterates through each element of reqs, j: runs the push code "reqs[i]" times
		for (var i=0;i<reqs.length;i++) {
			for (var j=0;j<reqs[i];j++) {
				options.push(modules[i]);
			}
		}

		this.allOptions = options;
		return this.allOptions;
	}

	formatFormatOptions(arr) {
		var fo = [];
		for (var j=0;j<arr.length;j++) {
			var temp = [arr[j]];
			temp.push(sidebar.modules[arr[j]].equation);
			fo.push(temp)
		}

		return fo;
	}

	iterateFormatSelection() {
		this.formatOptions = this.formatFormatOptions(this.allOptions[this.selectionIndex]);
		this.showFormatSelector("fix this title");
	}

	// Using polymorphism to edit parent object function definition (which is called by a button)
	showValueInput(format) {
		this.operandModules.push(format);
		this.selectionIndex += 1;

		if (this.selectionIndex < this.allOptions.length) {
			this.iterateFormatSelection();
		} else {
			this.calculateDisplayResult();
		}
	}

	calculateDisplayResult() {
		// Calcutions through Graph.js
		var answer = graph[this.calculation](
			graph.content[this.operandModules[0]],
			graph.content[this.operandModules[1]]
		);


		this.module.innerHTML = "";
		this.state = "displayResult";
		
		// Header
		this.module.appendChild(mp.createHeader(this.calculation));

		// Actual MathJax Equation
		var div = this.prepareEquation(sidebar.modules[this.operandModules[0]].equation);
		this.module.appendChild(div);
		var div2 = this.prepareEquation(sidebar.modules[this.operandModules[1]].equation);
		this.module.appendChild(div2);
		var div3 = this.prepareEquation("$$Result: " + answer.toString() + "$$");
		this.module.appendChild(div3);
		
		// Buttons
		this.module.appendChild(
			mp.createButton("Reset","editValues(this.id)",this.id)
		);
		this.module.appendChild(mp.createDeleteButton(this.id));

		return answer;
	}
	
}