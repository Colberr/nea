class Sidebar {
	constructor() {
		this.modules = {};
	}

	createHash() {
		var d = new Date;
		var x = d.getTime();
		x = x.toString(10).split('').map(Number);
		var s = 0;

		for (var i=0;i<Math.floor(x.length / 2);i++) {
			var a = x[i+1];
			var b = x[i+1+Math.floor(x.length / 2)];

			if (a == 0 && b == 0) {}
			else {
				s += Math.pow(a,b);
			}
		}

		s = s % 9973;
		return s.toString(36);
	}

	addLineModule() {
		var hash = this.createHash();
		var module = new LineModule(hash);

		this.modules[hash] = module;
		document.getElementById("side-middle").appendChild(module.module);
	}
}

class LineModule {
	constructor(id) {
		this.id = "l" + id;
		this.state = "setup";

		this.module = document.createElement("div");
		this.module.setAttribute("class","module");
		this.module.setAttribute("id",this.id);

		this.setup();
	}

	setup() {
		const options = ["lineAB"];
		const id = this.id;
		 
		var header = document.createElement("h2");
		header.innerHTML = "Selection Format:";
		this.module.appendChild(header);

		// Loops through each relevant radio option (as defined at start of function)
		for (var i=0;i<options.length;i++) {
			var radio = document.createElement("input");
			radio.setAttribute("type","radio");
			radio.setAttribute("name",this.id + "-" + "format");
			radio.setAttribute("value",options[i]);
			radio.setAttribute("id",this.id + "-" + options[i]);
			this.module.appendChild(radio);

			var label = document.createElement("label");
			label.setAttribute("for",this.id + "-" + options[i])
			label.innerHTML = options[i];
			this.module.appendChild(label);

			var br = document.createElement("br");
			this.module.appendChild(br);
		}

		var button = document.createElement("button");
		button.setAttribute("onclick","chooseFormat(this)");
		button.innerHTML = "Submit";
		this.module.appendChild(button);
	
	}


}

var x = new Sidebar;

function createNewModule(type) {
	if (type == "line") {
		x.addLineModule();
	} 
	else if (type == "plane") {
		x.addPlaneModule();
	} else {}
}

function chooseFormat(element) {
	var id = element.parentNode.id;

	// *****
}

// ---------------------------------------

var allowCreation = true;

function func(e) {
	var div = e.parentNode;
	var type = div.id;
	console.log(type);
}

// ---------------------------------------

// function createNewModule(n,e="") {
// 	// n=0 : line format selection
// 	// n=1 : plane format selection
// 	//
// 	// n=2 : lineAB
// 	// n=3 : planeABC
// 	// n=4 : planeAN
// 	// n=5 : planeND

// 	if ((n == 0 || n == 1) && allowCreation) {
// 		allowCreation = false;
// 		n = parseInt(n)
// 		const radios = [
// 			["lineAB"],
// 			["planeABC","planeAN","planeND"]
// 		]

// 		var module = document.createElement("div");
// 		module.setAttribute("class","module");
		 
// 		var header = document.createElement("h2");
// 		header.innerHTML = "Selection Format:";
// 		module.appendChild(header);

// 		// Loops through each relevant radio option (as defined at start of function)
// 		radios[n].forEach(function (elem, index) {
// 			var radio = document.createElement("input");
// 			radio.setAttribute("type","radio");
// 			radio.setAttribute("name","format");
// 			radio.setAttribute("value",elem);
// 			radio.setAttribute("id",elem);
// 			module.appendChild(radio);

// 			var label = document.createElement("label");
// 			label.setAttribute("for",elem)
// 			label.innerHTML = elem;
// 			module.appendChild(label);

// 			var br = document.createElement("br");
// 			module.appendChild(br);
// 		});

// 		var button = document.createElement("button");
// 		button.setAttribute("onclick","createNewModule(5,this)");		// ****Need to change the 5 to be based on what format is selected with the radio buttons
// 		button.innerHTML = "Submit";
// 		module.appendChild(button);
	
// 		document.getElementById("side-middle").appendChild(module);
// 	} 
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