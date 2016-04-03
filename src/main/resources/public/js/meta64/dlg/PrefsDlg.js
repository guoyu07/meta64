console.log("running module: PrefsDlg.js");

/*
 * Class constructor
 */
var PrefsDlg = function() {
	// boiler plate for inheritance
	Dialog.call(this);

	this.domId = "PrefsDlg";
}

// more boilerplate for inheritance
PrefsDlg.prototype.constructor = PrefsDlg;
util.inherit(Dialog, PrefsDlg);

/*
 * Returns a string that is the HTML content of the dialog
 */
PrefsDlg.prototype.build = function() {
	var header = render.makeDialogHeader("Account Peferences");

	var radioButtons = this.makeRadioButton("Simple", "editModeSimple") + //
	this.makeRadioButton("Advanced", "editModeAdvanced");

	var radioButtonGroup = render.tag("paper-radio-group", {
		"id" : this.id("simpleModeRadioGroup"),
		"selected" : this.id("editModeSimple")
	}, radioButtons);

	var formControls = radioButtonGroup;

	var legend = "<legend>Edit Mode:</legend>";
	var radioBar = render.makeHorzControlGroup(legend + formControls);

	var saveButton = this.makeCloseButton("Save", "savePreferencesButton", PrefsDlg.prototype.savePreferences, this);
	var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");

	var buttonBar = render.centeredButtonBar(saveButton + backButton);

	var closeAccountButton = this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");

	var closeAccountButtonBar = render.centeredButtonBar(closeAccountButton);
	var closeAccountButtonBarDiv = render.tag("div", {
		"class" : "close-account-bar"
	}, closeAccountButtonBar);

	return header + radioBar + buttonBar + closeAccountButtonBarDiv;
}

PrefsDlg.prototype.savePreferences = function() {
	var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
	meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE : meta64.MODE_ADVANCED;
	debugger;
	util.json("saveUserPreferences", {
		"userPreferences" : {
			"advancedMode" : meta64.editModeOption === meta64.MODE_ADVANCED
		}
	}, PrefsDlg.prototype.savePreferencesResponse, this);
}

PrefsDlg.prototype.savePreferencesResponse = function(res) {
	if (util.checkSuccess("Saving Preferences", res)) {
		meta64.selectTab("mainTabName");
		meta64.refresh();
		//todo-2: try and maintain scroll position ? this is going to be async, so watch out.
		//view.scrollToSelectedNode();
	}
}

PrefsDlg.prototype.init = function() {
	var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
	debugger;
	polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this.id("editModeAdvanced"));
	Polymer.dom.flush();
}

//# sourceURL=PrefsDlg.js
