(function(document) {
	'use strict';

	// This is our template element in index.html
	var app = document.querySelector('#app');

	// Listen for template bound event to know when bindings
	// have resolved and content has been stamped to the page
	app.addEventListener('dom-change', function() {
		console.log('Our app is ready to rock!');
	});

	window.addEventListener('polymer-ready', function(e) {
		console.log('polymer-ready event!');
	});

	// See https://github.com/Polymer/polymer/issues/1381
	window.addEventListener('WebComponentsReady', function() {
		// imports are loaded and elements have been registered
	});

	// Scroll page to top and expand header
	app.scrollPageToTop = function() {
		/* needs research for polymer */
		// app.$.headerPanelMain.scrollToTop(true);
	};

})(document);

console.log("Loading scripts.");

$(window).load(function() {

//We load scripts from 'min' (minimized) single file for production, or each individual file
//if not in production.

var scripts = (profileName === 'prod') ? [ "/js/meta64.min.js" ] : //
[ //
"/js/meta64/cnst.js",//
"/js/meta64/jcrCnst.js",//
"/js/meta64/attachment.js", //
"/js/meta64/edit.js", //
"/js/meta64/meta64.js", //
"/js/meta64/nav.js", //
"/js/meta64/prefs.js", //
"/js/meta64/props.js", //
"/js/meta64/render.js", //
"/js/meta64/search.js", //
"/js/meta64/share.js", //
"/js/meta64/user.js", //
"/js/meta64/util.js", //
"/js/meta64/view.js", //
"/js/meta64/pg/popupMenuPg.js",//
"/js/meta64/pg/confirmPg.js",//
"/js/meta64/pg/messagePg.js",//
"/js/meta64/pg/searchResultsPg.js",//
"/js/meta64/pg/loginPg.js",//
"/js/meta64/pg/signupPg.js",//
"/js/meta64/pg/prefsPg.js",//
"/js/meta64/pg/exportPg.js",//
"/js/meta64/pg/importPg.js",//
"/js/meta64/pg/searchPg.js",//
"/js/meta64/pg/changePasswordPg.js",//
"/js/meta64/pg/uploadPg.js",//
"/js/meta64/pg/editNodePg.js",//
"/js/meta64/pg/editPropertyPg.js",//
"/js/meta64/pg/shareToPersonPg.js",//,
"/js/meta64/pg/sharingPg.js", //
"/js/meta64/pg/renameNodePg.js", //
"/js/meta64/pg/timelinePg.js" //
];
/*
Loads all JS files, and then calls initApp once they are all completely loaded
*/
loader.loadScripts(scripts, //
        function() {
        
 /*
 http://stackoverflow.com/questions/33265769/polymer-1-0-on-firefox-referenceerror-polymer-is-not-defined
 https://github.com/Polymer/polymer/issues/1381
 */
 addEventListener('WebComponentsReady', function() {
       meta64.initApp();
               });
        });
});