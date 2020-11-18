// Contains parts used to construct modules for sidebar
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