console.log("running module: prefsPg.js");

var prefsPg = function() {

	var _ = {
		domId : "prefsPg",
		tabId : "dialogsTabName",
		visible : false,
		
		build : function() {

			var header = render.makeDialogHeader("Account Peferences");

			var radioButtons = 
				render.makeRadioButton("Simple", "editModeSimple") + //
				render.makeRadioButton("Advanced", "editModeAdvanced");
			
			var radioButtonGroup = render.tag("paper-radio-group", {
				"id" : "simpleModeRadioGroup",
				"selected" : "editModeSimple"
			}, radioButtons);
			
			var formControls = radioButtonGroup;
			
			var legend = "<legend>Edit Mode:</legend>";
			var radioBar = render.makeHorzControlGroup(legend + formControls);

			var saveButton = render.makeButton("Save", "savePreferencesButton", "prefs.savePreferences();");
			var backButton = render.makeBackButton("Cancel", "cancelPreferencesPgButton", _.domId);
			
			var buttonBar = render.makeHorzControlGroup(saveButton + backButton);

			var closeAccountButton = "";
			/* disabling for polymer 
			render.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
			*/
			
			var closeAccountButtonBar = render.makeHorzControlGroup(closeAccountButton);
			var closeAccountButtonBarDiv = render.tag("div", {
				"class" : "close-account-bar"
			}, closeAccountButtonBar);

			var form = render.tag("div", //
			{
			}, //
			radioBar + buttonBar);

			var internalMainContent = "";
			var mainContent = render.tag("div", //
			{
			}, //
			internalMainContent + form);

			var content = header + mainContent + closeAccountButtonBarDiv;

			util.setHtmlEnhanced(_.domId, content);
		}
	};

	console.log("Module ready: prefsPg.js");
	return _;
}();

//# sourceURL=prefsPg.js
