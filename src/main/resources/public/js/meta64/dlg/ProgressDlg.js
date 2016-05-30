console.log("running module: ProgressDlg.js");

var ProgressDlg = function() {
	Dialog.call(this);

	this.domId = "ProgressDlg";
}

var ProgressDlg_ = util.inherit(Dialog, ProgressDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
ProgressDlg_.build = function() {
	var header = this.makeHeader("Processing Request", "", true);

	var progressBar = render.tag("paper-progress", {
		"indeterminate" : "indeterminate",
		"value" : "800",
		"min" : "100",
		"max" : "1000"
	});

	var barContainer = render.tag("div", {
		"style" : "width:300px; margin:24px;",
		"class" : "horizontal center-justified layout"
	}, progressBar);
	
	return header + barContainer;
}

//# sourceURL=ProgressDlg.js

