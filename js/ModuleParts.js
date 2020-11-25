// Contains parts used to construct modules for sidebar
class ModuleParts {
	constructor() {
		this.tr = document.createElement("tr");
		this.tr.setAttribute("class","byCol");

		this.td = document.createElement("td");
		this.td.setAttribute("class","byCol");
	}

	// ----------------------------------------------
	// Functions for the table

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

	manualColumnVectorInput(table,input) {
		this.td.innerHTML = input;
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

	// ----------------------------------------------
	// Functions that go straight in the Module

	createHeader(value) {
		var h2 = document.createElement("h2");
		h2.innerHTML = value;
		return h2;
	}

	createButton(value,onclick,id) {
		var btn = document.createElement("button");
		btn.setAttribute("onclick",onclick)
		btn.setAttribute("id",id);
		btn.innerHTML = value;
		return btn;
	}

	// Preset function for creating a Delete Module button
	createDeleteButton(id) {
		return this.createButton("Delete Module","deleteModule(this.id)",id)
	}
}