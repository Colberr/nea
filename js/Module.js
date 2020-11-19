// Stuff for MathJax
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

	showFormatSelector() {
		this.state = "formatSelect";
		this.module.setAttribute("id",this.id);
		this.module.innerHTML = "";

		var header = document.createElement("h2");
		header.innerHTML = "Selection Format:";
		this.module.appendChild(header);

		// Loops through each relevant radio option (as defined at start of function)
		for (var i=0;i<this.formatOptions.length;i++) {
			var radio = document.createElement("input");
			radio.setAttribute("type","radio");
			radio.setAttribute("name",this.id + "-" + "format");
			radio.setAttribute("value",this.formatOptions[i][0]);
			radio.setAttribute("id",this.id + "-" + this.formatOptions[i][0]);
			this.module.appendChild(radio);

			// Label elements means that you can click on the text and it'll still select that radio button
			// var label = document.createElement("label");
			// label.setAttribute("for",this.id + "-" + this.formatOptions[i][0])
			// label.innerHTML = this.prepareEquation(this.formatOptions[i][1]);
			var x = this.prepareEquation(this.formatOptions[i][1]);
			console.log(x);
			this.module.appendChild(x);

			var br = document.createElement("br");
			this.module.appendChild(br);
		}

		var button = document.createElement("button");
		button.setAttribute("onclick","chooseFormat(this)");
		button.innerHTML = "Submit";
		this.module.appendChild(button);
	
	}

	showValueInput(format) {
		this.state = "valueInput";
		this.format = format;
		this.module.innerHTML = "";
			
		var header = document.createElement("h2");
		header.innerHTML = "Input values (" + this.format + "):";
		this.module.appendChild(header);

		var table = document.createElement("table");
		table.setAttribute("class","byCol"); // byCol class means that tables are created by column instead of row, see XXXXXXX

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
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")=(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,").(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")");
				break;
			case "planeND":
				table = mp.singleString(table,"<i>&Pi;</i>:r.(");
				table = mp.columnVectorInput(table);
				table = mp.singleString(table,")=");
				table = mp.singleInput(table);
				break;
			default:
				this.module.innerHTML = "";
				return false;
		}

		table = mp.addButton(table,"Set","setValues(this)")
		table = mp.addButton(table,"Change Format","changeFormat(this)")

		this.module.appendChild(table);
		return table;
	}

	prepareEquation(myEq) {
		var equation = document.createElement("span");
		equation.setAttribute("class","equation");

		typeset(() => {
			equation.innerHTML = myEq;
		});
		
		return equation;
	}

	showEquation() {
		this.module.innerHTML = "";
			
		var header = document.createElement("h2");
		header.innerHTML = "Current values (" + this.format + "):";
		this.module.appendChild(header);

		var div = this.prepareEquation(this.equation);
		this.module.appendChild(div);
		
		var button = document.createElement("button");
		button.setAttribute("onclick","editValues(this)");
		button.innerHTML = "Edit Values";
		this.module.appendChild(button);

	}
}

class LineModule extends Module {
	constructor(id) {
		super();
		this.id = "l" + id;
		this.formatOptions = [["lineAB",'$$l:r=a+\\lambda b$$']];
		
		this.showFormatSelector();
	}

	parseValues(values) {
		switch (this.format) {
			case "lineAB":
				var posV = values.slice(0,3);
				var dirV = values.slice(3,6);

				this.equation = '$$r=\\colv{' + posV[0] + '\\\\' + posV[1] + '\\\\' + posV[2] + '}+\\lambda\\colv{' + dirV[0] + '\\\\' + dirV[1] + '\\\\' + dirV[2] + '}$$';
				this.showEquation();

				return graph.createLineFromAB(posV,dirV,this.id);
			default:
				return false;
		}
	}
}

class PlaneModule extends Module {
	constructor(id) {
		super();
		this.id = "p" + id;
		this.formatOptions = [
			["planeABC",'$$\\Pi :r=a+\\lambda b+\\mu c$$'],
			["planeAN",'$$\\Pi :r.n=a.n$$'],
			["planeND",'$$\\Pi :r.n=d$$']
		];
		
		this.showFormatSelector();
	}

	parseValues(values) {
		switch (this.format) {
			case "planeABC":
				var a = values.slice(0,3);
				var b = values.slice(3,6);
				var c = values.slice(6,9);

				this.equation = '$$r=\\colv{' + a[0] + '\\\\' + a[1] + '\\\\' + a[2] + '}+\\lambda\\colv{' + b[0] + '\\\\' + b[1] + '\\\\' + b[2] + '}+\\mu\\colv{' + c[0] + '\\\\' + c[1] + '\\\\' + c[2] + '}$$';
				this.showEquation();

				return graph.createPlaneFromABC(a,b,c,this.id);
			case "planeAN":
				var n = values.slice(0,3);
				var a = values.slice(3,6);

				this.equation = '$$r.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}=\\colv{' + a[0] + '\\\\' + a[1] + '\\\\' + a[2] + '}.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}$$';
				this.showEquation();

				return graph.createPlaneFromAN(a,n,this.id);
			case "planeND":
				var n = values.slice(0,3);
				var d = values[3];

				this.equation = '$$r.\\colv{' + n[0] + '\\\\' + n[1] + '\\\\' + n[2] + '}=' + d + '$$';
				this.showEquation();

				return graph.createPlaneFromND(n,d,this.id);
			default:
				return false;
		}
	}
}