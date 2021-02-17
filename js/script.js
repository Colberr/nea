var mp = new ModuleParts;
var sidebar = new Sidebar;
var graph = new Graph;

// --------------------------------------------------
// Object (Module) Functions

function createNewModule(type,extra="") { sidebar.addNewModule(type,extra) };

function clickFormat(id) {
	document.getElementsByClassName(id)[0].checked = true;
}

// Triggered after user has selected format (via radio buttons)
function chooseFormat(id) {
	var module = document.getElementById(id);
	var radios = module.getElementsByTagName("input");
	var chosenFormat;

	// No specific way to check which radio button is checked, so you have to loop through them
	for (var i=0;i<radios.length;i++){
		if (radios[i].checked) {
			chosenFormat = radios[i].value;
			break;
		}
	}

	// Check that a box was actually checked
	if (chosenFormat) {
		sidebar.modules[id].showValueInput(chosenFormat);
	} else {
		return false;
	}
}

// Triggered after the user has inputted the values
function setValues(id) {
	var module = document.getElementById(id);

	// Getting the input values into a single array (that is then parsed through  LineModule/ PlaneModule methods)
	var values = [];
	var inputs = module.getElementsByTagName("input");
	for (var i=0;i<inputs.length;i++) {
		values.push(parseInt(inputs[i].value));
	} 

	sidebar.modules[id].parseValues(values);
	sidebar.showPossibleFunctions(); // Refreshes the buttons at bottom
}

function deleteModule(id) {
	sidebar.deleteModule(id);
	sidebar.showPossibleFunctions(); // Refreshes the buttons at bottom
}

function changeFormat(id) {
	sidebar.modules[id].showFormatSelector();
}

function editValues(id) {
	if (id.startsWith("c")) {
		sidebar.modules[id].refresh();
	} else {
		graph.content[id].resetValues();
		var currentFormat = sidebar.modules[id].format;
		sidebar.modules[id].showValueInput(currentFormat);
	}
	sidebar.showPossibleFunctions(); // Refreshes the buttons at bottom
}

function typingNormal() {
	// When inputting values for plane format r.n = a.n, both n's must be the same
	// Therefore, the second n column is readonly and is filled by whatever is being typed in the first column
	var x = document.getElementsByClassName("typingNormal");
	var y = document.getElementsByClassName("settingNormal");

	for (var i=0;i<3;i++) {
		y[i].value = x[i].value;
	}
}

function importEquations() {
	document.getElementById("importError").innerHTML = "";

	try {
		var jsonData = JSON.parse(document.getElementById("importText").value);
	}
	catch(err) {
		document.getElementById("importError").innerHTML = "Input not valid - only input things that were previously exported, be sure to include [ ]";
		return false;
	}

	for (var i=0;i<jsonData.length;i++) {
		var e = jsonData[i];
		if (e.id.charAt(0) == e.format.charAt(0) || (e.id.startsWith("x") && e.format == "pointCol")) {
			switch (e.id.charAt(0)) {
				case "l":
					sidebar.addNewModule("line",e);
					break;
				case "p":
					sidebar.addNewModule("plane",e);
					break;
				case "x":
					sidebar.addNewModule("point",e);
					break;
				default:
					return false;
			}
		} else {
			document.getElementById("importError").innerHTML = "Input not valid - only input things that were previously exported, be sure to include [ ]";
		}
	}
	sidebar.showPossibleFunctions(); // Refreshes the buttons at bottom

	closeImportExport();
	document.getElementById("importText").value = "";
}
// --------------------------------------------------
// HTML/ CSS Functions
function collapseSideBottom() {
	var arrow = document.getElementsByClassName("collapse-arrow")[0];
	var sm = document.getElementById("side-middle");
	var sb = document.getElementById("side-bottom");
	var currentHeight = sb.offsetHeight;
	var btns = document.getElementById("calc-btns-cont").children;

	if (currentHeight >= 60) {
		// Currently up
		sm.style.height = "calc(100% - 80px)";
		sb.style.height = "50px";
		arrow.style.transform = "rotate(225deg)";
		
		for (var i=0; i<btns.length; i++) {
			btns[i].disabled = true;
		}
	} else {
		// Currently down
		sm.style.height = "calc(75% - 30px)";
		sb.style.height = "25%";
		arrow.style.transform = "rotate(45deg)";

		for (var i=0; i<btns.length; i++) {
			btns[i].disabled = false;
		}
	}
}

function openImportExport() {
	document.getElementById("exportText").value = sidebar.createExportJSON();
	document.getElementById("importCont").style.display = "inherit";
}
function closeImportExport() {
	document.getElementById("importCont").style.display = "none";
	document.getElementById("exportText").value = sidebar.createExportJSON();
}