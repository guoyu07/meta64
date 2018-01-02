import { Factory } from "./Factory";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

//import './index.css';
import { App } from './App';
import { Home } from './pages/Home';

let appElm = document.getElementById('app');
if (!appElm) {
	console.log("app element not found.");
}

window.onerror = function (message, url, line, col, err) {
	var msg = "ERROR: " + message + " [url:" + url + "] line " + line + " col: " + col;
	if (err.stack) {
		msg += " err: " + err.stack;
	}
	console.log(msg);
}

console.log("bundle entrypoint running.");
let factory = new Factory();
factory.constructAll();

ReactDOM.render(<Home />, appElm);

factory.singletons.meta64.initApp();

