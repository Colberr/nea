function func(e) {
	var div = e.parentNode;
	var type = div.className;
	console.log(type);

	
}

// Creates a 3-digit index for line and plane equations to be stored at
function createHashId() {
	var d = new Date();
	var t = d.getTime();

	x = Array.from(t.toString()).map(Number); // Creates string of digits
	y = x.reduce((a, b) => a * b + b, 0);

	console.log(t, y);
}