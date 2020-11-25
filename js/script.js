var mp = new ModuleParts;
var sidebar = new Sidebar;
var graph = new Graph;

// --------------------------------------------------

function createNewModule(type) { sidebar.addNewModule(type) };

function clickFormat(id) {
	document.getElementsByClassName(id)[0].checked = true;
}

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

function setValues(id) {
	var module = document.getElementById(id);

	// Getting the input values into a single array (that is then parsed through  LineModule/ PlaneModule methods)
	var values = [];
	var inputs = module.getElementsByTagName("input");
	for (var i=0;i<inputs.length;i++) {
		values.push(parseInt(inputs[i].value));
	} 

	return sidebar.modules[id].parseValues(values);
}

function deleteModule(id) {
	sidebar.deleteModule(id);

	return sidebar.modules;
}

function changeFormat(id) {
	sidebar.modules[id].showFormatSelector();
}

function editValues(id) {
	var currentFormat = sidebar.modules[id].format;
	sidebar.modules[id].showValueInput(currentFormat);
}

function typingNormal() {
	// When inputting values for plane format r.n = a.n, both n's must be the same
	// Therefore, the second n is readonly and is filled by whatever is typing in the first column
	var x = document.getElementsByClassName("typingNormal");
	var y = document.getElementsByClassName("settingNormal");

	for (var i=0;i<3;i++) {
		y[i].value = x[i].value;
	}
}