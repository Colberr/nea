// Classes for defining line or plane module objects
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