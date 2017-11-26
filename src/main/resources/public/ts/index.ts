import { Factory } from "./Factory";

window.onerror = function (message, url, line, col, err) {
	var msg = "ERROR: " + message + " [url:" + url + "] line " + line + " col: " + col;
	if (err.stack) {
		msg += " err: " + err.stack;
	}
	console.log(msg);
}

console.log("registering WebComponentsReady listener.");

addEventListener("WebComponentsReady", function () {
	console.log("WebComponentsReady event.");
	let factory = new Factory();
	factory.constructAll();
	factory.singletons.meta64.initApp();
});
