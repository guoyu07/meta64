console.log("running module: DonateDlg.js");

/*
 * Class constructor
 */
var DonateDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);
	
	this.domId = "DonateDlg";
}

// more boilerplate for inheritance
DonateDlg.prototype.constructor = DonateDlg;
util.inherit(Dialog, DonateDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
DonateDlg.prototype.build = function() {
	/*
	 * Warning: Due to apparent bug in polymer the single open/close tag style like </donate-panel> will
	 * cause problems by truncating all content after the donate-panel content, so leave this as separate
	 * open/close tags.
	 */
	var content = "<donate-panel></donate-panel>";

	content += render.centeredButtonBar(this.makeCloseButton("Close", "DonateDlgCloseButton"));
	
	return content;
}

DonateDlg.prototype.init = function() {
	
}

//# sourceURL=DonateDlg.js
