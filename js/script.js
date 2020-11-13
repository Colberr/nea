var allowCreation = true;

function func(e) {
	var div = e.parentNode;
	var type = div.className;
	console.log(type);
}

// ---------------------------------------

function createNewModule(n,e="") {
	// n=0 : line format selection
	// n=1 : plane format selection
	//
	// n=2 : lineAB
	// n=3 : planeABC
	// n=4 : planeAN
	// n=5 : planeND

	if (n == 0 || n == 1) {
		allowCreation = false;
		n = parseInt(n)
		const radios = [
			["lineAB"],
			["planeABC","planeAN","planeND"]
		]

		var module = document.createElement("div");
		module.setAttribute("class","module");
		 
		var header = document.createElement("h2");
		header.innerHTML = "Selection Format:";
		module.appendChild(header);

		// Loops through each relevant radio option (as defined at start of function)
		radios[n].forEach(function (elem, index) {
			var radio = document.createElement("input");
			radio.setAttribute("type","radio");
			radio.setAttribute("name","format");
			radio.setAttribute("value",elem);
			radio.setAttribute("id",elem);
			module.appendChild(radio);

			var label = document.createElement("label");
			label.setAttribute("for",elem)
			label.innerHTML = elem;
			module.appendChild(label);

			var br = document.createElement("br");
			module.appendChild(br);
		});

		var button = document.createElement("button");
		button.setAttribute("onclick","createNewModule(5,this)");		// ****Need to change the 5 to be based on what format is selected with the radio buttons
		button.innerHTML = "Submit";
		module.appendChild(button);
	
		document.getElementById("side-middle").appendChild(module);
	} 
	else if (n == 2) {
		var module = document.createElement("div");
		module.setAttribute("class","module");
		 
		var header = document.createElement("h2");
		header.innerHTML = "Create line (lineAB):";
		module.appendChild(header);

		var table = document.createElement("table");
		table.setAttribute("class","byCol");

		var tr = document.createElement("tr");
		tr.setAttribute("class","byCol");

		var td = document.createElement("td");
		td.setAttribute("class","byCol");

		td.innerHTML = "<i>l</i>:r=(";
		tr.appendChild(td.cloneNode(true));		// Need to clone them so that I can reuse the variables 
		table.appendChild(tr.cloneNode(true)); 	// ^(otherwise I'd have to declare new ones every time)
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = '<input class="sml-input" type="number">';
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = ")+&lambda;(";
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = '<input class="sml-input" type="number">';
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = ")";
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));

		module.appendChild(table);
		document.getElementById("side-middle").appendChild(module);
	} 

	//**** STUFF NEEDS TO GO HERE !!!! (n=3,4)

	else if (n == 5) {
		// PlaneND
		var module = document.createElement("div");
		module.setAttribute("class","module");
		 
		var header = document.createElement("h2");
		header.innerHTML = "Create line (planeND):";
		module.appendChild(header);

		var table = document.createElement("table");
		table.setAttribute("class","byCol");

		var tr = document.createElement("tr");
		tr.setAttribute("class","byCol");

		var td = document.createElement("td");
		td.setAttribute("class","byCol");

		td.innerHTML = "<i>&Pi;</i>:r.(";
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = '<input class="sml-input" type="number">';
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = ")=";
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));
		tr.innerHTML = "";
		td.innerHTML = "";

		td.innerHTML = '<input class="sml-input" type="number">';
		tr.appendChild(td.cloneNode(true));
		table.appendChild(tr.cloneNode(true));

		module.appendChild(table);
		document.getElementById("side-middle").appendChild(module);
	} 
	else {
		return False;
	}
}

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