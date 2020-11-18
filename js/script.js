var mp = new ModuleParts;
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
