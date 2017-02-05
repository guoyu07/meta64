'use strict';

if (!window.console) {
	window.console = {
		log : function() {
		},
		error : function() {
		}
	};
}

window.onerror = function(message, url, line, col, err) {
	var msg = "ERROR: " + message + " [url:" + url + "] line " + line + " col: " + col;
	if (err.stack) {
		msg += " err: " + err.stack;
	}
	console.log(msg);
}

console.log("cacheVersion: " + cacheVersion);

/*
 * I had to put a hack inside the SystemJS code to make it allow this cache buster. This is the only cache-busting
 * technique i was able to get to work, and it may be moot anyhow, because I will be going to webpack probably. I just
 * wanted to maintain and ongoing provable support for individual JS file loading approach, so i DO need to maintain
 * this support.
 */
var systemJsCacheBuster = "?ver=" + cacheVersion;

/**
 * IMPORTANT: "Same Origin Policy" is very very strict on the precise text of the name even if it maps in DNS to same
 * thing it must be a text match and may different to browser.
 */
var postTargetUrl = window.location.origin + "/mobile/api/";

// ---------------- SECOND BLOCK:

var bundled = true;

console.log("registering WebComponentsReady listener.");

window.webComponentsReady = null; //todo-0: i think this variable is no longer being used.

addEventListener("WebComponentsReady", function() {
	console.log("WebComponentsReady event. Init modules.");
	window.webComponentsReady = true;

	if (bundled) {
		// when running bundled, no special config() is equired.
	} else {
		SystemJS.config({
			// This attempt at cache busting also failed...
			// map: {
			// cachebuster: '/js/systemjs/cachebuster.js'
			// },

			baseURL : '/js',
			packages : {
				'/js' : {
					defaultJSExtensions : 'js'
				}
			}
		});
	}

	/*
	 * Not sure what's required to make this cach buster work. Currently it has NO EFFECT at all, and i have tried it
	 * with both SystemJS and System. No luck either way.
	 * 
	 * UPDATE: I created the systemJsCacheBuster fix in the SystemJS source and it works, and will have to do until i
	 * find out why overriding System.locate doesn't work.
	 * 
	 * if (!bundled) { var systemLocate = SystemJS.locate; SystemJS.locate = function(load) { var SystemJS = this;
	 * return Promise.resolve(systemLocate.call(this, load)).then(function(address) { console.log("locate: "+address);
	 * if (address.indexOf("/js/") > -1) { return address + System.cacheBust; } return address; }); };
	 * SystemJS.cacheBust = '?bust=' + Date.now(); }
	 */

	if (bundled) {
		console.log("Calling SystemJS.import("+bundleFile+")");

		System.import(bundleFile).then(function(module) {
			System.import("Meta64").then(function(module) {
				module.meta64.initApp();
			});
		});
	} else {
		System.import("/js/Meta64").then(function(module) {
			module.meta64.initApp();
		});
	}
});
