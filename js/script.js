class ModuleParts {
	constructor() {
		this.tr = document.createElement("tr");
		this.tr.setAttribute("class","byCol");

		this.td = document.createElement("td");
		this.td.setAttribute("class","byCol");
	}

	cleartrtd() {
		this.tr.innerHTML = "";
		this.td.innerHTML = "";
	}

	createColumn(table,td,n=1) {
		for (var i=0;i<n;i++) {
			this.tr.appendChild(td.cloneNode(true));
		}
		table.appendChild(this.tr.cloneNode(true));
		this.cleartrtd();

		return table;
	}

	columnVectorInput(table) {
		this.td.innerHTML = '<input class="sml-input" type="number">';
		table = this.createColumn(table,this.td,3);

		return table;
	}

	singleInput(table) {
		this.td.innerHTML = '<input class="sml-input" type="number">';
		table = this.createColumn(table,this.td);

		return table;
	}

	singleString(table,string) {
		this.td.innerHTML = string;
		table = this.createColumn(table,this.td);

		return table;
	}
}

var mp = new ModuleParts;

class Sidebar {
	constructor() {
		this.modules = {};
	}

	createHash() {
		var d = new Date;
		var x = d.getTime();
		x = x.toString(10).split('').map(Number); // Splits the time (in milliseconds) into an array of integers
		var s = 0;

		// See OneNote (XXXXXXXX) for details
		for (var i=0;i<Math.floor(x.length / 2);i++) {
			var a = x[i+1];
			var b = x[i+1+Math.floor(x.length / 2)];

			if (a == 0 && b == 0) {}
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
		} else {
			return false;
		}

		this.modules[module.id] = module;
		document.getElementById("side-middle").appendChild(module.module);
	}
}

class Module {
	constructor() {
		this.state = "formatSelect";

		this.module = document.createElement("div");
		this.module.setAttribute("class","module");
	}

	showFormatSelector() {
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
			radio.setAttribute("value",this.formatOptions[i]);
			radio.setAttribute("id",this.id + "-" + this.formatOptions[i]);
			this.module.appendChild(radio);

			// Label elements means that you can click on the text and it'll still select that radio button
			var label = document.createElement("label");
			label.setAttribute("for",this.id + "-" + this.formatOptions[i])
			label.innerHTML = this.formatOptions[i];
			this.module.appendChild(label);

			var br = document.createElement("br");
			this.module.appendChild(br);
		}

		var button = document.createElement("button");
		button.setAttribute("onclick","chooseFormat(this)");
		button.innerHTML = "Submit";
		this.module.appendChild(button);
	
	}

	showValueInput(format) {
		this.module.innerHTML = "";
			
		var header = document.createElement("h2");
		header.innerHTML = "Input values (" + format + "):";
		this.module.appendChild(header);

		var table = document.createElement("table");
		table.setAttribute("class","byCol"); // byCol class means that tables are created by column instead of row, see XXXXXXX

		switch (format) {
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

		var button1 = document.createElement("button");
		button1.setAttribute("onclick","chooseFormat(this)"); // ***** XXXXXXX
		button1.innerHTML = "Set";
		table.appendChild(button1);
		
		var button2 = document.createElement("button");
		button2.setAttribute("onclick","chooseFormat(this)"); // ***** XXXXXXX
		button2.innerHTML = "Change Format";
		table.appendChild(button2);
		
		this.module.appendChild(table);
		return table;
	}

}

class LineModule extends Module {
	constructor(id) {
		super();
		this.id = "l" + id;
		this.formatOptions = ["lineAB"];
		
		this.showFormatSelector();
	}
}

class PlaneModule extends Module {
	constructor(id) {
		super();
		this.id = "p" + id;
		this.formatOptions = ["planeABC","planeAN","planeND"];
		
		this.showFormatSelector();
	}
}


// -------------------------------------

var x = new Sidebar;

function createNewModule(type) { x.addNewModule(type) };

function chooseFormat(element) {
	var module = element.parentNode;
	var radios = module.getElementsByTagName("input");
	var format;

	for (var i=0;i<radios.length;i++){
		if (radios[i].checked) {
			format = radios[i].value;
			break;
		}
	}
	
	x.modules[module.id].showValueInput(format);
}

// ---------------------------------------


// ---------------------------------------

// 	else if (n == 2) {
// 		allowCreation = true;
// 		var module = document.createElement("div");
// 		module.setAttribute("class","module");
		 
// 		var header = document.createElement("h2");
// 		header.innerHTML = "Create line (lineAB):";
// 		module.appendChild(header);

// 		var table = document.createElement("table");
// 		table.setAttribute("class","byCol");

// 		var tr = document.createElement("tr");
// 		tr.setAttribute("class","byCol");

// 		var td = document.createElement("td");
// 		td.setAttribute("class","byCol");

// 		td.innerHTML = "<i>l</i>:r=(";
// 		tr.appendChild(td.cloneNode(true));		// Need to clone them so that I can reuse the variables 
// 		table.appendChild(tr.cloneNode(true)); 	// ^(otherwise I'd have to declare new ones every time)
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = '<input class="sml-input" type="number">';
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = ")+&lambda;(";
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = '<input class="sml-input" type="number">';
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = ")";
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));

// 		module.appendChild(table);
// 		document.getElementById("side-middle").appendChild(module);
// 	} 

// 	//**** STUFF NEEDS TO GO HERE !!!! (n=3,4)

// 	else if (n == 5) {
// 		allowCreation = true;
// 		// PlaneND
// 		var module = document.createElement("div");
// 		module.setAttribute("class","module");
		 
// 		var header = document.createElement("h2");
// 		header.innerHTML = "Create line (planeND):";
// 		module.appendChild(header);

// 		var table = document.createElement("table");
// 		table.setAttribute("class","byCol");

// 		var tr = document.createElement("tr");
// 		tr.setAttribute("class","byCol");

// 		var td = document.createElement("td");
// 		td.setAttribute("class","byCol");

// 		td.innerHTML = "<i>&Pi;</i>:r.(";
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = '<input class="sml-input" type="number">';
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = ")=";
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));
// 		tr.innerHTML = "";
// 		td.innerHTML = "";

// 		td.innerHTML = '<input class="sml-input" type="number">';
// 		tr.appendChild(td.cloneNode(true));
// 		table.appendChild(tr.cloneNode(true));

// 		module.appendChild(table);
// 		document.getElementById("side-middle").appendChild(module);
// 	} 
// 	else {
// 		return False;
// 	}
// }

/*

<div class="module">
	<h2>Line (L1)</h2>
	<table class="byCol">
		<tr class="byCol">
			<td class="byCol"><i>l</i>:r=(</td>
		</tr>
		<tr class="byCol">
			<td class="byCol"><input class="sml-input" type="number"></td>
			<td class="byCol"><input class="sml-input" type="number"></td>
			<td class="byCol"><input class="sml-input" type="number"></td>
		</tr>
		<tr class="byCol">
			<td class="byCol">+&lambda;</td>
		</tr>
		<tr class="byCol">
			<td class="byCol"><input class="sml-input" type="number"></td>
			<td class="byCol"><input class="sml-input" type="number"></td>
			<td class="byCol"><input class="sml-input" type="number"></td>
		</tr>
		<tr class="byCol">
			<td class="byCol">)</td>
		</tr>
	</table>
</div>

*/