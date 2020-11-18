var mp = new ModuleParts;
var sidebar = new Sidebar;
var graph = new Graph;

// --------------------------------------------------

function createNewModule(type) { sidebar.addNewModule(type) };

function chooseFormat(element) {
	var module = element.parentNode;
	var radios = module.getElementsByTagName("input");
	var format;

	// No specific way to check which radio button is checked, so you have to loop through them
	for (var i=0;i<radios.length;i++){
		if (radios[i].checked) {
			format = radios[i].value;
			break;
		}
	}

	// Check that a box was actually checked
	if (format) {
		sidebar.modules[module.id].showValueInput(format);
	} else {
		return false;
	}
}

function setValues(element) {
	var module = element.parentNode.parentNode.parentNode.parentNode;

	var values = [];
	var inputs = module.getElementsByTagName("input");

	for (var i=0;i<inputs.length;i++) {
		values.push(parseInt(inputs[i].value));
	} 

	return sidebar.modules[module.id].parseValues(values);
}